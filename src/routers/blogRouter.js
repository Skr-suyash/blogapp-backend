const express = require('express');
const multer = require('multer');
const router = new express.Router();
const upload = multer({ dest: 'uploads/' })

const blogModel = require('../models/BlogModel');
const userModel = require('../models/UserModel');

router.post('/create-blog', async (req, res) => {
    let { title, author, image, email, content } = req.body;

    const date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let currentDate = `${day}-${month}-${year}`;

    let blog = await blogModel.create({
        title: title,
        author: author,
        image: image,
        email: email,
        content: content,
        date_created: currentDate,
    });
    res.status(200).json(blog);

});

router.get('/blogs', async (req, res) => {
    let blogs = await blogModel.find({});
    if (blogs) {
        res.status(200).send(blogs);
    }
    else {
        res.status(500).send('internal server error');
    }
});

router.get('/blogs/:id', async (req, res) => {
    const id = req.params.id;
    let blog = await blogModel.find({ _id: id });
    if (blog) {
        res.status(200).send(blog);
    }
    else {
        res.status(404).send('Not found');
    }
});

router.patch('/blogs/:id', async (req, res) => {
    const id = req.params.id;
    const { title, content } = req.body;
    if (title) {
        await blogModel.updateOne({_id : id}, {
            $set: {
                title: title,
            }
        });
    }
    if (content) {
        console.log(title, content);
        await blogModel.updateOne({_id : id}, {
            $set: {
                content: content,
            }
        });
    }
    res.status(200).send('record updated sucessfully');
});

router.delete('/blogs/delete/:id', async (req, res) => {
    const id = req.params.id;
    try {
        blogModel.deleteOne({
            _id: id,
        });
        res.status(200).send('Item deleted sucessfully');
    } catch (err) {
        res.status(404).send('Item not found');
    }
});

router.post('/upload',upload.single('file'),(req,res)=>{

    console.log(req.body);
    res.send('hellp');
})

module.exports = router;