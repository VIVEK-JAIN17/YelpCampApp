const mongoose = require('mongoose'),
    passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
    }
}, { timestamps: true });



userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);