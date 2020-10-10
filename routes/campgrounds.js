const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');
const Comment = require('../models/comment');
const auth = require('../middleware');

// ********** Node GeoCoder **********
const NodeGeocoder = require('node-geocoder');

const options = {
    provider: 'opencage',
    apiKey: process.env.GEOCODER_API_KEY,
    formatter: null
};

const geocoder = NodeGeocoder(options);

// ********** Multer **********
const multer = require('multer');
const storage = multer.diskStorage({
    filename: function (req, file, cb) {
        cb(null, Date.now() + '_' + file.originalname);
    }
});

const imageFileFilter = (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('You can upload only image files!'), false);
    }
    cb(null, true);
};

const upload = multer({ storage: storage, fileFilter: imageFileFilter });

// ********** Cloudinary **********
const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: 'imagecloud-vj-172000',
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// INDEX : Shows all the Items(here, Campgrounds)
router.get("/", (req, res) => {
    if (req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        Campground.find({ name: regex })
            .then((campgrounds) => {
                if (campgrounds.length < 1) {
                    req.flash("info", "not found anything relating to your search !");
                    return res.redirect("/");
                } else if (campgrounds.length === 1) {
                    Campground.findById(campgrounds[0]._id).populate("comments")
                        .then((campDetails) => {
                            res.render("campgrounds/show", { campground: campDetails });
                        }).catch((err) => { console.log(err) });
                } else {
                    res.render("campgrounds/index", { campgrounds: campgrounds });
                }

            }).catch((err) => console.log(err));
    } else {
        Campground.find({})
            .then((campgrounds) => {
                res.render("campgrounds/index", { campgrounds: campgrounds });

            }).catch((err) => console.log(err));
    }
});

// NEW : Shows a form to create a new item (here, campground)
router.get("/new", auth.isLoggedin, (req, res) => {
    res.render("campgrounds/new");

});

// CREATE : Actually creates a new item (here, campground)
router.post("/", auth.isLoggedin, upload.single('image'), (req, res) => {
    cloudinary.uploader.upload(req.file.path, (err, result) => {
        if (err) {
            console.log(err);
            req.flash("error", `an error occured while uploading: ${err.message}`);
            return res.redirect('back');
        }
        req.body.camp.image = {
            id: result.public_id,
            url: result.secure_url
        }
        req.body.camp.author = {
            "id": req.user._id,
            "username": req.user.username
        }
        geocoder.geocode(req.body.location, (err, data) => {
            if (err) {
                req.flash("error", "Invalid Location !!");
                console.log(err);
                return res.redirect('back');
            }
            var answer;
            var found = false;
            data.forEach(result => {
                if(!result.state) return;
                if (compareTo(result.state.toLowerCase(), req.body.state.toLowerCase())) {
                    answer = result;
                    found = true;
                    return;
                }
            });
            if (!found) {
                req.flash("error", "sorry! couldn't find any such place !");
                return res.redirect('back');
            }
            req.body.camp.lat = answer.latitude;
            req.body.camp.lng = answer.longitude;
            req.body.camp.location = {
                place: req.body.location,
                state: answer.state,
                country: answer.country
            }
            Campground.create(req.body.camp)
                .then((camp) => {
                    res.redirect("/campgrounds");

                }).catch((err) => {
                    console.log("An Error Occured while posting !", err);
                    req.flash("error", `Database error : ${err.message}`);
                    res.redirect("/campgrounds");
                });
        });
    });
});

// SHOW : Shows the details of a particular item (here, campground)
router.get("/:id", (req, res) => {
    // couldn't figure out how to use promises here!
    Campground.findById(req.params.id).populate("comments").exec((err, campDetails) => {
        if (err) {
            console.log(err);
        } else {
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
router.put("/:id", auth.authCamp, upload.single('image'), (req, res) => {
    Campground.findById(req.params.id, async (err, campground) => {
        if (err) {
            console.log(err);
            req.flash("error", `something went wrong ${err.message} !`);
            return res.redirect('back');
        }
        try {
            var data = await geocoder.geocode(req.body.location);
            var answer;
            var found = false;
            data.forEach(result => {
                if(!result.state) return;
                if (compareTo(result.state.toLowerCase(), req.body.state.toLowerCase())) {
                    answer = result;
                    found = true;
                    return;
                }
            });
            if (!found) {
                req.flash("error", "sorry! couldn't find any such place !");
                return res.redirect('back');
            }
            campground.lat = answer.latitude;
            campground.lng = answer.longitude;
            campground.location = {
                place: req.body.location,
                state: answer.state,
                country: answer.country
            }
            if (req.file) {
                try {
                    await cloudinary.uploader.destroy(campground.image.id);
                    var result = await cloudinary.uploader.upload(req.file.path);
                    campground.image = {
                        id: result.public_id,
                        url: result.secure_url
                    }
                } catch (err) {
                    console.log(err);
                    req.flash("error", `something went wrong ${err.message} !`);
                    return res.redirect('back');
                }
            }
            campground.name = req.body.camp.name;
            campground.price = req.body.camp.price;
            campground.description = req.body.camp.description;
            campground.save();
            req.flash("success", "successfully updated details of the campground !");
            res.redirect("/campgrounds/" + req.params.id);

        } catch (err) {
            console.log(err);
            req.flash("error", `something went wrong ${err.message} !`);
            return res.redirect('back');
        }
    });
});

// DELETE : Deletes a Campground
router.delete("/:id", auth.authCamp, (req, res) => {
    Campground.findById(req.params.id)
        .then((campground) => {
            campground.comments.forEach(comment => {
                Comment.findByIdAndRemove(comment)
                    .catch((err) => { console.log(err); })
            });
            return campground;
        }).then((campground) => {
            cloudinary.uploader.destroy(campground.image.id, (err) => {
                if (err) {
                    console.log(err);
                    req.flash("error", `something went wrong ! ${err.message} !!`);
                    return res.redirect('back');
                }
                campground.remove();
                req.flash("success", "Successfully Deleted Campground !");
                res.redirect('back');
            });
        }).catch((err) => { console.log(err); });
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

function compareTo(str1, str2) {
    let i = 0, j = 0;
    while (i < str1.length && j < str2.length) {
        if (str1[i] !== str2[j]) {
            return false;
        }
        i++;
        j++;
    }
    return true;
};

module.exports = router;