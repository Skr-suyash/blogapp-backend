const express = require('express');
const router = new express.Router();
const upload = require('../middleware/multer');

const blogModel = require('../models/BlogModel');
const userModel = require('../models/UserModel');

router.post('/create-blog', upload.single('image'), async (req, res) => {
    let { title, email, content } = req.body;

    const user = await userModel.findOne({ email: email });

    console.log(user);
    if (user) {
        const date = new Date();
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();
        let currentDate = `${day}-${month}-${year}`;

        let image;
        if (req.file) {
            image = req.file.filename;
        }

        console.log(user.username);
        let blog = await blogModel.create({
            title: title,
            author: user.username,
            image: image,
            email: email,
            content: content,
            date_created: currentDate,
        });
        res.status(200).json(blog);
    }
    else {
        res.status(404).send("user not found");
    }
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
        await blogModel.updateOne({ _id: id }, {
            $set: {
                title: title,
            }
        });
    }
    if (content) {
        console.log(title, content);
        await blogModel.updateOne({ _id: id }, {
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
        await blogModel.deleteOne({
            _id: id,
        });
        res.status(200).send('Item deleted sucessfully');
    } catch (err) {
        res.status(404).send('Item not found');
    }
});

router.post('/blogs/upvote', async (req, res) => {
    const { blog_id, email } = req.body;
    try {
        const blog = await blogModel.findOne({ _id: blog_id }); // Await the result of findOne
        if (!blog) {
            return res.status(404).send("Blog not found");
        }

        let found = blog.upvoters.includes(email);

        if (found) {
            let updatedUpvoters = blog.upvoters.filter((element) => element != email); // Remove user_id from upvoters
            await blogModel.updateOne(
                { _id: blog_id },
                {
                    $inc: {
                        upvotes: -1,
                    },
                    $set: {
                        upvoters: updatedUpvoters,
                    },
                }
            );
            return res.status(200).send({ message: "Upvote removed successfully", upvotes: blog.upvotes - 1 });
        } else {
            let updatedUpvoters = [...blog.upvoters, email]; // Add user_id to upvoters array
            await blogModel.updateOne(
                { _id: blog_id },
                {
                    $inc: {
                        upvotes: +1,
                    },
                    $set: {
                        upvoters: updatedUpvoters,
                    },
                }
            );
            return res.status(200).send({ message: "Upvoted successfully", upvotes: blog.upvotes + 1 });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }

});

module.exports = router;