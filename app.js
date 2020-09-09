const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Campground = require('./models/campground');
const Comment = require('./models/comment');
const User = require('./models/user');
// const session = require('express-session');
const seedDB = require('./seed');

// seedDB();

// Connection URL
const url = 'mongodb://localhost:27017/YelpCamp';
const connect = mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

// PASSPORT CONFIGURATION
app.use(require('express-session')({
    name: "session-id",
    secret: "Passport-Authentication",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Creating several routes for the app
// 1. A route to the landing page
// 2. A route to view all the campgrounds
// 3. A route to create/sbmit a new campground
// 4. A route that will contain the form for creating a new campground

app.get("/", (req, res) => {
    res.render("home");
});

// INDEX : Shows all the Items(here, Campgrounds)
app.get("/campgrounds", (req, res) => {
    Campground.find({})
        .then((campgrounds) => {
            res.render("campgrounds/index", { campgrounds: campgrounds });

        }).catch((err) => console.log(err));
});

// CREATE : Actually creates a new item (here, campground)
app.post("/campgrounds", (req, res) => {
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.desc;
    var newCampground = { name: name, image: image, description: desc }
    Campground.create(newCampground)
        .then((camp) => {
            console.log("Successfully posted a new camp on website !", camp);
            res.redirect("/campgrounds");

        }).catch((err) => {
            console.log("An Error Occured while posting !", err);
            res.send("<h1>An Error Occured while posting ! </h1>")
        });
});

// NEW : Shows a form to create a new item (here, campground)
app.get("/campgrounds/new", (req, res) => {
    res.render("campgrounds/new");
});

// SHOW : Shows the details of a particular item (here, campground)
// app.get("/campground/:id", function (req, res) {
//     Campground.findById(req.params.id)
//         .then((campDetails) => {
//             console.log("Details of the campground are ", campDetails);
//             res.render("show", { campground: campDetails });

//         }).catch((err) => console.log(err));
// })

// SHOW : Shows the details of a particular item (here, campground)
app.get("/campgrounds/:id", function (req, res) {
    // couldn't figure out how to use promises here!
    Campground.findById(req.params.id).populate("comments").exec((err, campDetails) => {
        if (err) {
            console.log(err);
        } else {
            console.log("Found the campground correctly !!");
            res.render("campgrounds/show", { campground: campDetails });
        }
    });
})

// ===========================================================
// COMMENT ROUTES
// ===========================================================

app.get("/campgrounds/:id/comments/new", (req, res) => {
    Campground.findById(req.params.id)
        .then((campground) => {
            res.render("comments/new", { campground: campground });

        }).catch((err) => { console.log(err) });
});

app.post("/campgrounds/:id/comments", (req, res) => {
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

// ===========================================================
// AUTHENTICAITON ROUTES
// ===========================================================

// Show register form/page
app.get("/register", (req, res) => {
    res.render("register");
});

// Registers a user 
app.post("/register", (req, res) => {
    var newUser = new User({ username: req.body.username });
    User.register(newUser, req.body.password, (err, user) => {
        if (err) {
            console.log("Error while signing up !!\n\n", err);
            return res.redirect("/register");
        }
        // res.redirect("/login");
        passport.authenticate('local')(req, res, function () {
            console.log("User registered successfully !!\n");
            res.redirect("/campgrounds");

        });
    });
});

connect.then((db) => {
    console.log("Correctly Connected to MongoDB Server");
}).catch((err) => console.log(err));

app.listen(3001, function () {
    console.log("The Yelp Camp Server is up and running !");
})