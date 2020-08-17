const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const request = require("request");
const mongoose = require('mongoose');
const assert = require('assert');

// SCHEMA SETUP
const campgroundSchema = new mongoose.Schema({
    name: String,
    image: String
});

const Campground = mongoose.model("Campground", campgroundSchema);

// Connection URL
const url = 'mongodb://localhost:27017/YelpCamp';
const connect = mongoose.connect(url, { useNewUrlParser: true });

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

// connect.then((db) => {
//     console.log('Connected correctlyto server !');

//     Campground.create({
//         name: "Rishikesh",
//         image: "https://www.easemytrip.com/travel/img/rishikesh-camping.jpg"

//     }).then((camp) => {
//         console.log("Successfully Created Campground", camp);
//         return Campground.find({});

//     }).then((camps) => {
//         console.log('Found Some Camps', camps);

//         return Campground.deleteMany({ name: 'Rishikesh' });

//     }).then((camp) => {
//         console.log("Deleted a campground", camp);

//     }).catch((err) => console.log(err));

// }).catch((err) => console.log(err));


// Creating several routes for the app
// 1. A route to the landing page
// 2. A route to view all the campgrounds
// 3. A route to create/sbmit a new campground
// 4. A route that will contain the form for creating a new campground

app.get("/", function (req, res) {
    res.render("home");
});

app.get("/campgrounds", function (req, res) {
    Campground.find({})
        .then((campgrounds) => {
            res.render("campgrounds", { campgrounds: campgrounds });

        }).catch((err) => console.log(err));
});

app.post("/campgrounds", function (req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var newCampground = { name: name, image: image }
    Campground.create(newCampground)
        .then((camp) => {
            console.log("Successfully posted a new camp on website !", camp);
            res.redirect("/campgrounds");

        }).catch((err) => {
            console.log("An Error Occured while posting !", err);
            res.send("<h1>An Error Occured while posting ! </h1>")
        });
});

app.get("/campgrounds/new", function (req, res) {
    res.render("new");
});

app.listen(3000, function () {
    console.log("The Yelp Camp Server is up and running !");
})