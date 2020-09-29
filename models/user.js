const mongoose = require('mongoose'),
    passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        default: ""
    },
    lastname: {
        type: String,
        default: ""
    },
    email: {
        type: String,
        default: ""
    },
    avatar: {
        type: String,
        default: "https://www.easemytrip.com/travel/img/ladakh-camping.jpg"
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });



userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);