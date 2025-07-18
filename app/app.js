"use strict";

const express = require("express");
const app = express();
const router = require("./src/routes/home");

app.set("views", ".src/views");

app.use("/", router);

module.exports = app;