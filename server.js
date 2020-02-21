const express = require("express");
const app = express();
const bodyParser = require("body-parser");
require('dotenv/config');


app.use(bodyParser.json());

const postRoute = require('./routes/posts')

app.use('/posts', postRoute)

app.listen(3000)