const Joi = require("joi");

module.exports = {
  add: Joi.object({
    name: Joi.string().min(2).max(25).required(),
    description: Joi.string().min(3).max(100).required(),
    price: Joi.number().min(1).max(99999).required(),
  }),
  edit: Joi.object({
    productId: Joi.string().min(1).required(),
    name: Joi.string().min(2).max(25).optional(),
    description: Joi.string().min(3).max(100).optional(),
    price: Joi.number().min(1).max(99999).optional(),
  }),
  show: Joi.object({
    searchText: Joi.string().min(1).max(50).optional(),
    page: Joi.number().min(0).optional(),
    limit: Joi.number().min(1).optional()
  }),
  uploadImg: Joi.object({
    image: Joi.string().required()
  }),
  delete: Joi.object({
    productId: Joi.string().required()
  })
};
