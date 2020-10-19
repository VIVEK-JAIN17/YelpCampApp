const express = require("express");
const router = express.Router();
const Campground = require("../models/campground");
const User = require("../models/user");
const auth = require("../middleware");

router.get("/:id/profile", (req, res) => {
    User.findById(req.params.id)
        .then((user) => {
            if (user != null) {
                Campground.find({ "author.id": req.params.id })
                    .then((campgrounds) => {
                        if (campgrounds != null) {
                            res.render("users/show", { user: user, campgrounds: campgrounds });
                        } else {
                            req.flash("error", "Something Went Wrong !!");
                            res.redirect("back");
                        }
                    }).catch((err) => {
                        req.flash("error", `Something Went Wrong !! ${err.message}`);
                        res.redirect("back");
                    });
            } else {
                req.flash("error", "Something Went Wrong !!");
                res.redirect("back");
            }
        }).catch((err) => {
            req.flash("error", `Something Went Wrong !! ${err.message}`);
            res.redirect("back");
        });
});

router.get("/:id/edit", auth.verifyUser, (req, res) => {
    res.render("users/edit", { user: req.user });
});

router.put("/:id/profile", auth.verifyUser, (req, res) => {
    var address = {
        address: req.body.address,
        state: req.body.state,
        country: req.body.country
    }
    req.body.user.address = address;
    User.findByIdAndUpdate(req.user._id, req.body.user)
        .then((user) => {
            req.flash("success", "Updated User Credentials !!");
            res.redirect(`/users/${req.params.id}/dashboard`);
        }).catch((err) => {
            req.flash("error", `Something Went Wrong !! ${err.message}`);
            res.redirect("back");
        });
});

router.get("/:id/dashboard", auth.verifyUser, (req, res) => {
    User.findById(req.user._id)
        .then((user) => {
            if (user != null) {
                Campground.find({ "author.id": req.user._id })
                    .then((campgrounds) => {
                        if (campgrounds != null) {
                            res.render("users/dashboard", { user: user, campgrounds: campgrounds });
                        } else {
                            req.flash("error", "Something Went Wrong !!");
                            res.redirect("back");
                        }
                    }).catch((err) => { console.log(err); });
            } else {
                req.flash("error", "Something Went Wrong !!");
                res.redirect("back");
            }
        }).catch((err) => {
            req.flash("error", `Something Went Wrong !! ${err.message}`);
            res.redirect("back");
        });
});

module.exports = router;