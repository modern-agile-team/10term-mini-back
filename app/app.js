"use strict";

const dotenv = require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const db = require("./src/config/db");

const app = express();
const router = require("./src/routes/home");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/", router);

module.exports = app;