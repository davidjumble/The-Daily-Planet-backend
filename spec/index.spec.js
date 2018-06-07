process.env.NODE_ENV = "test";
const app = require("../app");
const rawData = require("../seed/testdata");
const seedDB = require("../seed/seed");
const mongoose = require("mongoose");
const request = require("supertest")(app);
const { expect } = require("chai");
