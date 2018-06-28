const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const apiRouter = require("./routers/api-router");
const DB_URL = process.env.DB_URL || require("./config");

app.use(cors());
app.options("*", cors());
app.use(bodyParser.json());

mongoose
  .connect(DB_URL)
  .then(() => {
    console.log(`Connected to the DB on ${DB_URL}...`);
  })
  .catch(console.log);

app.use("/api", apiRouter);

app.use((err, req, res, next) => {
  console.log(
    "I have indentified the source of my woes, behold...",
    err.message
  );
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
