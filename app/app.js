"use strict";

const dotenv = require("dotenv").config();
const express = require("express");
const db = require("./src/config/db");

const app = express();
const router = require("./src/routes/home");

app.use("/", router);

module.exports = app;