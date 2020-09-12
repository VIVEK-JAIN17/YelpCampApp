const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');
const Comment = require('../models/comment');

// INDEX : Shows all the Items(here, Campgrounds)
router.get("/", (req, res) => {
    Campground.find({})
        .then((campgrounds) => {
            res.render("campgrounds/index", { campgrounds: campgrounds });

        }).catch((err) => console.log(err));

})

// NEW : Shows a form to create a new item (here, campground)
router.get("/new", isLoggedin, (req, res) => {
    res.render("campgrounds/new");

});


// CREATE : Actually creates a new item (here, campground)
router.post("/", isLoggedin, (req, res) => {
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.desc;
    var author = {
        "id": req.user._id,
        "username": req.user.username
    }
    var newCampground = { name: name, image: image, description: desc, author: author }
    Campground.create(newCampground)
        .then((camp) => {
            console.log("Successfully posted a new camp on website !", camp);
            res.redirect("/campgrounds");

        }).catch((err) => {
            console.log("An Error Occured while posting !", err);
            res.send("<h1>An Error Occured while posting ! </h1>")
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

router.get("/:id/edit", verifyuser, (req, res) => {
    Campground.findById(req.params.id)
        .then((campground) => {
            res.render("campgrounds/edit", { campground: campground });

        }).catch((err) => { console.log(err); });
});

router.put("/:id", verifyuser, (req, res) => {
    Campground.findByIdAndUpdate(req.params.id, req.body.camp)
        .then((campground) => {
            console.log("Successfully Updated Campground !!\n", campground);
            res.redirect("/campgrounds/" + req.params.id);

        }).catch((err) => { console.log(err); });
});

router.delete("/:id", verifyuser, (req, res) => {
    Campground.findByIdAndRemove(req.params.id)
        .then((campground) => {
            campground.comments.forEach(comment => {
                Comment.findByIdAndRemove(comment)
                    .then(() => { console.log("comment deleted !!"); })
                    .catch((err) => { console.log(err); })
            });

        }).then(() => {
            console.log("Successfully Deleted Campground !");
            res.redirect("/campgrounds");

        }).catch((err) => { console.log(err); });
});

// SHOW : Shows the details of a particular item (here, campground)
// .get("/campground/:id", function (req, res) {
//     Campground.findById(req.params.id)
//         .then((campDetails) => {
//             console.log("Details of the campground are ", campDetails);
//             res.render("show", { campground: campDetails });

//         }).catch((err) => console.log(err));
// })

// middleware
function isLoggedin(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

function verifyuser(req, res, next) {
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id)
            .then((campground) => {
                if (campground.author.id.equals(req.user._id)) {
                    return next();
                } else {
                    res.redirect("back");
                }
            }).catch((err) => { console.log(err); });
    } else {
        res.redirect("back");
    }
}

module.exports = router;