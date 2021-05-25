require("dotenv").config();

// Express
const express = require("express");
const app = express();

// Other
const methodOverride = require("method-override");
const flash = require("connect-flash");
const moment = require("moment");

// Passport  
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/user");

// Routes
const authRouter = require("./routes/auth");
const campRouter = require("./routes/campgrounds");
const commentRouter = require("./routes/comments");
const userRouter = require("./routes/users");

// Mongoose Config
const mongoose = require("mongoose");
const url = (process.env.DATABASEURL) || "mongodb://localhost:27017/YelpCamp";
const connect = mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

// Express Session
const session = require("express-session");
const MongoStore = require('connect-mongo')(session);

// Global Middlewares
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

// Session Configuraiton
const connection = mongoose.createConnection(url, { useNewUrlParser: true, useUnifiedTopology: true });
app.use(session({
    name: "session-id",
    secret: process.env.SERVER_SECRET,
    resave: false,
    saveUninitialized: false,
    unset: "destroy",
    cookie: {
        maxAge: 3600000,
        httpOnly: true
    },
    store: new MongoStore({
        mongooseConnection: connection,
        autoRemove: "native"
    })
}));

// PASSPORT CONFIGURATION
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    res.locals.info = req.flash("info");
    res.locals.moment = moment;
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

connect.then((conn) => {
    console.log(`Correctly Connected to MongoDB Server at ${conn.connection.host}`);
}).catch((err) => console.log(err));

var port = process.env.PORT || "3000";
var host = process.env.HOST || "localhost";
app.listen(port, () => {
    console.log(`The Yelp Camp Server is up and running at http://${host}:${port}`);
});