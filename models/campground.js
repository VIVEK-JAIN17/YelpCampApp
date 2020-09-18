const mongoose = require('mongoose');
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

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
    price: {
        type: Currency,
        required: true,
        min: 1
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