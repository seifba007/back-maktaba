const Model = require("../Models/index");
const bcrypt = require("bcrypt");
const sendMail = require("../config/Noemailer.config");
const { Sequelize } = require("sequelize");
const cloudinary = require("../middleware/cloudinary");
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
    const {
      adresse,
      ville,
      nameLibrairie,
      telephone,
      facebook,
      instagram,
      emailLib
    } = req.body;
    try {
      if (req.files && req.files.length > 0) {
        const filePromises = req.files.map(async (file) => {
          const result = await cloudinary.uploader.upload(file.path);
          return result.secure_url;
        });

        Promise.all(filePromises).then((imageUrls) => {
          const data = {
            adresse: adresse,
            ville: ville,
            nameLibrairie: nameLibrairie,
            telephone: telephone,
            facebook: facebook,
            instagram: instagram,
            imageStore: imageUrls[0],
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
        });
      }else{
        const data = {
          adresse: adresse,
          ville: ville,
          nameLibrairie: nameLibrairie,
          telephone: telephone,
          facebook: facebook,
          instagram: instagram,
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
      }
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

  findTopProducts: async (req, res) => {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const topProducts = await Model.ProduitCommandeEnDetail.findAll({
        attributes: [
          "prodlaibrcommdetfk",
          [Sequelize.fn("COUNT", "prodlaibrcommdetfk"), "count"],
        ],
        group: ["prodlaibrcommdetfk"],
        order: [[Sequelize.literal("count"), "DESC"]],
        limit: 5,
      });

      const productPromises = topProducts.map(async (product) => {
        const productDetails = await Model.produitlabrairie.findOne({
          order: [["id", "DESC"]],
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
        });
        return productDetails;
      });

      const productPromisescount = topProducts.map(async (product) => {
        const productDetails = await Model.produitlabrairie.findOne({
          order: [["id", "DESC"]],
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
        });
        return product.dataValues.count;
      });

      const products = await Promise.all(productPromises);
      const productscount = await Promise.all(productPromisescount);

      return res.status(200).json({
        success: true,
        produits: products,
        count:productscount
      });
    } catch (err) {
      console.error("Error fetching top products:", err);
      return res.status(500).json({
        success: false,
        error: err.message,
      });
    }
  },

  getToprevProd: async (req, res) => {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const topProducts = await Model.avisProduitlibraire.findAll({
        attributes: [
          [Sequelize.fn("SUM", Sequelize.col("nbStart")), "totalAvis"],
          "prodavisproduitsfk",
        ],
        //where: {
        //createdAt: {
        //[Sequelize.Op.gte]: thirtyDaysAgo,
        //},
        //},
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

      const formattedProducts = topProducts.map((item) => ({
        totalAvis: item.dataValues.totalAvis,
        produitlabrairie: item.produitlabrairie,
      }));
      console.log(topProducts);
      console.log(formattedProducts);

      return res.status(200).json({
        success: true,
        produit: formattedProducts,
      });
    } catch (error) {
      console.error(error);
      return res.status(400).json({
        success: false,
        error: error.message,
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
    let { days } = req.query;
    if (days > 7) {
      days = 7;
    } else {
      days = days;
    }
    console.log(days);
    try {
      const date = new Date();
      date.setDate(date.getDate() - days);

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
        const dateKey = `${
          commandDate.getMonth() + 1
        }-${commandDate.getDate()}`;
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
    const { sortBy, sortOrder, page, pageSize } = req.query;
    const offset = (page - 1) * pageSize;
    const order = [[sortBy, sortOrder === "desc" ? "DESC" : "ASC"]];
    try {
      const date = new Date();
      date.setDate(date.getDate() - 7);

      const totalCount = await Model.commandeEnDetail.count({
        where: {
          labrcomdetfk: req.params.id,
          createdAt: {
            [Sequelize.Op.gte]: date,
          },
        },
      });

      const latestCommandes = await Model.commandeEnDetail.findAll({
        limit: +pageSize,
        order: order,
        offset: offset,
        where: {
          labrcomdetfk: req.params.id,
          createdAt: {
            [Sequelize.Op.gte]: date,
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
          {
            model: Model.user,
            attributes: ["fullname", "avatar"],
          },
        ],
      });
      if (latestCommandes.length > 0) {
        const totalPages = Math.ceil(totalCount / pageSize);

        return res.status(200).json({
          success: true,
          latestCommandes: latestCommandes,
          totalPages: totalPages,
        });
      } else {
        return res.status(200).json({
          success: true,
          message: "Aucun commandes trouvé avec ces filtres.",
        });
      }
    } catch (err) {
      return res.status(400).json({
        success: false,
        error: err.message,
      });
    }
  },

  findAllproducts: async (req, res) => {
    const { page, pageSize, sortBy, sortOrder } = req.query;
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

      if (etat && etat === "tout") {
        whereClause.etatVender = {
          [Sequelize.Op.or]: ["en_cours", "Compléter"],
        };
      } else if (etat && etat !== "tout") {
        whereClause.etatVender = etat;
      }

      if (username) {
        wherename.fullname = {
          [Sequelize.Op.like]: `%${username}%`,
        };

        whereClause = { ...whereClause, "$user.fullname$": wherename.fullname };
      }

      const count = await Model.commandeEnDetail.count({
        where: whereClause,
        include: [
          {
            model: Model.user,
            attributes: [],
            where: wherename,
          },
        ],
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
            where: wherename,
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
              include: [
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
              ],
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
            include: [
              {
                model: Model.imageProduitLibrairie,
              },
              {
                model: Model.avisProduitlibraire,
              },
            ],
          },
          {
            model: Model.labrairie,
            attributes: ["imageStore", "nameLibrairie"],
          },
        ],
      });

      if (products.length > 0) {
        const totalPages = Math.ceil(products.length / pageSize);
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
    const { page, pageSize, sortBy, sortOrder } = req.query;
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

  findCommandefiltre: async (req, res) => {
    const { sortBy, sortOrder, page, pageSize } = req.query;
    const offset = (page - 1) * pageSize;
    const order = [[sortBy, sortOrder === "desc" ? "DESC" : "ASC"]];

    const filters = req.query;
    const whereClause = {
      qte: {
        [Sequelize.Op.gt]: 0,
      },
      Visibilite: {
        [Sequelize.Op.ne]: "Invisible",
      },
      labrprodfk: req.params.id,
    };

    if (filters.categprodlabfk) {
      if (typeof filters.categprodlabfk === "string") {
        filters.categprodlabfk = filters.categprodlabfk
          .split(",")
          .map((id) => parseInt(id, 10));
      }
      whereClause.categprodlabfk = filters.categprodlabfk;
    }

    if (filters.souscatprodfk) {
      if (typeof filters.souscatprodfk === "string") {
        filters.souscatprodfk = filters.souscatprodfk
          .split(",")
          .map((id) => parseInt(id, 10));
      }
      whereClause.souscatprodfk = filters.souscatprodfk;
    }

    if (filters.qteMin && filters.qteMax) {
      whereClause.qte = {
        [Sequelize.Op.between]: [filters.qteMin, filters.qteMax],
        [Sequelize.Op.gt]: 0,
      };
    } else if (filters.qteMin) {
      whereClause.qte = {
        [Sequelize.Op.gte]: filters.qteMin,
        [Sequelize.Op.gt]: 0,
      };
    } else if (filters.qteMax) {
      whereClause.qte = {
        [Sequelize.Op.lte]: filters.qteMax,
        [Sequelize.Op.gt]: 0,
      };
    } else {
      whereClause.qte = { [Sequelize.Op.gt]: 0 };
    }

    if (filters.etat) {
      whereClause.etat = filters.etat;
    }

    if (filters.titre) {
      whereClause.titre = {
        [Sequelize.Op.like]: `%${filters.titre}%`,
      };
    }

    if (filters.prixMin && filters.prixMax) {
      whereClause[Sequelize.Op.or] = [
        {
          prix: {
            [Sequelize.Op.between]: [filters.prixMin, filters.prixMax],
          },
        },
        {
          prix_en_solde: {
            [Sequelize.Op.between]: [filters.prixMin, filters.prixMax],
          },
        },
      ];
    } else if (filters.prixMin) {
      whereClause[Sequelize.Op.or] = [
        {
          prix: { [Sequelize.Op.gte]: filters.prixMin },
        },
        {
          prix_en_solde: { [Sequelize.Op.gte]: filters.prixMin },
        },
      ];
    } else if (filters.prixMax) {
      whereClause[Sequelize.Op.or] = [
        {
          prix: { [Sequelize.Op.lte]: filters.prixMax },
        },
        {
          prix_en_solde: { [Sequelize.Op.lte]: filters.prixMax },
        },
      ];
    }

    try {
      const totalCount = await Model.produitlabrairie.count({
        where: whereClause,
      });
      const produits = await Model.produitlabrairie.findAll({
        offset: offset,
        order: order,
        where: whereClause,
        limit: +pageSize,
        include: [
          {
            model: Model.categorie,
            attributes: ["name"],
          },
          {
            model: Model.Souscategorie,
            attributes: ["name"],
          },
          {
            model: Model.imageProduitLibrairie,
          },
          {
            model: Model.avisProduitlibraire,
          },
          {
            model: Model.labrairie,
            attributes: [
              "id",
              "adresse",
              "telephone",
              "nameLibrairie",
              "facebook",
              "instagram",
              "imageStore",
              "emailLib",
            ],
          },
        ],
      });

      if (produits.length > 0) {
        const totalPages = Math.ceil(totalCount / pageSize);

        return res.status(200).json({
          success: true,
          produits: produits,
          totalPages: totalPages,
        });
      } else {
        return res.status(200).json({
          success: true,
          message: "Aucun produit trouvé avec ces filtres.",
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
