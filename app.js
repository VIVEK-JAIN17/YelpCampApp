const express = require("express");
const app = express();
const request = require("request");

app.set("view engine", "ejs");

var campgrounds = [
    {
        name: "Ladakh", image: "https://www.easemytrip.com/travel/img/ladakh-camping.jpg"
    },
    {
        name: "Spiti Valley", image: "https://www.easemytrip.com/travel/img/spiti-valley-camping.jpg"
    },
    {
        name: "Rishikesh", image: "https://www.easemytrip.com/travel/img/rishikesh-camping.jpg"
    },
]

// Creating several routes for the app
// 1. A route to the landing page
// 2. A route to view all the campgrounds
// 3. A route to create/sbmit a new campground
// 4. A route that will contain the form for creating a new campground

app.get("/", function (req, res) {
    res.render("home");
});

app.get("/campgrounds", function (req, res) {
    res.render("campgrounds", { campgrounds: campgrounds });
});

// app.post("/capmgrounds", function (req, res) {

// });

app.get("/campgrounds/new", function (req, res) {
    res.render("new");
});


app.listen(3000, function () {
    console.log("The Yelp Camp Server is up and running !");
})