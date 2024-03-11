const Model = require("../Models/index");
const bcrypt = require("bcrypt");
const { Sequelize } = require("sequelize");
const sendMail = require("../config/Noemailer.config");
const cloudinary = require("../middleware/cloudinary");

const fournisseurController = {
  addfournisseur: async (req, res) => {
    try {
      const { email, fullname } = req.body;
      const characters =
        "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
      let Password = "";
      for (let i = 0; i < 25; i++) {
        Password += characters[Math.floor(Math.random() * characters.length)];
      }
      const passwordHash = bcrypt.hashSync(Password, 10);
      const datauser = {
        email: email,
        fullname: fullname,
        password: passwordHash,
        email_verifie: "verifie",
        role: "fournisseur",
      };
      Model.user.create(datauser).then((user) => {
        if (user !== null) {
          const datafournisseur = {
            id: user.id,
            userId: user.id,
          };
          Model.fournisseur.create(datafournisseur).then((fournisseur) => {
            if (fournisseur !== null) {
              sendMail.acceptationDemendePartenariat(email, Password);
              return res.status(200).json({
                success: true,
                message: "success create fournisseur",
              });
            }
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

  findAllfournisseur: async (req, res) => {
    try {
      Model.fournisseur
        .findAll({
          include: [
            {
              model: Model.user,
              attributes: ["fullname","avatar"],
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

  findOneFournisseur: async (req, res) => {
    try {
      Model.fournisseur
        .findOne({
          where: { id: req.params.id },
          include: [
            {
              model: Model.adresses,
            },
            {
              model: Model.user,
              attributes: {
                exclude: [
                  "password",
                  "createdAt",
                  "updatedAt",
                  "email_verifie",
                  "role",
                ],
              },
            },
          ],
        })
        .then((response) => {
          if (response !== null) {
            return res.status(200).json({
              success: true,
              Fournisseur: response,
            });
          } else {
            return res.status(200).json({
              success: false,
              message: "Fournisseur introuvable",
            });
          }
        });
    } catch (err) {
      return res.status(400).json({
        success: false,
        err: err,
      });
    }
  },

  updateProfile: async (req, res) => {
    const {
      nameetablissement,
      telephone,
      facebook,
      ville,
      instagram,
      email,
      address,
    } = req.body;
    try {
      const data = {
        nameetablissement: nameetablissement,
        address: address,
        ville: ville,
        telephone: telephone,
        email: email,
        Facebook: facebook,
        Instagram: instagram,
      };

      Model.fournisseur
        .update(data, { where: { id: req.params.id } })
        .then((response) => {
          console.log(response);
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
      return res.status(200).json({
        success: false,
        error: "err",
      });
    }
  },
  updateProfileimge: async (req, res) => {
    try {
      if (req.files.length !== 0) {
        req.files.forEach((file) => {
          const uploadPromise = cloudinary.uploader
            .upload(file.path)
            .then((result) => {
              const imageUrl = result.secure_url;
              Model.fournisseur
                .update({"avatar" : imageUrl}, { where: { id: req.params.id } })
                .then((response) => {
                  if (response !== 0) {
                    return res.status(200).json({
                      success: true,
                      message: "update  image success",
                    });
                  } else {
                    return res.status(200).json({
                      success: false,
                      message: "error to update image",
                    });
                  }
                });
            });
        });
      }
    } catch (err) {
      return res.status(400).json({
        success: false,
        error: err.message,
      });
    }
  },


  findAllCommandes: async (req, res) => {
    const { sortBy, sortOrder, page, pageSize, etat, laibrairiename } =
      req.query;

    const offset = (page - 1) * pageSize;
    const order = [[sortBy, sortOrder === "desc" ? "DESC" : "ASC"]];
    const wherename = {};
    try {
      let whereClause = { fourcomgrofk: req.params.id };

      if (etat && etat === "tout") {
        whereClause.etat = {
          [Sequelize.Op.or]: ["en_cours", "livre", "Nouveau", "Rejeter"],
        };
      } else if (etat && etat !== "tout") {
        whereClause.etat = etat;
      }

      if (laibrairiename) {
        wherename.nameLibrairie = {
          [Sequelize.Op.like]: `%${laibrairiename}%`,
        };

        whereClause = {
          ...whereClause,
          "$labrairie.nameLibrairie$": wherename.fullname,
        };
      }

      const count = await Model.commandeEnGros.count({
        where: whereClause,
        include: [
          {
            model: Model.labrairie,
            attributes: [],
            where: wherename,
          },
        ],
      });

      const commandes = await Model.commandeEnGros.findAll({
        offset: offset,
        order: order,
        limit: +pageSize,
        where: whereClause,
        include: [
          {
            model: Model.labrairie,
            attributes: ["nameLibrairie", "imageStore"],
            where: wherename,
          },
          { model: Model.produitfournisseur },
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
    const { sortBy, sortOrder, page, pageSize, etat, librairiename } =
      req.query;

    const offset = (page - 1) * pageSize;
    const order = [[sortBy, sortOrder === "desc" ? "DESC" : "ASC"]];
    const wherename = {};
    try {
      let whereClause = { fourcomgrofk: req.params.id };

      if (etat && etat === "tout") {
        whereClause.etat = {
          [Sequelize.Op.or]: ["en_cours", "Compléter"],
        };
      } else if (etat && etat !== "tout") {
        whereClause.etat = etat;
      }

      if (librairiename) {
        wherename.nameLibrairie = {
          [Sequelize.Op.like]: `%${librairiename}%`,
        };

        whereClause = {
          ...whereClause,
          "$labrairie.nameLibrairie$": wherename.nameLibrairie,
        };
      }

      const count = await Model.commandeEnGros.count({
        where: whereClause,
        include: [
          {
            model: Model.labrairie,
            where: wherename,
          },
        ],
      });

      const commandes = await Model.commandeEnGros.findAll({
        offset: offset,
        order: order,
        limit: +pageSize,
        where: whereClause,
        include: [
          {
            model: Model.labrairie,
            attributes: ["nameLibrairie"],
            where: wherename,
          },
          { model: Model.produitfournisseur },
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
      Model.commandeEnGros
        .update({ etat: "livre" }, { where: { id: req.params.id } })
        .then((response) => {
          if (response !== 0) {
            return res.status(200).json({
              success: true,
              message: "commande en gros livré",
            });
          } else {
            return res.status(400).json({
              success: false,
              message: "erreur de livraison de commande en gros",
            });
          }
        });
    } catch (err) {
      return res.status(400).json({
        success: false,
        error: err.message,
      });
    }
  },

  annulercommande: async (req, res) => {
    try {
      Model.commandeEnGros
        .update({ etat: "annuler" }, { where: { id: req.params.id } })
        .then((response) => {
          if (response !== 0) {
            return res.status(200).json({
              success: true,
              message: "commande en gros annulée",
            });
          } else {
            return res.status(400).json({
              success: false,
              message: "erreur d'annulation de commande en gros",
            });
          }
        });
    } catch (err) {
      return res.status(400).json({
        success: false,
        error: err.message,
      });
    }
  },

  findTopProducts: async (req, res) => {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const topProducts = await Model.ProduitCommandeEnGros.findAll({
        attributes: [
          "prodfourcommgrosfk",
          [Sequelize.fn("COUNT", "prodfourcommgrosfk"), "count"],
        ],
        group: ["prodfourcommgrosfk"],
        order: [[Sequelize.literal("count"), "DESC"]],
        limit: 5,
      });

      const productPromises = topProducts.map(async (product) => {
        const productDetails = await Model.produitfournisseur.findOne({
          order: [["id", "DESC"]],
          where: {
            id: product.prodfourcommgrosfk,
            fourprodfk: req.params.id,
          },
          include: [
            {
              model: Model.imageProduitFournsseur,
              attributes: ["name_Image"],
            },
          ],
        });

        return productDetails;
      });

      const productPromisescount = topProducts.map(async (product) => {
        const productDetails = await Model.produitfournisseur.findOne({
          order: [["id", "DESC"]],
          where: {
            id: product.prodfourcommgrosfk,
            fourprodfk: req.params.id,
          },
          include: [
            {
              model: Model.imageProduitFournsseur,
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
        count: productscount,
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

      const topProducts = await Model.avisProduitfournisseur.findAll({
        attributes: [
          [Sequelize.fn("SUM", Sequelize.col("nbStart")), "totalAvis"],
          "prodfouravisfk",
        ],
        //where: {
        //createdAt: {
        //[Sequelize.Op.gte]: thirtyDaysAgo,
        //},
        //},
        group: ["prodfouravisfk"],
        order: [[Sequelize.literal("totalAvis"), "DESC"]],
        limit: 5,
        include: [
          {
            model: Model.produitfournisseur,
            where: {
              fourprodlabfk: req.params.id,
            },
            include: [
              {
                model: Model.imageCatalogeFournisseur,
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
      const response = await Model.commandeEnGros.findAll({
        where: {
          fourcomgrofk: req.params.id,
          createdAt: {
            [Sequelize.Op.gte]: thirtyDaysAgo,
          },
        },
        include: [{ model: Model.fournisseur }],
      });

      let enAttenteCount = 0;
      let annulerCount = 0;
      let accepterCount = 0;
      let completerCount = 0;

      response.forEach((order) => {
        const etat = order.etat;
        if (etat === "Nouveau") {
          enAttenteCount++;
        } else if (etat === "Rejeter") {
          annulerCount++;
        } else if (etat === "En_cours") {
          accepterCount++;
        } else if (etat === "Compléter") {
          completerCount++;
        }
      });

      return res.status(200).json({
        success: true,
        commandes: response,
        Nouveaucommande: enAttenteCount,
        Rejetercoomande: annulerCount,
        Encourscommande: accepterCount,
        Completercommande: completerCount,
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

      const commandes = await Model.commandeEnGros.findAll({
        where: {
          fourcomgrofk: req.params.id,
          createdAt: {
            [Sequelize.Op.gte]: date,
            //[Sequelize.Op.lt]: new Date(date.getTime() + 24 * 60 * 60 * 1000),
          },
        },
        include: [
          {
            model: Model.fournisseur,
            attributes: ["id", "nameetablissement", "avatar"],
          },
          {
            model: Model.produitfournisseur,
            attributes: ["id", "titre", "prix"],
            include: [
              {
                model: Model.imageProduitFournsseur,
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

      const totalCount = await Model.commandeEnGros.count({
        where: {
          fourcomgrofk: req.params.id,
          createdAt: {
            [Sequelize.Op.gte]: date,
          },
        },
      });

      const latestCommandes = await Model.commandeEnGros.findAll({
        limit: +pageSize,
        order: order,
        offset: offset,
        where: {
          fourcomgrofk: req.params.id,
          createdAt: {
            [Sequelize.Op.gte]: date,
          },
        },
        attributes: {
          exclude: ["updatedAt",  "labrcomgrofk"],
        },
        include: [
          {
            model: Model.fournisseur,
            attributes: ["id", "nameetablissement", "avatar"],
            include:[
              {
                model: Model.user,
                attributes: ["fullname", "avatar"],
              },
            ]
          },
          {
            model: Model.produitfournisseur,
            attributes: ["id", "titre", "prix"],
            include: [
              {
                model: Model.imageProduitFournsseur,
                attributes: ["name_Image"],
              },
            ],
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
};
module.exports = fournisseurController;
