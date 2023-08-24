const Joi = require("joi");

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

const addadminValidation = (data) => {
  const schema = Joi.object({
    fullname: Joi.string().min(2).required(),
    email: Joi.string().required().email(),
    password: Joi.string()
      .min(6)
      .required()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
  });
  return schema.validate(data);
};

const deletecategoryValidation = (data) => {
  const schema = Joi.object({
    ids: Joi.array().items(Joi.number().integer()).unique(),
  });
  return schema.validate(data);
};

const addcategoryValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(2).required(),
    Description: Joi.string().min(6).required(),
    subcategories: Joi.array().items(Joi.string()).unique(),
  });
  return schema.validate(data);
};

const filtercommandeValidation = (data) => {
  const schema = Joi.object({
    categorieId: Joi.array().items(Joi.number().integer()).unique(),
    SouscategorieId: Joi.array().items(Joi.number().integer()).unique(),
    prixMin: Joi.number(),
    prixMax: Joi.number(),
    qteMin: Joi.number().integer(),
    qteMax: Joi.number().integer(),
    etat: Joi.string(),
    titre: Joi.string(),
  });
  return schema.validate(data);
};
const addAdresseValidation = (data) => {
  const schema = Joi.object({
    Nom_de_adresse : Joi.string(),
    Adresse : Joi.string(),
    Gouvernorat : Joi.string(),
    Ville: Joi.string(),
    Code_postal: Joi.number().integer(),
  });
  return schema.validate(data);
};

const addAvisProdValidation = (data) => {
  const schema = Joi.object({
    nbStart : Joi.number().integer(),
    commenter: Joi.string(),
  });
  return schema.validate(data);
};

module.exports = {
  registerValidation,
  loginValidation,
  addadminValidation,
  deletecategoryValidation,
  addcategoryValidation,
  filtercommandeValidation,
  addAdresseValidation,
  addAvisProdValidation
};
