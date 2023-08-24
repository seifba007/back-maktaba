const categorie = require("../Models/categorie");
const Model = require("../Models/index");
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const sequelize = require("sequelize");
const sousCategorie = require("../Models/sousCategorie");
const {
  addadminValidation,
  deletecategoryValidation,
  addcategoryValidation,
  filtercommandeValidation,
} = require("../middleware/auth/validationSchema");
const adminController = {
  add: async (req, res) => {
    const data = req.body;
    try {
      const { error } = addadminValidation(data);
      if (error) return res.status(400).json(error.details[0].message);
      const passwordHash = bcrypt.hashSync(req.body.password, 10);
      const datauser = {
        fullname: req.body.fullname,
        email: req.body.email,
        password: passwordHash,
        email_verifie: "verifie",
        etatCompte: "active",
        role: "Admin",
      };
      Model.user.create(datauser).then((user) => {
        if (user !== null) {
          const dataAdmin = {
            id: user.id,
            userId: user.id,
          };
          Model.admin.create(dataAdmin).then((client) => {
            if (client !== null) {
              res.status(200).json({
                success: true,
                message: "Admin created",
              });
            } else {
              res.status(400).json({
                success: false,
                message: "error to add admin",
              });
            }
          });
        } else {
          res.status(400).json({
            success: false,
            message: "error to add admin",
          });
        }
      });
    } catch (err) {
      res.status(400).json({
        success: false,
        error: err,
      });
    }
  },
  findAllusersrole: async (req, res) => {
    try {
      const response = await Model.user.findAll({
        where: {
          role: ["partenaire", "labrairie"],
        },
        include: [
          {
            model: Model.partenaire,
            attributes: {
              include: ["nameetablissement"],
            },
            required: false,
          },
          {
            model: Model.labrairie,
            attributes: {
              include: ["nameLibrairie"],
            },
            required: false,
          },
        ],
      });

      if (response.length > 0) {
        return res.status(200).json({
          success: true,
          users: response,
        });
      } else {
        return res.status(400).json({
          success: false,
          err: "Zero users",
        });
      }
    } catch (err) {
      return res.status(400).json({
        success: false,
        error: err.message,
      });
    }
  },
  findAllcategories: async (req, res) => {
    try {
      Model.categorie
        .findAll({
          attributes: {
            include: ["id", "name"],
          },
          include: [
            {
              model: Model.Souscategorie,
              attributes: ["id", "name"],
            },
          ],
        })
        .then((response) => {
          if (response !== null) {
            return res.status(200).json({
              success: true,
              categories: response,
            });
          } else {
            return res.status(400).json({
              success: false,
              err: " zero category",
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
  findAllproduits: async (req, res) => {
    try {
      Model.produitlabrairie.findAll().then((response) => {
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
  deletecategory: async (req, res) => {
    const { ids } = req.body;
    try {
      const { error } = deletecategoryValidation(req.body);
      if (error) return res.status(400).json(error.details[0].message);
      Model.categorie
        .destroy({
          where: {
            id: ids,
          },
        })
        .then((reponse) => {
          if (reponse !== 0) {
            return res.status(200).json({
              success: true,
              message: " category deleted",
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
  addcategory: async (req, res) => {
    const { error } = addcategoryValidation(req.body);
    if (error) return res.status(400).json(error.details[0].message);
    try {
      if (req.files.length !== 0) {
        req.body["image"] = req.files[0].filename;
      } else {
        req.body["image"] == null;
      }
      const { image, subcategories } = req.body;
      const data = {
        name: req.body.name,
        Description: req.body.Description,
        image: image,
      };
      const category = await Model.categorie.create(data);
      const cat = eval(subcategories);
      const souscategories = [];
      for (const subcateName of cat) {
        const subcategory = await await Model.Souscategorie.create({
          name: subcateName.name,
          categorieId: category.id,
        });
        souscategories.push(subcategory);
      }
      res.status(200).json({
        success: true,
        message: "category and subcategories added",
      });
    } catch (err) {
      return res.status(400).json({
        success: false,
        error: err,
      });
    }
  },

  deletesuggestion: async (req, res) => {
    const { ids } = req.body;

    try {
      Model.suggestionProduit
        .destroy({
          where: {
            id: ids,
          },
        })
        .then((reponse) => {
          if (reponse !== 0) {
            return res.status(200).json({
              success: true,
              message: " suggestion deleted",
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

  findAllavis: async (req, res) => {
    const clientId = req.params.id;

    try {
      Model.avisProduitlibraire
        .findOne({
          attributes: [
            "clientId",
            [
              sequelize.fn("SUM", sequelize.col("nbStart")),
              "nombre_total_etoiles",
            ],
          ],
          where: {
            clientId: clientId,
          },
        })
        .then((response) => {
          try {
            if (response !== null) {
              return res.status(200).json({
                success: true,
                avis: response,
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

  findavgavis: async (req, res) => {
    const clientId = req.params.id;
    try {
      Model.avisProduitlibraire
        .findOne({
          attributes: [
            "clientId",
            [sequelize.fn("AVG", sequelize.col("nbStart")), "moyenne_avis"],
          ],
          where: {
            clientId: clientId,
          },
        })
        .then((response) => {
          try {
            if (response !== null) {
              return res.status(200).json({
                success: true,
                avismoy: response,
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

  gettop10prod: async (req, res) => {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const topProducts = await Model.avisProduitlibraire.findAll({
        attributes: [
          [sequelize.fn("SUM", sequelize.col("nbStart")), "totalAvis"],
          "produitlabrairieId",
        ],
        where: {
          createdAt: {
            [Op.gte]: thirtyDaysAgo,
          },
        },
        group: ["produitlabrairieId"],
        order: [[sequelize.literal("totalAvis"), "DESC"]],
        limit: 10,
        include: [
          {
            model: Model.produitlabrairie,
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

  findusernameetabllis: async (req, res) => {
    try {
      Model.user
        .findAll({
          where: {
            role: ["partenaire"],
          },
          include: [
            {
              model: Model.partenaire,
              attributes: ["nameetablissement"],
            },
          ],
        })
        .then((response) => {
          try {
            if (response !== null) {
              return res.status(200).json({
                success: true,
                users: response,
              });
            } else {
              return res.status(200).json({
                success: true,
                users: [],
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

  findCommandefiltre: async (req, res) => {
    const filters = req.body;
    const whereClause = {};
    if (filters.categorieId) {
      whereClause.categorieId = filters.categorieId;
    }
    if (filters.SouscategorieId) {
      whereClause.SouscategorieId = filters.SouscategorieId;
    }
    if (filters.prixMin && filters.prixMax) {
      whereClause.prix = {
        [sequelize.Op.between]: [filters.prixMin, filters.prixMax],
      };
    } else if (filters.prixMin) {
      whereClause.prix = { [sequelize.Op.gte]: filters.prixMin };
    } else if (filters.prixMax) {
      whereClause.prix = { [sequelize.Op.lte]: filters.prixMax };
    }

    if (filters.qteMin && filters.qteMax) {
      whereClause.qte = {
        [sequelize.Op.between]: [filters.qteMin, filters.qteMax],
      };
    } else if (filters.qteMin) {
      whereClause.qte = { [sequelize.Op.gte]: filters.qteMin };
    } else if (filters.qteMax) {
      whereClause.qte = { [sequelize.Op.lte]: filters.qteMax };
    }

    if (filters.etat) {
      whereClause.etat = filters.etat;
    }
    if (filters.titre) {
      whereClause.titre = filters.titre;
    }
    try {
      const { error } = filtercommandeValidation(req.body);
      if (error) return res.status(400).json(error.details[0].message);
      Model.produitlabrairie
        .findAll({
          where: whereClause,
          include: [
            {
              model: Model.categorie,
              attributes: ["name"],
            },
            {
              model: Model.Souscategorie,
              attributes: ["name"],
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
            } else {
              return res.status(200).json({
                success: true,
                message: "il n'y a pas des produits",
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

  getAllAvis: async (req, res) => {
    try {
      Model.avisProduitlibraire
        .findAll({
          attributes: {
            exclude: ["updatedAt", "clientId", "produitlabrairieId"],
          },
          include: [
            {
              model: Model.client,
              attributes: ["id","userId"],
              include: [
                {
                  model: Model.user,
                  attributes: ["fullname"],
                },
              ]
            },
            {
              model: Model.produitlabrairie,
              attributes: ["id", "titre", "prix"],
              include: [
                {
                  model: Model.imageProduitLibrairie,
                  attributes: ["name_Image"],
                },
                {
                  model: Model.labrairie,
                  attributes: ["nameLibrairie"],
                },
              ],
            },
          ],
        })
        .then((response) => {
          if (response !== null) {
            return res.status(200).json({
              success: true,
              avis: response,
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

module.exports = adminController;
