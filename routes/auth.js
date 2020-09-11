const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');

router.route("/register")
    .get((req, res) => {
        if (req.user) {
            return res.sendStatus(403);
        }
        res.render("register");

    }).post((req, res) => {
        if (!req.user) {
            var newUser = new User({ username: req.body.username });
            User.register(newUser, req.body.password, (err, user) => {
                if (err) {
                    console.log("Error while signing up !!\n\n", err);
                    return res.redirect("/register");
                }
                passport.authenticate('local')(req, res, function () {
                    console.log("User registered successfully !!\n");
                    res.redirect("/campgrounds");

                });
            });
        } else {
            return res.sendStatus(403);
        }

    });

router.route("/login")
    .get((req, res) => {
        if (req.user) {
            return res.sendStatus(403);
        }
        res.render("login");

    }).post(passport.authenticate('local', {
        failureRedirect: "/login",

    }), (req, res) => {
        console.log("User " + req.body.username + " loggedin successfully !!");
        console.log("sessoin started \n", req.session);
        res.redirect("/campgrounds");

    });

router.get("/logout", isLoggedin, (req, res) => {
    console.log("logging out user ... " + req.session.passport.user);
    req.session.destroy();
    res.clearCookie('session-id');
    console.log("logged out sccessfully");
    res.redirect("/");
});

function isLoggedin(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
};

module.exports = router;