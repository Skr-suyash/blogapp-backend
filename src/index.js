const express = require('express');
require('./db.js');

const userRouter = require('./routers/userRourter.js');

const app = express();
const cors = require("cors");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(userRouter);

app.use(
  cors({
    origin: "http://localhost:5173", // Allow only this origin
  })
);

app.get('/', (req, res) => {
    res.send('Home');
});



app.listen(8080);