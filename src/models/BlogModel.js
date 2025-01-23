const mongoose = require('mongoose');

const blogSchema = mongoose.Schema({
    "title": String,
    "email": String,
    "author": String,
    "image": String,
    "content": String,
    "date_created": String,
});

const blogModel = new mongoose.model('nlog', blogSchema);

module.exports = blogModel;