const mongoose = require('mongoose');

// SCHEMA SETUP
const campgroundSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: {
            type: String
        }
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model("Campground", campgroundSchema);