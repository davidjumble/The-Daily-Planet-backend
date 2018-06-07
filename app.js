const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const apiRouter = require("./routers/api-router");
const DB_URL = require("./config");

mongoose.Promise = Promise;

app.use(bodyParser.json());

mongoose.connect(DB_URL).then(() => {
  console.log(`Connected to the DB on ${DB_URL}...`);
});

app.use("/api", apiRouter);

module.exports = app;
