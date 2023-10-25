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
            [Sequelize.Op.gte]: thirtyDaysAgo,
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

  gettop5prod: async (req, res) => {
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
              labrprodfk: req.params.id
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
        where: {
          labrcomdetfk: req.params.id,
          createdAt: {
            [Sequelize.Op.gte]: thirtyDaysAgo,
          },
        },
        include: [{ model: Model.labrairie }],
      });

      let enAttenteCount = 0;
      let annulerCount = 0;
      let accepterCount = 0;
      let completerCount = 0;

      response.forEach((order) => {
        const etatVender = order.etatVender;
        if (etatVender === "Nouveau") {
          enAttenteCount++;
        } else if (etatVender === "Rejeter") {
          annulerCount++;
        } else if (etatVender === "En_cours") {
          accepterCount++;
        } else if (etatVender === "Compléter") {
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
  },

  findCommandeinday: async (req, res) => {
    try {
      const date = new Date();
      date.setDate(date.getDate() - 7);
  
      const commandes = await Model.commandeEnDetail.findAll({
        where: {
          labrcomdetfk: req.params.id,
          createdAt: {
            [Sequelize.Op.gte]: date,
            //[Sequelize.Op.lt]: new Date(date.getTime() + 24 * 60 * 60 * 1000),
          },
        },
        attributes: {
          exclude: ["updatedAt", "usercommdetfk", "labrcomdetfk"],
        },
        include: [
          {
            model: Model.labrairie,
            attributes: ["id", "nameLibrairie", "imageStore"],
          },
          {
            model: Model.produitlabrairie,
            attributes: ["id", "titre", "prix"],
            include: [
              {
                model: Model.imageProduitLibrairie,
                attributes: ["name_Image"],
              },
            ],
          },
        ],
      });
  
      const countOnDate = {};
      commandes.forEach((commande) => {
        const commandDate = new Date(commande.createdAt);
        const dateKey = `${commandDate.getMonth() + 1}-${commandDate.getDate()}`;
        countOnDate[dateKey] = (countOnDate[dateKey] || 0) + 1;
      });
  
      const formattedCommandes = Object.keys(countOnDate).map((date) => {
        return { date: date, nbr: countOnDate[date] };
      });
  
      return res.status(200).json({
        success: true,
        commandes: formattedCommandes,
      });
    } catch (err) {
      return res.status(400).json({
        success: false,
        error: err.message,
      });
    }
  },
  

  findLatestCommandes: async (req, res) => {
    try {
      const date = new Date();
      date.setDate(date.getDate() - 7);
  
      const latestCommandes = await Model.commandeEnDetail.findAll({
        order: [["createdAt", "DESC"]],
        where: {
          labrcomdetfk: req.params.id,
          createdAt: {
            [Sequelize.Op.gte]: date, 
            //[Sequelize.Op.lt]: new Date(date.getTime() + 24 * 60 * 60 * 1000),
          },
        },
        attributes: {
          exclude: ["updatedAt", "usercommdetfk", "labrcomdetfk"],
        },
        include: [
          {
            model: Model.labrairie,
            attributes: ["id", "nameLibrairie", "imageStore"],
          },
          {
            model: Model.produitlabrairie,
            attributes: ["id", "titre", "prix"],
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
        latestCommandes: latestCommandes,
      });
    } catch (err) {
      return res.status(400).json({
        success: false,
        error: err.message,
      });
    }
  },

  findAllproducts: async (req, res) => {
    const { page, pageSize, sortBy, sortOrder } =
      req.query;
    const offset = (page - 1) * pageSize;
    const filters = req.query;
    let whereClause = {};


    if (sortBy && sortOrder) {
      order = [[sortBy, sortOrder === "desc" ? "DESC" : "ASC"]];
    }

    try {
       whereClause = {
        labrprodfk: req.params.id,
      };

      if (filters.category) {
        whereClause.categprodlabfk = filters.category;
      }

      if (filters.subcategory) {
        whereClause.souscatprodfk = filters.subcategory;
      }

      const totalCount = await Model.produitlabrairie.count({
        where: whereClause,
      });

      const products = await Model.produitlabrairie.findAll({
        order: order,
        limit: +pageSize,
        offset: offset,
        where: whereClause,
        include: [
          {
            model: Model.labrairie,
            attributes: ["imageStore", "nameLibrairie"],
          },
          {
            model: Model.imageProduitLibrairie,
          },
          {
            model: Model.avisProduitlibraire,
          },
        ],
      });

      if (products.length > 0) {
        const totalPages = Math.ceil(totalCount / pageSize);
        return res.status(200).json({
          success: true,
          produit: products,
          totalPages: totalPages,
        });
      } else {
        return res.status(400).json({
          success: false,
          err: "cette libraririe n'a pas des produits",
        });
      }
    } catch (err) {
      return res.status(400).json({
        success: false,
        error: err.message,
      });
    }
  },

  findallCommande: async (req, res) => {
    const { sortBy, sortOrder, page, pageSize, etat } = req.query;

    const offset = (page - 1) * pageSize;
    const order = [[sortBy, sortOrder === "desc" ? "DESC" : "ASC"]];
    const filters = req.query;
    const whereClause = {};

    if (filters.name) {
      whereClause.fullname = {
        [Sequelize.Op.like]: `%${filters.name}%`,
      };
    }
    if (etat == "tout") {
      try {
        const count = await Model.commandeEnDetail.count({
          //where: { labrcomdetfk: req.params.id },
        });
        Model.commandeEnDetail.findAll({
          offset: offset,
          order: order,
          limit: +pageSize,
          //where: { labrcomdetfk: req.params.id },
          include: [
            {
              model: Model.user,
              where: whereClause,
              attributes: ["fullname", "avatar"],
            },
            {
              model: Model.produitlabrairie,
            },
            {
              model: Model.labrairie,
            },
          ],
          attributes: {
            exclude: ["updatedAt"],
          },
        });
        if (response > 0) {
          const totalPages = Math.ceil(count / pageSize);
          return res.status(200).json({
            success: true,
            commandes: response,
            totalPages: totalPages,
          });
        } else {
          return res.status(400).json({
            success: false,
            err: "Aucune commandes trouvée pour cette librairie.",
          });
        }
      } catch (err) {
        return res.status(400).json({
          success: false,
          error: err.message,
        });
      }
    } else {
      try {
        const commandes = await Model.commandeEnDetail.findAll({
          offset: offset,
          order: order,
          limit: +pageSize,
          where: {
            etatVender: etat,
          },
          include: [
            {
              model: Model.user,
              where: whereClause,
              attributes: ["fullname", "avatar"],
            },
            {
              model: Model.produitlabrairie,
            },
            {
              model: Model.labrairie,
            },
          ],
          attributes: {
            exclude: ["updatedAt"],
          },
        });
        if (commandes.length > 0) {
          const totalPages = Math.ceil(commandes.length / pageSize);
          return res.status(200).json({
            success: true,
            commandes: commandes,
            totalPages: totalPages,
          });
        } else {
          return res.status(400).json({
            success: false,
            err: "Aucune commandes trouvée pour cette librairie.",
          });
        }
      } catch (err) {
        return res.status(400).json({
          success: false,
          error: err.message,
        });
      }
    }
  },

  findAllCommandsByState: async (req, res) => {
    const { sortBy, sortOrder, page, pageSize, etat, username } = req.query;

    const offset = (page - 1) * pageSize;
    const order = [[sortBy, sortOrder === "desc" ? "DESC" : "ASC"]];
    const wherename = {};
    try {
      let whereClause = { labrcomdetfk: req.params.id };
      if (etat && etat !== "tout") {
        whereClause.etatVender = etat;
      }

      if (username) {
        wherename.fullname = {
          [Sequelize.Op.like]: `%${username}%`,
        };
      }

      const count = await Model.commandeEnDetail.count({
        where: whereClause,
      });

      const commandes = await Model.commandeEnDetail.findAll({
        offset: offset,
        order: order,
        limit: +pageSize,
        where: whereClause,

        include: [
          {
            model: Model.user,
            attributes: ["fullname", "avatar"],
            //where:wherename
          },
          { model: Model.labrairie, attributes: ["nameLibrairie"] },
          { model: Model.produitlabrairie },
        ],
      });

      if (commandes) {
        const totalPages = Math.ceil(count / pageSize);
        return res.status(200).json({
          success: true,
          commandes: commandes,
          totalPages: totalPages,
        });
      }
    } catch (err) {
      return res.status(400).json({
        success: false,
        error: err.message,
      });
    }
  },

  findAllLivraison: async (req, res) => {
    const { sortBy, sortOrder, page, pageSize, etat, username } = req.query;

    const offset = (page - 1) * pageSize;
    const order = [[sortBy, sortOrder === "desc" ? "DESC" : "ASC"]];
    const wherename = {};
    try {
      let whereClause = { labrcomdetfk: req.params.id };
      if (etat && etat !== "tout") {
        whereClause.etatVender = etat;
      }

      if (username) {
        wherename.fullname = {
          [Sequelize.Op.like]: `%${username}%`,
        };
      }

      const count = await Model.commandeEnDetail.count({
        where: whereClause,
      });

      const commandes = await Model.commandeEnDetail.findAll({
        offset: offset,
        order: order,
        limit: +pageSize,
        where: whereClause,
        include: [
          {
            model: Model.user,
            attributes: ["fullname", "avatar"],
            //where:wherename
          },
          { model: Model.labrairie, attributes: ["nameLibrairie"] },
          { model: Model.produitlabrairie },
        ],
      });

      if (commandes) {
        const totalPages = Math.ceil(count / pageSize);
        return res.status(200).json({
          success: true,
          livraison: commandes,
          totalPages: totalPages,
        });
      }
    } catch (err) {
      return res.status(400).json({
        success: false,
        error: err.message,
      });
    }
  },

  livrecommande: async (req, res) => {
    try {
      Model.commandeEnDetail
        .update({ etatClient: "livre" }, { where: { id: req.params.id } })
        .then((response) => {
          if (response !== 0) {
            return res.status(200).json({
              success: true,
              message: "commande livré",
            });
          } else {
            return res.status(400).json({
              success: false,
              message: "erreur de livraison de commande",
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

  annulercommande: async (req, res) => {
    try {
      Model.commandeEnDetail
        .update({ etatClient: "annuler" }, { where: { id: req.params.id } })
        .then((response) => {
          if (response !== 0) {
            return res.status(200).json({
              success: true,
              message: "commande annulée",
            });
          } else {
            return res.status(400).json({
              success: false,
              message: "erreur d'annulation de commande",
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

  findAllCataloge: async (req, res) => {
    const { sortBy, sortOrder, page, pageSize } = req.query;

    const offset = (page - 1) * pageSize;

    if ((sortBy, sortOrder)) {
      order = [[sortBy, sortOrder === "desc" ? "DESC" : "ASC"]];
    }
    try {
      Model.cataloge
        .findAll({
          limit: +pageSize,
          offset: offset,
          order: order,
          include: [
            {
              model: Model.produitlabrairie,
              attributes: ["name_Image"],
              include:[
                {
                  model: Model.imageProduitLibrairie,
                  attributes: ["name_Image"],
                },
                {
                  model: Model.labrairie,
                  attributes: ["id", "imageStore", "nameLibrairie"],
                },
    
                {
                  model: Model.avisProduitlibraire,
                },
                { model: Model.categorie, attributes: ["id", "name"] },
              ]
            },
           
          ],
        })
        .then((response) => {
          if (response !== null) {
            return res.status(200).json({
              success: true,
              produit: response,
            });
          } else {
            return res.status(400).json({
              success: false,
              err: "zero produit dans le catalogue",
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

  addinventaire: async (req, res) => {
    try {
      const { labinvfk, prodlabinvfk } = req.body;

      const data = {
        labinvfk: labinvfk,
        prodlabinvfk: prodlabinvfk,
      };
      Model.inventaire.create(data).then((response) => {
        if (response !== null) {
          return res.status(400).json({
            success: true,
            inventaire: response,
            message: "produit ajouter à inventaire avec succes",
          });
        } else {
          return res.status(400).json({
            success: false,
            message: "erreur d'ajouter le produit à inventaire",
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

  findAllinventaire: async (req, res) => {
    const { page, pageSize, sortBy, sortOrder } = req.query;
    const offset = (page - 1) * pageSize;

    if (sortBy && sortOrder) {
      order = [[sortBy, sortOrder === "desc" ? "DESC" : "ASC"]];
    }

    try {
      const products = await Model.inventaire.findAll({
        order: order,
        limit: +pageSize,
        offset: offset,
        where: {
          labinvfk: req.params.id,
        },
        include: [
          {
            model: Model.produitlabrairie,
            //attributes: ["imageStore", "nameLibrairie"],
            include:[
              {
                model: Model.imageProduitLibrairie,
              },
              {
                model: Model.avisProduitlibraire,
              },
            ]
          },
          {
            model: Model.labrairie,
            attributes: ["imageStore", "nameLibrairie"],
          },
          
          
        ],
      });

      if (products.length > 0) {
        const totalPages = Math.ceil(products.length  / pageSize);
        return res.status(200).json({
          success: true,
          produit: products,
          totalPages: totalPages,
        });
      } else {
        return res.status(400).json({
          success: false,
          err: "cette libraririe n'a pas des produits",
        });
      }
    } catch (err) {
      return res.status(400).json({
        success: false,
        error: err.message,
      });
    }
  },

  allinventaire: async (req, res) => {
    const { page, pageSize, sortBy, sortOrder } =
      req.query;
    const offset = (page - 1) * pageSize;
    const filters = req.query;
    let whereClause = {};


    if (sortBy && sortOrder) {
      order = [[sortBy, sortOrder === "desc" ? "DESC" : "ASC"]];
    }

    try {
       whereClause = {
        labrprodfk: req.params.id,
      };

      if (filters.category) {
        whereClause.categprodlabfk = filters.category;
      }

      if (filters.subcategory) {
        whereClause.souscatprodfk = filters.subcategory;
      }
      if (filters.titre) {
        whereClause.titre = {
          [Sequelize.Op.like]: `%${filters.titre}%`,
        };
      }

      const totalCount = await Model.produitlabrairie.count({
        where: whereClause,
      });

      const products = await Model.produitlabrairie.findAll({
        order: order,
        limit: +pageSize,
        offset: offset,
        where: whereClause,
        include: [
          {
            model: Model.labrairie,
            attributes: ["imageStore", "nameLibrairie"],
          },
          {
            model: Model.imageProduitLibrairie,
          },
          {
            model: Model.avisProduitlibraire,
          },
        ],
      });

      if (products.length > 0) {
        const totalPages = Math.ceil(totalCount / pageSize);
        return res.status(200).json({
          success: true,
          produit: products,
          totalPages: totalPages,
        });
      } else {
        return res.status(400).json({
          success: false,
          err: "cette libraririe n'a pas des produits",
        });
      }
    } catch (err) {
      return res.status(400).json({
        success: false,
        error: err.message,
      });
    }
  },
};
module.exports = LabriarieController;
