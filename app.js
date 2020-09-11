const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user');
const seedDB = require('./seed');
const authRouter = require('./routes/auth');
const campRouter = require('./routes/campgrounds');
const commentRouter = require('./routes/comments');

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

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
});

app.get("/", (req, res) => {
    res.render("home");
});

app.use("/", authRouter);
app.use("/campgrounds", campRouter);
app.use("/campgrounds/:id/comments", commentRouter);

connect.then((db) => {
    console.log("Correctly Connected to MongoDB Server");
}).catch((err) => console.log(err));

app.listen(3001, function () {
    console.log("The Yelp Camp Server is up and running !");
});