const Joi = require("joi");

module.exports = {
  login: Joi.object({
    emailId: Joi.string().email().required(),
    password: Joi.string().min(3).max(25).required(),
  }),
  register: Joi.object({
    name: Joi.string().min(3).max(25).required(),
    emailId: Joi.string().email().required(),
    contactNo: Joi.string().length(10).required(),
    password: Joi.string().min(3).max(25).required(),
  }),
};
