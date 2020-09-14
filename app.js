const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user');
const seedDB = require('./seed');
const authRouter = require('./routes/auth');
const campRouter = require('./routes/campgrounds');
const commentRouter = require('./routes/comments');
const flash = require('connect-flash');

// seedDB();

// Connection URL
const url = 'mongodb://localhost:27017/YelpCamp';
const connect = mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use(methodOverride("_method"));
app.use(flash());

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
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.get("/", (req, res) => {
    res.render("home");
});

app.use("/", authRouter);
app.use("/campgrounds", campRouter);
app.use("/campgrounds/:id/comments", commentRouter);

connect.then(() => {
    console.log("Correctly Connected to MongoDB Server at " + url);
}).catch((err) => console.log(err));

var port = 3001;
var host = 'localhost';
app.listen(port, host, () => {
    console.log("The Yelp Camp Server is up and running at http://" + host + ":" + port);
});