const { log } = require("../services/response.service");

const validateRequest = (schema) => {
  return async (req, res, next) => {
    try {
      const { error, value } = schema.validate(
        { ...req.body, ...req.params, ...req.query },
        { abortEarly: false, stripUnknown: true }
      );

      if (error) {
        const messages = error.details.map(detail => detail.message.replace(/\"/g, ""));
        res.status(400).json(log(false, messages.join(", ")));
        return;
      }

      req.validatedData = value;
      next();
    } catch (err) {
      res.status(500).json(log(false, "Internal server error"));
    }
  };
};

module.exports = validateRequest;
