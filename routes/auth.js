const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');
const auth = require('../middleware');

router.route("/register")
    .get((req, res) => {
        if (req.user) {
            console.log(req.user);
            req.flash("error", `You are already logged in as ${req.user.username} !!`);
            return res.redirect("back");
        }
        res.render("register");

    }).post((req, res) => {
        if (!req.user) {
            var newUser = new User({
                username: req.body.username,
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email
            });
            User.register(newUser, req.body.password, (err, user) => {
                if (err) {
                    console.log("Error while signing up !!");
                    req.flash("error", `error: ${err.message}`);
                    return res.redirect("/register");
                }
                passport.authenticate('local')(req, res, () => {
                    console.log("User registered successfully !!\n");
                    req.flash("success", `user registered successfully !! Welcome ${req.body.username} !`);
                    res.redirect("/campgrounds");

                });
            });
        } else {
            req.flash("error", `You are already logged in as ${req.user.username} !!`);
            res.redirect("back");
        }

    });

router.route("/login")
    .get((req, res) => {
        if (req.user) {
            req.flash("error", `You are already logged in as ${req.user.username} !!`);
            return res.redirect("back");
        }
        res.render("login");

    }).post(passport.authenticate('local', {
        failureRedirect: "/login",
        failureFlash: true,

    }), (req, res) => {
        console.log("User " + req.body.username + " loggedin successfully !!");
        req.flash("success", `logged in successfully !! Welcome ${req.body.username} !`);
        console.log("sessoin started \n", req.session);
        res.redirect("/campgrounds");

    });

router.get("/logout", auth.isLoggedin, (req, res) => {
    console.log("logging out user ... " + req.session.passport.user);
    req.session.destroy();
    res.clearCookie('session-id');
    console.log("logged out sccessfully");
    res.redirect("/");
});

module.exports = router;