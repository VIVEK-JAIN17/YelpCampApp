const mongoose = require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose");

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
    gender: {
        type: String
    },
    dob: {
        type: String
    },
    avatar: {
        type: String,
        default: "/images/avatars/default_avatar.png"
    },
    address: {
        address: { type: String },
        state: { type: String },
        country: { type: String },
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });



userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);