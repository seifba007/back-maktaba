const Model = require("../Models/index");
const bcrypt = require("bcrypt");
const sendMail = require("../config/Noemailer.config");
const { Sequelize } = require("sequelize");
const { response } = require("express");
const LabriarieController = {
  addlabrairie: async (req, res) => {
    try {
      const { email, fullname } = req.body;
    } catch (err) {
      return res.status(400).json({
        success: false,
        error: err,
      });
    }
  },
  findProfile: async (req, res) => {
    try {
      Model.labrairie
        .findOne({
          where: { id: req.params.id },
          attributes: {
            exclude: ["createdAt", "updatedAt", "userId"],
          },
        })
        .then((response) => {
          if (response !== null) {
            res.status(200).json({
              success: true,
              profile: response,
            });
          } else {
            res.status(200).json({
              success: false,
              message: "profile not find",
            });
          }
        });
    } catch (err) {
      return res.status(400).json({
        success: false,
        error: err,
      });
    }
  },

  updateProfile: async (req, res) => {
    const {
      adresse,
      ville,
      nameLibrairie,
      telephone,
      facebook,
      instagram,
      image,
      emailLib,
    } = req.body;
    try {
      const { error } = addadminValidation(req.body);
      if (error) return res.status(400).json(error.details[0].message);
      if (req.files.length !== 0) {
        req.body["image"] = req.files[0].filename;
      } else {
        req.body["image"] == null;
      }

      const data = {
        adresse: adresse,
        ville: ville,
        nameLibrairie: nameLibrairie,
        telephone: telephone,
        facebook: facebook,
        instagram: instagram,
        imageStore: image,
        emailLib: emailLib,
      };
      Model.labrairie
        .update(data, { where: { id: req.params.id } })
        .then((response) => {
          if (response !== 0) {
            return res.status(200).json({
              success: true,
              message: "update success",
            });
          } else {
            return res.status(400).json({
              success: false,
              message: "error to update ",
            });
          }
        });
    } catch (err) {
      return res.status(400).json({
        success: false,
        error: err,
      });
    }
  },

  findAlllibrarie: async (req, res) => {
    try {
      Model.labrairie
        .findAll({
          include: [
            {
              model: Model.user,
            },
          ],
        })
        .then((response) => {
          try {
            if (response !== null) {
              return res.status(200).json({
                success: true,
                produits: response,
              });
            }
          } catch (err) {
            return res.status(400).json({
              success: false,
              error: err,
            });
          }
        });
    } catch (err) {
      return res.status(400).json({
        success: false,
        error: err,
      });
    }
  },

  findAllproduitbyfiltre: async (req, res) => {
    const { id } = req.params.id;

    const { categorieId, SouscategorieId, titre, page, pageSize } = req.body;
    const offset = (page - 1) * pageSize;
    const whereClause = {};

    if (categorieId) {
      whereClause.categorieId = categorieId;
    }
    if (SouscategorieId) {
      whereClause.SouscategorieId = SouscategorieId;
    }
    if (titre) {
      whereClause.titre = titre;
    }
    try {
      Model.labrairie
        .findAll({
          where: id,
          include: [
            {
              model: Model.produitlabrairie,
              where: whereClause,
              limit: pageSize,
              offset: offset,
            },
          ],
        })
        .then((response) => {
          try {
            if (response !== null) {
              return res.status(200).json({
                success: true,
                produits: response,
              });
            }
          } catch (err) {
            return res.status(400).json({
              success: false,
              error: err,
            });
          }
        });
    } catch (err) {
      return res.status(400).json({
        success: false,
        error: err,
      });
    }
  },
};
module.exports = LabriarieController;
