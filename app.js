const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const apiRouter = require("./routers/api-router");
const DB_URL = require("./config");

mongoose.Promise = Promise;

app.use(bodyParser.json());

mongoose
  .connect(DB_URL)
  .then(() => {
    console.log(`Connected to the DB on ${DB_URL}...`);
  })
  .catch(console.log);

app.use("/api", apiRouter);

app.use((err, req, res, next) => {
  console.log("I have indentified the source of woes behold...", err.message);
  if (err.status) {
    res.status(404).send({ message: err.message });
  }

  if (err.name === "CastError")
    res.status(400).send({ message: `Bad request : Invalid ${err.kind}` });
  else if (err.name === "ValidationError")
    res.status(400).send({ message: err.message });
  else next(err);
});

module.exports = app;
