"use strict";

require("module-alias/register");
const dotenv = require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const db = require("@config/db");
const router = require("@routes/home");
const exceptionHandler = require("@middleware/exceptionHandler");

const app = express();
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/", router);
app.use(exceptionHandler);

module.exports = app;
