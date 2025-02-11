const express = require('express');
const multer = require('multer');
const path = require('path');

require('./db.js');

const userRouter = require('./routers/userRourter.js');
const blogRouter = require('./routers/blogRouter.js');

const app = express();
const cors = require("cors");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const fname = path.join(__dirname, '../uploads');
app.use(express.static(fname));
console.log(fname);

app.use(userRouter);
app.use(blogRouter);

app.use(
  cors({
    origin: "http://localhost:5173", // Allow only this origin
  })
);

app.get('/', (req, res) => {
    res.send('Home');
});



app.listen(process.env.PORT);