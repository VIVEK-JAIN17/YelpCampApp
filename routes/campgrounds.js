const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');
const Comment = require('../models/comment');
const auth = require('../middleware');
const NodeGeocoder = require('node-geocoder');

const options = {
    provider: 'opencage',
    apiKey: process.env.GEOCODER_API_KEY,
    formatter: null
};

const geocoder = NodeGeocoder(options);

// INDEX : Shows all the Items(here, Campgrounds)
router.get("/", (req, res) => {
    Campground.find({})
        .then((campgrounds) => {
            res.render("campgrounds/index", { campgrounds: campgrounds });

        }).catch((err) => console.log(err));

})

// NEW : Shows a form to create a new item (here, campground)
router.get("/new", auth.isLoggedin, (req, res) => {
    res.render("campgrounds/new");

});

// CREATE : Actually creates a new item (here, campground)
router.post("/", auth.isLoggedin, (req, res) => {
    req.body.camp.author = {
        "id": req.user._id,
        "username": req.user.username
    }
    geocoder.geocode(req.body.location, (err, data) => {
        if (err || !data.length) {
            req.flash("error", "Invalid Location !!");
            console.log(err);
            return res.redirect('back');
        }
        req.body.camp.lat = data[0].latitude;
        req.body.camp.lng = data[0].longitude;
        req.body.camp.location = data[0].formattedAddress;
        Campground.create(req.body.camp)
            .then((camp) => {
                res.redirect("/campgrounds");

            }).catch((err) => {
                console.log("An Error Occured while posting !", err);
                req.flash("error", `Database error : ${err.message}`);
                res.redirect("/campgrounds");
            });
    });
});

// SHOW : Shows the details of a particular item (here, campground)
router.get("/:id", (req, res) => {
    // couldn't figure out how to use promises here!
    Campground.findById(req.params.id).populate("comments").exec((err, campDetails) => {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/show", { campground: campDetails });
        }
    });
});

// EDIT : Renders a form to Update Campground
router.get("/:id/edit", auth.authCamp, (req, res) => {
    Campground.findById(req.params.id)
        .then((campground) => {
            res.render("campgrounds/edit", { campground: campground });

        }).catch((err) => { console.log(err); });
});

// UPDATE : Actually Updates a Campground 
router.put("/:id", auth.authCamp, (req, res) => {
    geocoder.geocode(req.body.location, (err, data) => {
        if (err || !data.length) {
            req.flash("error", "Invalid Location !!");
            console.log(err);
            return res.redirect('back');
        }
        req.body.camp.lat = data[0].latitude;
        req.body.camp.lng = data[0].longitude;
        req.body.camp.location = req.body.location + ', ' + data[0].state + ', ' + data[0].country;
        Campground.findByIdAndUpdate(req.params.id, req.body.camp)
            .then((campground) => {
                req.flash("success", "updated details of the campground !");
                res.redirect("/campgrounds/" + req.params.id);

            }).catch((err) => { console.log(err); });
    });
});

// DELETE : Deletes a Campground
router.delete("/:id", auth.authCamp, (req, res) => {
    Campground.findByIdAndRemove(req.params.id)
        .then((campground) => {
            campground.comments.forEach(comment => {
                Comment.findByIdAndRemove(comment)
                    .catch((err) => { console.log(err); })
            });

        }).then(() => {
            req.flash("success", "Successfully Deleted Campground !");
            res.redirect("/campgrounds");

        }).catch((err) => { console.log(err); });
});

module.exports = router;