const express = require('express');
const campground = require('../models/campground');
const router = express.Router({ mergeParams: true });
const Campground = require('../models/campground');
const Comment = require('../models/comment');

// COMMENTS GET (RENDERS NEW COMMENT FORM)
router.get("/new", isLoggedin, (req, res) => {
    Campground.findById(req.params.id)
        .then((campground) => {
            res.render("comments/new", { campground: campground });

        }).catch((err) => {
            console.log(err)
        });
});

// COMMENTS CREATE (POSTS NEW COMMENT)
router.post("/", isLoggedin, (req, res) => {
    Campground.findById(req.params.id)
        .then((camp) => {
            Comment.create(req.body.comment)
                .then((comment) => {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
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

// COMMENTS EDIT (RENDERS EDIT COMMENT FORM)
router.get("/:commentId/edit", (req, res) => {
    Comment.findById(req.params.commentId)
        .then((comment) => {
            res.render("comments/edit", {
                campground_id: req.params.id,
                comment: comment
            });

        }).catch((err) => { console.log(err); })
});

// COMMENTS UPDATE (UPDATES COMMENT)
router.put("/:commentId", (req, res) => {
    Comment.findByIdAndUpdate(req.params.commentId, req.body.comment)
        .then((comment) => {
            console.log(req.body.comment)
            console.log("Successfully updated comment\n", comment);
            res.redirect("/campgrounds/" + req.params.id);
        }).catch((err) => { console.log(err); });
});

// COMMENTS DELETE (DELETES A COMMENT)
router.delete("/:commentId", (req, res) => {
    Comment.findByIdAndRemove(req.params.commentId)
        .then(() => {
            console.log("comment deleted succesfully !!");
            res.redirect("/campgrounds/" + req.params.id);

        }).catch((err) => { console.log("Error deleting Comment !\n", err); });
});

function isLoggedin(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
};

module.exports = router;