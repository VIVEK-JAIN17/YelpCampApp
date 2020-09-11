const express = require('express');
const router = express.Router({ mergeParams: true });
const Campground = require('../models/campground');
const Comment = require('../models/comment');

router.get("/new", isLoggedin, (req, res) => {
    Campground.findById(req.params.id)
        .then((campground) => {
            res.render("comments/new", { campground: campground });

        }).catch((err) => {
            console.log(err)
        });
});

router.post("/", isLoggedin, (req, res) => {
    Campground.findById(req.params.id)
        .then((camp) => {
            Comment.create(req.body.comment)
                .then((comment) => {
                    camp.comments.push(comment);
                    camp.save()
                        .then(() => {
                            console.log("Comment Posted Successfully !");
                            res.redirect("/campgrounds/" + req.params.id);

                        }).catch((err) => { console.log("Error while posting comment\n", err) })

                }).catch((err) => {
                    console.log("Error while creating Comment\n", err);
                });

        }).catch((err) => {
            console.log("Camp Not Found\n", err);
        })
});

function isLoggedin(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
};

module.exports = router;