const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const request = require("request");
const mongoose = require('mongoose');
const assert = require('assert');

// SCHEMA SETUP
const campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});

const Campground = mongoose.model("Campground", campgroundSchema);

// Connection URL
const url = 'mongodb://localhost:27017/YelpCamp';
const connect = mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

// Creating several routes for the app
// 1. A route to the landing page
// 2. A route to view all the campgrounds
// 3. A route to create/sbmit a new campground
// 4. A route that will contain the form for creating a new campground

app.get("/", function (req, res) {
    res.render("home");
});

// INDEX : Shows all the Items(here, Campgrounds)
app.get("/campgrounds", function (req, res) {
    Campground.find({})
        .then((campgrounds) => {
            res.render("index", { campgrounds: campgrounds });

        }).catch((err) => console.log(err));
});

// CREATE : Actually creates a new item (here, campground)
app.post("/campgrounds", function (req, res) {
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
app.get("/campgrounds/new", function (req, res) {
    res.render("new");
});

// SHOW : Shows the details of a particular item (here, campground)
app.get("/campground/:id", function (req, res) {
    Campground.findById(req.params.id)
        .then((campDetails) => {
            console.log("Details of the campground are ", campDetails);
            res.render("show", { campground: campDetails });

        }).catch((err) => console.log(err));
})

app.listen(3001, function () {
    console.log("The Yelp Camp Server is up and running !");
})