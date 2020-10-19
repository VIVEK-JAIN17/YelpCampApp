const express = require("express");
const router = express.Router();
const Campground = require("../models/campground");
const Comment = require("../models/comment");
const auth = require("../middleware");

// ********** Node GeoCoder **********
const NodeGeocoder = require("node-geocoder");

const options = {
    provider: "opencage",
    apiKey: process.env.GEOCODER_API_KEY,
    formatter: null
};

const geocoder = NodeGeocoder(options);

// ********** Multer **********
const multer = require("multer");
const storage = multer.diskStorage({
    filename: function (req, file, cb) {
        cb(null, Date.now() + "_" + file.originalname);
    }
});

const imageFileFilter = (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error("You can upload only image files!"), false);
    }
    cb(null, true);
};

const upload = multer({ storage: storage, fileFilter: imageFileFilter });

// ********** Cloudinary **********
const cloudinary = require("cloudinary").v2;
cloudinary.config({
    cloud_name: "imagecloud-vj-172000",
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// INDEX : Shows all the Items(here, Campgrounds)
router.get("/", (req, res) => {
    if (req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), "gi");
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

            }).catch((err) => {
                req.flash("error", "database error ! Could not find anything !!");
                res.redirect("/");
            });
    } else {
        Campground.find({})
            .then((campgrounds) => {
                res.render("campgrounds/index", { campgrounds: campgrounds });

            }).catch((err) => {
                req.flash("error", "database error ! Could not find anything !!");
                res.redirect("/");
            });
    }
});

// NEW : Shows a form to create a new item (here, campground)
router.get("/new", auth.isLoggedin, (req, res) => {
    res.render("campgrounds/new");
});

// CREATE : Actually creates a new item (here, campground)
router.post("/", auth.isLoggedin, upload.single("image"), async (req, res) => {
    var data = await geocoder.geocode(req.body.location);
    try {
        // setting user details
        req.body.camp.author = {
            "id": req.user._id,
            "username": req.user.username
        }
        var answer;
        var found = false;
        data.forEach(result => {
            if (!result.state) return;
            if (compareTo(result.state.toLowerCase(), req.body.state.toLowerCase())) {
                answer = result;
                found = true;
                return;
            }
        });
        if (!found) {
            req.flash("error", "sorry! could not find any such place !");
            return res.redirect("back");
        }
        // setting location details
        req.body.camp.lat = answer.latitude;
        req.body.camp.lng = answer.longitude;
        req.body.camp.location = {
            place: req.body.location,
            state: answer.state,
            country: answer.country
        }
    } catch (err) {
        req.flash("error", "Invalid Location !!");
        return res.redirect("back");
    }

    var result = await cloudinary.uploader.upload(req.file.path)
    try {
        // setting image details
        req.body.camp.image = {
            id: result.public_id,
            url: result.secure_url
        }
        // creating the campground
        Campground.create(req.body.camp)
            .then((camp) => {
                res.redirect("/campgrounds");

            }).catch((err) => {
                req.flash("error", `Database error : ${err.message}`);
                res.redirect("/campgrounds");
            });
    } catch (err) {
        req.flash("error", `an error occured while uploading: ${err.message}`);
        return res.redirect("back");
    }
});

// SHOW : Shows the details of a particular item (here, campground)
router.get("/:id", (req, res) => {
    Campground.findById(req.params.id).populate("comments").exec((err, campDetails) => {
        if (err) {
            // Cast Error - Invalid ObjectId 
            req.flash("error", `trouble loading campground !`);
            res.redirect("/campgrounds");
        } else {
            if (campDetails) {
                res.render("campgrounds/show", { campground: campDetails });
            } else {
                // Null Campground 
                req.flash("error", "Can not find Campground !!");
                res.redirect("/campgrounds");
            }
        }
    });
});

// EDIT : Renders a form to Update Campground
router.get("/:id/edit", auth.authCamp, (req, res) => {
    if (req.foundCamp) {
        res.render("campgrounds/edit", { campground: req.foundCamp });
    } else {
        // Null Campground
        req.flash("error", "campground does not exist !");
        res.redirect("/campgrounds");
    }
});

// UPDATE : Actually Updates a Campground 
router.put("/:id", auth.authCamp, upload.single("image"), (req, res) => {
    if (req.foundCamp) {
        var campground = req.foundCamp;
        async function func() {
            try {
                if (!compareTo(campground.location.place.toLowerCase(), req.body.location.toLowerCase())) {
                    var data = await geocoder.geocode(req.body.location);
                    var answer;
                    var found = false;
                    data.forEach(result => {
                        if (!result.state) return;
                        if (compareTo(result.state.toLowerCase(), req.body.state.toLowerCase())) {
                            answer = result;
                            found = true;
                            return;
                        }
                    });
                    if (!found) {
                        req.flash("error", "sorry! could not find any such place !");
                        return res.redirect("back");
                    }
                    campground.lat = answer.latitude;
                    campground.lng = answer.longitude;
                    campground.location = {
                        place: req.body.location,
                        state: answer.state,
                        country: answer.country
                    }
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
                        req.flash("error", `something went wrong ${err.message} !`);
                        return res.redirect("back");
                    }
                }
                campground.name = req.body.camp.name;
                campground.price = req.body.camp.price;
                campground.description = req.body.camp.description;
                campground.save();
                req.flash("success", "successfully updated details of the campground !");
                res.redirect(`/campgrounds/${req.params.id}`);

            } catch (err) {
                req.flash("error", `something went wrong ${err.message} !`);
                return res.redirect("back");
            }
        }
        func();
    } else {
        // Tried Operations on Null Campground
        req.flash("err", "Something went wrong !!");
        res.redirect("/campgrounds");
    }
});

// DELETE : Deletes a Campground
router.delete("/:id", auth.authCamp, (req, res) => {
    if (req.foundCamp) {
        var campground = req.foundCamp;
        campground.comments.forEach(comment => {
            Comment.findByIdAndRemove(comment)
                .catch((err) => {
                    res.statusCode = 500;
                    res.json({ "error": "Internal Server Error !!" });
                })
        });
        cloudinary.uploader.destroy(campground.image.id, (err) => {
            if (err) {
                req.flash("error", `something went wrong ! ${err.message} !!`);
                return res.redirect("/campgrounds");
            }
            campground.deleteOne({ _id: campground._id });
            req.flash("success", "Successfully Deleted Campground !");
            res.redirect("/campgrounds");
        });
    } else {
        // Tried Operations on Null Campground
        req.flash("error", "campground does not exist !");
        res.redirect("/campgrounds");
    }
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