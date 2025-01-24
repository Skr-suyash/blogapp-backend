const mongoose = require('mongoose');

const blogSchema = mongoose.Schema({
    "title": String,
    "email": String,
    "author": String,
    "image": String,
    "content": String,
    "upvoters": Array,
    "upvotes": {
        type: Number,
        default: 0,
    },
    "date_created": String,
});

const blogModel = new mongoose.model('nlog', blogSchema);

module.exports = blogModel;