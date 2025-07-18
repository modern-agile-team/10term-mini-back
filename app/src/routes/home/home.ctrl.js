"use strict";

const output = {
  home: (req, res) => {
    res.render("home/index");
  },
};

module.exports = { output, };