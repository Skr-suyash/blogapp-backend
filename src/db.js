/**
 * Module to connect to the MongoDB Database
 */

const mongoose = require('mongoose');
require('dotenv').config();

const connectionURL = process.env.DB_URL;

mongoose.connect(connectionURL);
