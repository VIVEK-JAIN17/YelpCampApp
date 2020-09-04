const mongoose = require('mongoose');
const Campground = require('./campground');

const commentSchema = new mongoose.Schema({
    comment: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model("Comment", commentSchema);