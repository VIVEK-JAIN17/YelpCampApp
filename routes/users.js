const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');
const Comment = require('../models/comment');
const User = require('../models/user');
const auth = require('../middleware');

router.get('/:id/profile', (req, res) => {
    User.findById(req.params.id)
        .then((user) => {
            if (user != null) {
                Campground.find({ 'author.id': req.params.id })
                    .then((campgrounds) => {
                        if (campgrounds != null) {
                            console.log("Found User ! Rendering Profile !!");
                            res.render("users/show", { user: user, campgrounds: campgrounds });
                        } else {
                            req.flash("error", "Something Went Wrong !!");
                            res.redirect('back');
                        }
                    }).catch((err) => { console.log(err); });
            } else {
                req.flash("error", "Something Went Wrong !!");
                res.redirect('back');
            }
        }).catch((err) => { console.log(err); });
});

module.exports = router;