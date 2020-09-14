const express = require('express');
const Campground = require('../models/campground');
const Comment = require('../models/comment');

exports.isLoggedin = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You are Not Logged In !!");
    res.redirect("/login");
}

exports.authCamp = (req, res, next) => {
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id)
            .then((campground) => {
                if (campground.author.id.equals(req.user._id)) {
                    return next();
                } else {
                    req.flash("error", "you do not have permission to do that !!");
                    res.redirect("back");
                }
            }).catch((err) => { console.log(err); });
    } else {
        req.flash("error", "you are not logged in !!");
        res.redirect("back");
    }
}

exports.authComment = (req, res, next) => {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.commentId)
            .then((comment) => {
                if (comment.author.id.equals(req.user._id)) {
                    return next();
                } else {
                    req.flash("error", "you do not have permission to do that !!");
                    res.redirect("back");
                }
            }).catch((err) => { console.log(err); });
    } else {
        req.flash("error", "you are not logged in !!");
        res.redirect("back");
    }
}