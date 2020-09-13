const express = require('express');
const Campground = require('../models/campground');
const Comment = require('../models/comment');

exports.isLoggedin = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

exports.authCamp = (req, res, next) => {
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

exports.authComment = (req, res, next) => {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.commentId)
            .then((comment) => {
                if (comment.author.id.equals(req.user._id)) {
                    return next();
                } else {
                    res.redirect("back");
                }
            }).catch((err) => { console.log(err); });
    } else {
        res.redirect("back");
    }
}