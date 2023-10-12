const Model = require("../Models/index");
const bcrypt = require("bcrypt");
const sendMail = require("../config/Noemailer.config");
const { Sequelize } = require("sequelize");
const { response } = require("express");
const { librairieValidation } = require("../middleware/auth/validationSchema");
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
              message: "profil not found",
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
    try {
      if (req.files.length !== 0) {
        req.body["image"] = req.files[0].filename;
      } else {
        req.body["image"] == null;
      }
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

    const { categprodlabfk, souscatprodfk, titre, page, pageSize } = req.query;
    const offset = (page - 1) * pageSize;
    const whereClause = {};

    if (categprodlabfk) {
      whereClause.categprodlabfk = categprodlabfk;
    }
    if (souscatprodfk) {
      whereClause.souscatprodfk = souscatprodfk;
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

  findtopproduct: async (req, res) => {

    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      Model.ProduitCommandeEnDetail.findAll({
        attributes: [
          "prodlaibrcommdetfk",
          [Sequelize.fn("COUNT", "prodlaibrcommdetfk"), "count"],
        ],
        group: ["prodlaibrcommdetfk"],
        order: [[Sequelize.literal("count"), "DESC"]],
        limit: 5,
        where: {
          createdAt: {
            [Op.gte]: thirtyDaysAgo,
          },
        },
      }).then((topProducts) => {
        topProducts.forEach((product) => {
          Model.produitlabrairie
            .findAll({
              where: {
                id: product.prodlaibrcommdetfk,
                labrprodfk: req.params.id,
              },
              include: [
                {
                  model: Model.imageProduitLibrairie,
                  attributes: ["name_Image"],
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
        });
      });
    } catch (err) {
      console.error("Erreur lors de l'obtention de produit:", err);
    }
  },

  gettop10prod: async (req, res) => {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const topProducts = await Model.avisProduitlibraire.findAll({
        attributes: [
          [Sequelize.fn("SUM", Sequelize.col("nbStart")), "totalAvis"],
          "prodavisproduitsfk",
        ],
        where: {
          createdAt: {
            [Sequelize.gte]: thirtyDaysAgo,
          },
        },
        group: ["prodavisproduitsfk"],
        order: [[Sequelize.literal("totalAvis"), "DESC"]],
        limit: 5,
        include: [
          {
            model: Model.produitlabrairie,
            where: {
              labrprodfk: req.params.id,
            },

            include: [
              {
                model: Model.imageProduitLibrairie,
                attributes: ["name_Image"],
              },
            ],
          },
        ],
      });

      return res.status(200).json({
        success: true,
        produit: topProducts.map((item) => ({
          totalAvis: item.dataValues.totalAvis,
          produitlabrairie: item.produitlabrairie,
        })),
      });
    } catch (err) {
      console.error(err);
      return res.status(400).json({
        success: false,
        error: err.message,
      });
    }
  },

  findAllcommandebyetat: async (req, res) => {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const response = await Model.commandeEnDetail.findAll({
        where:{
          labrcomdetfk:req.params.id,
          createdAt: {
            [Sequelize.gte]: thirtyDaysAgo,
          },
        },
        include: [
          { model: Model.labrairie,
           
          },
        ],
      });
  
      let enAttenteCount = 0;
      let annulerCount = 0;
      let accepterCount = 0;
      let completerCount = 0;
  
      response.forEach((order) => {
        const etatVender = order.etatVender;
        if (etatVender === 'Nouveau') {
          enAttenteCount++;
        } else if (etatVender === 'Rejeter') {
          annulerCount++;
        } else if (etatVender === 'En cours') {
          accepterCount++;
        }else if (etatVender === 'Compléter') {
          completerCount++;
        }
      });
  
      return res.status(200).json({
        success: true,
        commandes: response,
        enAttenteCount,
        annulerCount,
        accepterCount,
      });
    } catch (err) {
      return res.status(400).json({
        success: false,
        error: err,
      });
    }
  }
  
};
module.exports = LabriarieController;
