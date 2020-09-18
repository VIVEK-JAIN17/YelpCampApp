const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');
const Comment = require('../models/comment');
const auth = require('../middleware');

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
    var name = req.body.name;
    var image = req.body.image;
    var price = req.body.price;
    var desc = req.body.desc;
    var author = {
        "id": req.user._id,
        "username": req.user.username
    }
    var newCampground = { name: name, image: image, price: price, description: desc, author: author }
    Campground.create(newCampground)
        .then((camp) => {
            console.log("Successfully posted a new camp on website !\n", camp);
            res.redirect("/campgrounds");

        }).catch((err) => {
            console.log("An Error Occured while posting !", err);
            req.flash("error", `Database error : ${err.message}`);
            res.redirect("/campgrounds");
        });

});

// SHOW : Shows the details of a particular item (here, campground)
router.get("/:id", (req, res) => {
    // couldn't figure out how to use promises here!
    Campground.findById(req.params.id).populate("comments").exec((err, campDetails) => {
        if (err) {
            console.log(err);
        } else {
            console.log("Found the campground correctly !!");
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
    Campground.findByIdAndUpdate(req.params.id, req.body.camp)
        .then((campground) => {
            console.log("Successfully Updated Campground !!\n", campground);
            req.flash("success", "updated details of the campground !");
            res.redirect("/campgrounds/" + req.params.id);

        }).catch((err) => { console.log(err); });
});

// DELETE : Deletes a Campground
router.delete("/:id", auth.authCamp, (req, res) => {
    Campground.findByIdAndRemove(req.params.id)
        .then((campground) => {
            campground.comments.forEach(comment => {
                Comment.findByIdAndRemove(comment)
                    .then(() => { console.log("comment deleted !!"); })
                    .catch((err) => { console.log(err); })
            });

        }).then(() => {
            console.log("Successfully Deleted Campground !");
            req.flash("success", "Successfully Deleted Campground !");
            res.redirect("/campgrounds");

        }).catch((err) => { console.log(err); });
});

module.exports = router;