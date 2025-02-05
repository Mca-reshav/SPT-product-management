const express = require("express");
const validate = require("./joi.mw");
const webAuth = require("./auth.mw");
const _404 = require("./404.mw");

const global = [
  express.json(),
  express.urlencoded({ extended: true }),
];

const one = {
  validate,
  webAuth,
  _404,
};

module.exports = { global, one };
