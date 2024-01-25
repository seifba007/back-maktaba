const Model = require("../Models/index");
const bcrypt = require("bcrypt");
const { Sequelize } = require("sequelize");
const sendMail = require("../config/Noemailer.config");
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
              attributes: ["fullname"],
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
          attributes: [
            "id",
            "avatar",
            "address",
            "telephone",
            "createdAt",
            "updatedAt",
          ],
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
      instagram,
      email,
      address,
    } = req.body;
    try {
      const data = {
        nameetablissement: nameetablissement,
        address: address,
        ville: null,
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
        req.body["image"] = req.files[0].filename;
      } else {
        req.body["image"] == null;
      }
      const { image } = req.body;
      const data = {
        image: image,
      };

      Model.fournisseur
        .update(data, { where: { id: req.params.id } })
        .then((response) => {
          console.log(response);
          if (response !== 0) {
            return res.status(200).json({
              success: true,
              message: "update  image success",
            });
          } else {
            return res.status(200).json({
              success: false,
              message: "error to update ",
            });
          }
        });
    } catch (err) {
      return res.status(400).json({
        success: false,
        error: "err",
      });
    }
  },


  findAllCommandes: async (req, res) => {
    const { sortBy, sortOrder, page, pageSize, etat, laibrairiename } = req.query;

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

        whereClause = { ...whereClause, "$labrairie.nameLibrairie$": wherename.fullname };
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
            where:wherename,
            
          },
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
    const { sortBy, sortOrder, page, pageSize, etat, librairiename } = req.query;

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

        whereClause = { ...whereClause, "$labrairie.nameLibrairie$": wherename.nameLibrairie};
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
          { model: Model.labrairie, attributes: ["nameLibrairie"],where: wherename, },
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
};
module.exports = fournisseurController;
