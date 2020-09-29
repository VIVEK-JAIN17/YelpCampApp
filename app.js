// Express
const express = require("express");
const app = express();

// Other
const bodyParser = require("body-parser");
const methodOverride = require('method-override');
const flash = require('connect-flash');

// Passport  
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user');

// Routes
const authRouter = require('./routes/auth');
const campRouter = require('./routes/campgrounds');
const commentRouter = require('./routes/comments');
const userRouter = require('./routes/users');

// Mongoose Config
const mongoose = require('mongoose');
const url = (process.env.DATABASEURL) || 'mongodb://localhost:27017/YelpCamp';
const connect = mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

// Global Middlewares
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

// Landing Route
app.get("/", (req, res) => {
    res.render("home");
});

// Routes
app.use("/", authRouter);
app.use("/campgrounds", campRouter);
app.use("/campgrounds/:id/comments", commentRouter);
app.use("/users", userRouter);

connect.then(() => {
    console.log("Correctly Connected to MongoDB Server at " + url);
}).catch((err) => console.log(err));

var port = process.env.PORT || '3000';
var host = process.env.HOST || 'localhost';
app.listen(port, () => {
    console.log("The Yelp Camp Server is up and running at http://" + host + ":" + port);
});