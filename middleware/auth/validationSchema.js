const Joi = require("joi");

// ---------------------- CREATE NEW USER VALIDATION ----------------------//
const loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string()
      .min(6)
      .required()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
  });
  return schema.validate(data);
};
// ---------------------- CREATE NEW USER VALIDATION ----------------------//
const registerValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().required().email(),
    fullname: Joi.string().required().max(100),
    password: Joi.string()
      .min(6)
      .required()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
  });
  return schema.validate(data);
};

module.exports = {
  registerValidation,
  loginValidation,
};
