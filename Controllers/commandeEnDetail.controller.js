const { response } = require("express");
const Model = require("../Models/index");
const cloudinary = require("../middleware/cloudinary");
const { Sequelize, where, Op, or } = require("sequelize");
const codePromo = require("./codePromo.controller");
const commandeDetailController = {
  add: async (req, res) => {
    const { commande, promoCode, clientid } = req.body;
    try {
      let codePromoRecord = null;

      if (promoCode) {
        codePromoRecord = await Model.codePromo.findOne({
          where: { code: promoCode },
          include: [
            {
              model: Model.codePromocategory,
              include: [{ model: Model.categorie }],
            },
          ],
        });

        if (!codePromoRecord) {
          return res.status(400).json({
            success: false,
            message: "Invalid promo code.",
          });
        }
      }

      let oldTotal = 0.0;
      let newTotal = 0.0;
      let newTotalremise = 0.0;
      let newPricetva = 0.0;
      let newtotaltva = 0.0;
      const updatedCommandeDetails = [];

      for (const data of commande) {
        let commandes = {
          total_ttc: data.total_ttc,
          etatClient: "en cours",
          etatVender: "Nouveau",
          identifiant: data.identifiant,
          Adresse: data.Adresse,
          Mode_liv: data.Mode_liv,
          Mode_pay: data.Mode_pay,
          usercommdetfk: data.usercommdetfk,
          labrcomdetfk: data.labrcomdetfk,
        };

        const newCommande = await Model.commandeEnDetail.create(commandes);

        if (!newCommande) {
          return res.status(400).json({
            success: false,
            message: "Error adding the order.",
          });
        }

        const updatedProduits = [];

        for (const e of data.produits) {
          const produit = await Model.produitlabrairie.findByPk(
            e.prodlaibrcommdetfk
          );

          if (produit) {
            const oldPrice = produit.prix;
            const tva = produit.tva;
            let newPrice = oldPrice;
            let eligibleCategory = null;

            if (codePromoRecord) {
              const codePromocat = await Model.codePromocategory.findAll({
                where: { promocodeid: codePromoRecord.dataValues.id },
              });

              for (const category of codePromocat) {
                eligibleCategory =
                  category.ctagorieid === produit.categprodlabfk;

                if (eligibleCategory) {
                  const discount = category.discountPercentage;
                  newPrice = oldPrice * (1 - discount / 100);
                  newPricetva = newPrice + newPrice * (tva / 100);
                  break;
                }
              }
            }


            oldTotal += oldPrice * e.Qte;
            newTotalremise += newPrice * e.Qte;
            newTotal += newPricetva * e.Qte;
            newtotaltva += newPricetva * e.Qte;

            updatedProduits.push({
              ...e,
              oldPrice,
              newPrice,
              newPricetva,
            });

            let updatedQte = produit.qte - e.Qte;
            if (updatedQte < 0) {
              updatedQte = 0;
            }
            await Model.produitlabrairie.update(
              { qte: updatedQte },
              { where: { id: e.prodlaibrcommdetfk } }
            );
          }
        }

        await Model.ProduitCommandeEnDetail.bulkCreate(updatedProduits);

        if (codePromoRecord) {
          await Model.historycodePromo.create({
            historypromocodeid: codePromoRecord.id,
            clienthiscodeprfk: clientid,
          });
        }

        updatedCommandeDetails.push({
          ...data,
          produits: updatedProduits,
          oldTotal,
          newTotal,
        });
      }

      return res.status(200).json({
        success: true,
        message: "Order added successfully!",
        commandeDetails: updatedCommandeDetails,
        oldTotal,
        newTotal,
        newTotalremise
      });
    } catch (err) {
      return res.status(400).json({
        success: false,
        error: err.message,
      });
    }
  },

  calculecommande: async (req, res) => {
    const { commande, promoCode, clientid } = req.body;

    try {
      let codePromoRecord = null;

      if (promoCode) {
        codePromoRecord = await Model.codePromo.findOne({
          where: { code: promoCode },
          include: [
            {
              model: Model.codePromocategory,
              include: [{ model: Model.categorie }],
            },
          ],
        });

        if (!codePromoRecord) {
          return res.status(400).json({
            success: false,
            message: "Invalid promo code.",
          });
        }
      }

      let oldTotal = 0.0;
      let newTotal = 0.0;
      let newTotalremise = 0.0;
      let newPricetva = 0.0;
      let newtotaltva = 0.0;
      const updatedCommandeDetails = [];

      for (const data of commande) {
        let commandes = {
          total_ttc: data.total_ttc,
          etatClient: "en cours",
          etatVender: "Nouveau",
          identifiant: data.identifiant,
          Adresse: data.Adresse,
          Mode_liv: data.Mode_liv,
          Mode_pay: data.Mode_pay,
          usercommdetfk: data.usercommdetfk,
          labrcomdetfk: data.labrcomdetfk,
        };

        const updatedProduits = [];

        for (const e of data.produits) {
          const produit = await Model.produitlabrairie.findByPk(
            e.prodlaibrcommdetfk
          );

          if (produit) {
            const oldPrice = produit.prix;
            const tva = produit.tva;
            let newPrice = oldPrice;
            let eligibleCategory = null;

            if (codePromoRecord) {
              const codePromocat = await Model.codePromocategory.findAll({
                where: { promocodeid: codePromoRecord.dataValues.id },
              });

              for (const category of codePromocat) {
                eligibleCategory =
                  category.ctagorieid === produit.categprodlabfk;

                if (eligibleCategory) {
                  const discount = category.discountPercentage;
                  newPrice = oldPrice * (1 - discount / 100);
                  newPricetva = newPrice + newPrice * (tva / 100);
                  break;
                }
              }
            }

            oldTotal += oldPrice * e.Qte;
            newTotalremise += newPrice * e.Qte;
            newTotal += newPricetva * e.Qte;
            newtotaltva += newPricetva * e.Qte;

            updatedProduits.push({
              ...e,
              oldPrice,
              newPrice,
              newPricetva,
            });

            let updatedQte = produit.qte - e.Qte;
            if (updatedQte < 0) {
              updatedQte = 0;
            }
          }
        }

        updatedCommandeDetails.push({
          ...data,
          produits: updatedProduits,
          oldTotal,
          newTotal,
        });
      }

      return res.status(200).json({
        success: true,
        message: "Order calculated successfully!",
        commandeDetails: updatedCommandeDetails,
        oldTotal,
        newTotal,
        newTotalremise
      });
    } catch (err) {
      return res.status(400).json({
        success: false,
        error: err.message,
      });
    }
  },

  addcommandespecial: async (req, res) => {
    try {
      const {
        etatClient,
        Adresse,
        Description,
        email,
        telephone,
        Nom,
        identifiant,
        usercommdespectfk,
        labrcomdespectfk,
        codepromo,
      } = req.body;
      let codeExist = null;
      if (req.body.codepromo) {
        codeExist = await Model.codePromo.findOne({
          where: { code: codepromo, etat: "Valider" },
        });
        if (!codeExist) {
          return res.status(400).json({ message: "Promo code does not exist" });
        }
      }

      let commande = null;

      if (!req.files || req.files.length === 0) {
        commande = await Model.commandeSpecial.create({
          etatClient: etatClient,
          Adresse: Adresse,
          Description: Description,
          codepromo: codepromo,
          email: email,
          telephone: telephone,
          identifiant: identifiant,
          Nom: Nom,
          usercommdespectfk: usercommdespectfk,
          labrcomdespectfk: labrcomdespectfk,
        });

        return res.status(200).json({
          success: true,
          message: "Commande created successfully without files",
          commande,
        });
      }

      const uploadedFiles = await Promise.all(
        req.files.map(async (file) => {
          try {
            const result = await cloudinary.uploader.upload(file.path);
            return result.secure_url;
          } catch (error) {
            throw new Error(`File upload failed: ${error.message}`);
          }
        })
      );

      commande = await Model.commandeSpecial.create({
        etatClient: etatClient,
        Adresse: Adresse,
        Description: Description,
        codepromo: codepromo,
        email: email,
        identifiant: identifiant,
        telephone: telephone,
        Nom: Nom,
        Fichier: uploadedFiles.join(","),
        usercommdespectfk: usercommdespectfk,
        labrcomdespectfk: labrcomdespectfk,
      });

      return res.status(200).json({
        success: true,
        message: "Commande created successfully with files",
        commande,
      });
    } catch (error) {
      console.error(error);
      return res.status(400).json({
        success: false,
        error: `Error creating the commande: ${error.message}`,
      });
    }
  },
  addcommandeinviter: async (req, res) => {
    try {
      const { email, telephone, fullname, commande } = req.body;

      const user = await Model.user.create({
        fullname: fullname,
        email: email,
        password: null,
        email_verifie: "verifie",
        role: "inviter",
        etatCompte: "active",
        point: 0,
        telephone: telephone,
        verification_token: null,
      });
      const updatedCommandeDetails = [];

      for (const data of commande) {
        let commandes = {
          total_ttc: data.total_ttc,
          etatClient: "en cours",
          etatVender: "Nouveau",
          Adresse: data.Adresse,
          Mode_liv: data.Mode_liv,
          Mode_pay: data.Mode_pay,
          usercommdetfk: user.id,
          labrcomdetfk: data.labrcomdetfk,
        };

        const newCommande = await Model.commandeEnDetail.create(commandes);

        if (!newCommande) {
          return res.status(400).json({
            success: false,
            message: "Error adding the order.",
          });
        }

        const updatedProduits = [];

        for (const e of data.produits) {
          const produit = await Model.produitlabrairie.findByPk(
            e.prodlaibrcommdetfk
          );

          if (produit) {
            updatedProduits.push({
              ...e,
              comdetprodlabrfk: newCommande.id,
            });

            let updatedQte = produit.qte - e.Qte;
            if (updatedQte < 0) {
              updatedQte = 0;
            }
            await Model.produitlabrairie.update(
              { qte: updatedQte },
              { where: { id: e.prodlaibrcommdetfk } }
            );
          }
        }

        await Model.ProduitCommandeEnDetail.bulkCreate(updatedProduits);
      }

      return res.status(200).json({
        success: true,
        message: "Commande guest created successfully",
        commande,
      });
    } catch (error) {
      console.error(error);
      return res.status(400).json({
        success: false,
        error: `Error creating the commande: ${error.message}`,
      });
    }
  },

  addcommandespecialinviter: async (req, res) => {
    try {
      const {
        Adresse,
        Description,
        email,
        telephone,
        Nom,
        identifiant,
        labrcomdespectfk,
        codepromo,
      } = req.body;
      let codeExist = null;
      let addressestk = null;
      let commande = null;

      const user = await Model.user.create({
        fullname: Nom,
        email: email,
        password: null,
        email_verifie: "verifie",
        role: "inviter",
        etatCompte: "active",
        point: 0,
        telephone: telephone,
        verification_token: null,
      });
      if (Adresse == null) {
        addressestk = 1;
        if (!req.files || req.files.length === 0) {
          commande = await Model.commandeSpecial.create({
            etatClient: "en cours",
            Adresse: addressestk,
            Description: Description,
            codepromo: codepromo,
            email: email,
            telephone: telephone,
            identifiant: identifiant,
            Nom: Nom,
            usercommdespectfk: user.id,
            labrcomdespectfk: labrcomdespectfk,
          });

          return res.status(200).json({
            success: true,
            message: "Commande created successfully without files",
            commande,
          });
        }

        const uploadedFiles = await Promise.all(
          req.files.map(async (file) => {
            try {
              const result = await cloudinary.uploader.upload(file.path);
              return result.secure_url;
            } catch (error) {
              throw new Error(`File upload failed: ${error.message}`);
            }
          })
        );

        commande = await Model.commandeSpecial.create({
          etatClient: "en cours",
          Adresse: addressestk,
          Description: Description,
          codepromo: codepromo,
          email: email,
          identifiant: identifiant,
          telephone: telephone,
          Nom: Nom,
          Fichier: uploadedFiles.join(","),
          usercommdespectfk: user.id,
          labrcomdespectfk: labrcomdespectfk,
        });
      }

      const data = {
        Adresse: Adresse,
      };
      const addresseinv = await Model.adresses.create(data);
      if (req.body.codepromo) {
        codeExist = await Model.codePromo.findOne({
          where: { code: codepromo, etat: "Valider" },
        });
        if (!codeExist) {
          return res.status(400).json({ message: "Promo code does not exist" });
        }
      }

      

      if (!req.files || req.files.length === 0) {
        commande = await Model.commandeSpecial.create({
          etatClient: "en cours",
          Adresse: addresseinv.id,
          Description: Description,
          codepromo: codepromo,
          email: email,
          telephone: telephone,
          identifiant: identifiant,
          Nom: Nom,
          usercommdespectfk: user.id,
          labrcomdespectfk: labrcomdespectfk,
        });

        return res.status(200).json({
          success: true,
          message: "Commande created successfully without files",
          commande,
        });
      }

      const uploadedFiles = await Promise.all(
        req.files.map(async (file) => {
          try {
            const result = await cloudinary.uploader.upload(file.path);
            return result.secure_url;
          } catch (error) {
            throw new Error(`File upload failed: ${error.message}`);
          }
        })
      );

      commande = await Model.commandeSpecial.create({
        etatClient: "en cours",
        Adresse: addresseinv.id,
        Description: Description,
        codepromo: codepromo,
        email: email,
        identifiant: identifiant,
        telephone: telephone,
        Nom: Nom,
        Fichier: uploadedFiles.join(","),
        usercommdespectfk: user.id,
        labrcomdespectfk: labrcomdespectfk,
      });

      return res.status(200).json({
        success: true,
        message: "Commande created successfully with files",
        commande,
      });
    } catch (error) {
      console.error(error);
      return res.status(400).json({
        success: false,
        error: `Error creating the commande: ${error.message}`,
      });
    }
  },

  deleteCommandeSpec: async (req, res) => {
    const { ids } = req.body;
    try {
      Model.commandeSpecial
        .destroy({
          where: {
            id: ids,
          },
        })
        .then((response) => {
          if (response !== null) {
            return res.status(200).json({
              success: true,
              message: "Commande Deleted",
            });
          } else {
            return res.status(400).json({
              success: false,
              err: "Deleted Failed",
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

  findSpecCommandeByuser: async (req, res) => {
    const { sortBy, sortOrder, page, pageSize, etat, username } = req.query;
    const offset = (page - 1) * pageSize;
    const order = [[sortBy, sortOrder === "desc" ? "DESC" : "ASC"]];

    const wherename = {};

    try {
      let whereClause = { usercommdespectfk: req.params.id };
      if (etat && etat === "tout") {
        whereClause.etatClient = {
          [Sequelize.Op.or]: ["en_cours", "livre", "Rejeter"],
        };
      } else if (etat && etat !== "tout") {
        whereClause.etatClient = etat;
      }

      if (username) {
        wherename.fullname = {
          [Sequelize.Op.like]: `%${username}%`,
        };

        whereClause = { ...whereClause, "$user.fullname$": wherename.fullname };
      }

      const count = await Model.commandeSpecial.count({
        where: whereClause,
        include: [
          {
            model: Model.user,
            attributes: [],
            where: wherename,
          },
        ],
      });

      Model.commandeSpecial
        .findAll({
          offset: offset,
          order: order,
          limit: +pageSize,
          where: whereClause,
          include: [
            {
              model: Model.user,
              where: wherename,
            },
            {
              model: Model.labrairie,
              attributes: ["id", "nameLibrairie", "imageStore"],
            },
          ],
        })
        .then((response) => {
          if (response !== null) {
            const totalPages = Math.ceil(count / pageSize);
            return res.status(200).json({
              success: true,
              commandes: response,
              totalPages: totalPages,
            });
          } else {
            return res.status(400).json({
              success: false,
              err: "Aucune commande trouvée.",
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

  findSpecCommandeBycodepromo: async (req, res) => {
    const { sortBy, sortOrder, page, pageSize, etat, codePromo } = req.query;
    const offset = (page - 1) * pageSize;
    const order = [[sortBy, sortOrder === "desc" ? "DESC" : "ASC"]];

    try {
      let whereClause = { codePromo: codePromo };
      if (etat && etat === "tout") {
        whereClause.etatClient = {
          [Sequelize.Op.or]: ["en_cours", "livre", "Rejeter"],
        };
      } else if (etat && etat !== "tout") {
        whereClause.etatClient = etat;
      }

      const count = await Model.commandeSpecial.count({
        where: whereClause,
        include: [
          {
            model: Model.user,
            attributes: [],
          },
        ],
      });

      Model.commandeSpecial
        .findAll({
          offset: offset,
          order: order,
          limit: +pageSize,
          where: whereClause,
          include: [
            {
              model: Model.user,
            },
            {
              model: Model.labrairie,
              attributes: ["id", "nameLibrairie", "imageStore"],
            },
          ],
        })
        .then((response) => {
          if (response !== null) {
            const totalPages = Math.ceil(count / pageSize);
            return res.status(200).json({
              success: true,
              commandes: response,
              totalPages: totalPages,
            });
          } else {
            return res.status(400).json({
              success: false,
              err: "Aucune commande trouvée.",
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

  findCommandeident: async (req, res) => {
    const { sortBy, sortOrder, page, pageSize, etat, username, identifiant } =
      req.query;
    const offset = (page - 1) * pageSize;
    const order = [[sortBy, sortOrder === "desc" ? "DESC" : "ASC"]];

    const wherename = {};

    try {
      let whereClause = {};
      if (etat && etat === "tout") {
        whereClause.etatClient = {
          [Sequelize.Op.or]: ["en_cours", "livre", "Rejeter"],
        };
      } else if (etat && etat !== "tout") {
        whereClause.etatClient = etat;
      }
      if (identifiant) {
        whereClause.identifiant = {
          [Sequelize.Op.like]: `%${identifiant}%`,
        };
      }

      if (username) {
        whereClause.Nom = {
          [Sequelize.Op.like]: `%${username}%`,
        };
      }

      const count = await Model.commandeIdentifiant.count({
        where: whereClause,
      });

      Model.commandeIdentifiant
        .findAll({
          offset: offset,
          order: order,
          limit: +pageSize,
          where: whereClause,
        })
        .then((response) => {
          if (response !== null) {
            const totalPages = Math.ceil(count / pageSize);
            return res.status(200).json({
              success: true,
              commandes: response,
              totalPages: totalPages,
            });
          } else {
            return res.status(400).json({
              success: false,
              err: "Aucune commande trouvée.",
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
  findCommandespecident: async (req, res) => {
    const { sortBy, sortOrder, page, pageSize, etat, username, identifiant } =
      req.query;
    const offset = (page - 1) * pageSize;
    const order = [[sortBy, sortOrder === "desc" ? "DESC" : "ASC"]];

    try {
      let whereClause = {};
      if (etat && etat === "tout") {
        whereClause.etatClient = {
          [Sequelize.Op.or]: ["en_cours", "livre", "Rejeter"],
        };
      } else if (etat && etat !== "tout") {
        whereClause.etatClient = etat;
      }
      if (identifiant) {
        whereClause.identifiant = {
          [Sequelize.Op.like]: `%${identifiant}%`,
        };
      }

      if (username) {
        whereClause.Nom = {
          [Sequelize.Op.like]: `%${username}%`,
        };
      }

      const count = await Model.commandeSpecialidentifiant.count({
        where: whereClause,
      });

      Model.commandeSpecialidentifiant
        .findAll({
          offset: offset,
          order: order,
          limit: +pageSize,
          where: whereClause,
        })
        .then((response) => {
          if (response !== null) {
            const totalPages = Math.ceil(count / pageSize);
            return res.status(200).json({
              success: true,
              commandes: response,
              totalPages: totalPages,
            });
          } else {
            return res.status(400).json({
              success: false,
              err: "Aucune commande trouvée.",
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

  findOneCommandeident: async (req, res) => {
    try {
      const commandId = req.params.id;

      const command = await Model.commandeIdentifiant.findAll({
        where: {
          id: commandId,
        },

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

      if (!command) {
        return res.status(404).json({
          success: false,
          error: "Command not found",
        });
      }

      return res.status(200).json({
        success: true,
        commande: command,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        error: err.message,
      });
    }
  },

  findCommandeByuser: async (req, res) => {
    const { sortBy, sortOrder, page, pageSize, etatcommande } = req.query;

    const offset = (page - 1) * pageSize;
    const order = [[sortBy, sortOrder === "desc" ? "DESC" : "ASC"]];
    try {
      if (etatcommande == "tout") {
        const totalCounttout = await Model.commandeEnDetail.count({
          where: {
            usercommdetfk: req.params.id,
          },
        });
        const commandes = await Model.commandeEnDetail.findAll({
          offset: offset,
          order: order,
          limit: +pageSize,
          where: {
            usercommdetfk: req.params.id,
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
        if (commandes.length > 0) {
          const totalPages = Math.ceil(totalCounttout / pageSize);
          return res.status(200).json({
            success: true,
            commandes: commandes,
            totalPages: totalPages,
          });
        } else {
          return res.status(400).json({
            success: false,
            err: "Aucune commande trouvée pour cet utilisateur.",
          });
        }
      } else {
        const totalCount = await Model.commandeEnDetail.count({
          where: {
            usercommdetfk: req.params.id,
            etatClient: etatcommande,
          },
        });
        const commandes = await Model.commandeEnDetail.findAll({
          offset: offset,
          order: order,
          limit: +pageSize,
          where: {
            usercommdetfk: req.params.id,
            etatClient: etatcommande,
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
        if (commandes.length > 0) {
          const totalPages = Math.ceil(totalCount / pageSize);
          return res.status(200).json({
            success: true,
            commandes: commandes,
            totalPages: totalPages,
          });
        } else {
          return res.status(400).json({
            success: false,
            err: "Aucune commande trouvée pour cet utilisateur.",
          });
        }
      }
    } catch (err) {
      return res.status(400).json({
        success: false,
        error: err.message,
      });
    }
  },
  findCommandeByidentifiant: async (req, res) => {
    const { sortBy, sortOrder, page, pageSize, etatcommande, identifiant } =
      req.query;

    const offset = (page - 1) * pageSize;
    const order = [[sortBy, sortOrder === "desc" ? "DESC" : "ASC"]];
    try {
      if (etatcommande == "tout") {
        const totalCounttout = await Model.commandeEnDetail.count({
          where: {
            identifiant: identifiant,
          },
        });
        const commandes = await Model.commandeEnDetail.findAll({
          offset: offset,
          order: order,
          limit: +pageSize,
          where: {
            identifiant: identifiant,
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
        if (commandes.length > 0) {
          const totalPages = Math.ceil(totalCounttout / pageSize);
          return res.status(200).json({
            success: true,
            commandes: commandes,
            totalPages: totalPages,
          });
        } else {
          return res.status(400).json({
            success: false,
            err: "Aucune commande trouvée pour cet utilisateur.",
          });
        }
      } else {
        const totalCount = await Model.commandeEnDetail.count({
          where: {
            identifiant: identifiant,
            etatClient: etatcommande,
          },
        });
        const commandes = await Model.commandeEnDetail.findAll({
          offset: offset,
          order: order,
          limit: +pageSize,
          where: {
            identifiant: identifiant,
            etatClient: etatcommande,
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
        if (commandes.length > 0) {
          const totalPages = Math.ceil(totalCount / pageSize);
          return res.status(200).json({
            success: true,
            commandes: commandes,
            totalPages: totalPages,
          });
        } else {
          return res.status(400).json({
            success: false,
            err: "Aucune commande trouvée pour cet utilisateur.",
          });
        }
      }
    } catch (err) {
      return res.status(400).json({
        success: false,
        error: err.message,
      });
    }
  },
  findOneCommande: async (req, res) => {
    try {
      const commandId = req.params.id;

      const command = await Model.commandeEnDetail.findAll({
        where: {
          id: commandId,
        },

        include: [
          {
            model: Model.user,
            attributes: ["fullname", "avatar", "telephone", "email"],
            include: [
              {
                model: Model.client,
                attributes: ["userclientfk"],
                include: [
                  {
                    model: Model.adresses,
                  },
                ],
              },
              {
                model: Model.partenaire,

                include: [
                  {
                    model: Model.adresses,
                  },
                ],
              },
            ],
          },
          {
            model: Model.labrairie,
            attributes: ["nameLibrairie", "userlabfk"],
          },
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

      if (!command) {
        return res.status(404).json({
          success: false,
          error: "Command not found",
        });
      }

      return res.status(200).json({
        success: true,
        commande: command,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        error: err.message,
      });
    }
  },

  findOneSpecCommande: async (req, res) => {
    try {
      Model.commandeSpecial
        .findAll({
          where: { id: req.params.id },
          include: [
            {
              model: Model.user,
              attributes: ["fullname", "avatar", "telephone", "email", "role"],
              include: [
                {
                  model: Model.client,
                  include: [
                    {
                      model: Model.adresses,
                      attributes: {
                        exclude: [
                          "partenaireaddressfk",
                          "fournisseuraddressfk",
                        ],
                      },
                    },
                  ],
                },
              ],
            },
          ],
        })
        .then((response) => {
          if (response !== null) {
            return res.status(200).json({
              success: true,
              commandes: response,
            });
          } else {
            return res.status(400).json({
              success: false,
              err: "zero commande trouve",
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

  findOneSpecidentCommande: async (req, res) => {
    try {
      Model.commandeSpecialidentifiant
        .findAll({
          where: { id: req.params.id },
        })
        .then((response) => {
          if (response !== null) {
            return res.status(200).json({
              success: true,
              commandes: response,
            });
          } else {
            return res.status(400).json({
              success: false,
              err: "zero commande trouve",
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

  findCommandeBylibrairie: async (req, res) => {
    const { sortBy, sortOrder, page, pageSize, etatcommande } = req.query;

    const offset = (page - 1) * pageSize;
    const order = [[sortBy, sortOrder === "desc" ? "DESC" : "ASC"]];
    try {
      if (etatcommande == "tout") {
        const totalCounttout = await Model.commandeEnDetail.count({
          where: {
            labrcomdetfk: req.params.id,
          },
        });
        const commandes = await Model.commandeEnDetail.findAll({
          offset: offset,
          order: order,
          limit: +pageSize,
          where: {
            labrcomdetfk: req.params.id,
          },
          attributes: {
            exclude: ["updatedAt", "usercommdetfk", "labrcomdetfk"],
          },
          include: [
            { model: Model.user, attributes: ["fullname", "avatar"] },
            { model: Model.produitlabrairie },
          ],
        });
        if (commandes.length > 0) {
          const totalPages = Math.ceil(totalCounttout / pageSize);
          return res.status(200).json({
            success: true,
            commandes: commandes,
            totalPages: totalPages,
          });
        } else {
          return res.status(400).json({
            success: false,
            err: "Aucune commande trouvée pour cet librairie.",
          });
        }
      } else {
        const totalCount = await Model.commandeEnDetail.count({
          where: {
            labrcomdetfk: req.params.id,
            etatVender: etatcommande,
          },
        });
        const commandes = await Model.commandeEnDetail.findAll({
          offset: offset,
          order: order,
          limit: +pageSize,
          where: {
            labrcomdetfk: req.params.id,
            etatVender: etatcommande,
          },
          attributes: {
            exclude: ["updatedAt", "usercommdetfk", "labrcomdetfk"],
          },
          include: [
            { model: Model.user, attributes: ["fullname", "avatar"] },
            { model: Model.produitlabrairie },
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
        if (commandes.length > 0) {
          const totalPages = Math.ceil(totalCount / pageSize);
          return res.status(200).json({
            success: true,
            commandes: commandes,
            totalPages: totalPages,
          });
        } else {
          return res.status(400).json({
            success: false,
            err: "Aucune commande trouvée pour cet utilisateur.",
          });
        }
      }
    } catch (err) {
      return res.status(400).json({
        success: false,
        error: err.message,
      });
    }
  },

  findLivraisonBylibrairie: async (req, res) => {
    const { sortBy, sortOrder, page, pageSize, etatcommande } = req.query;

    const offset = (page - 1) * pageSize;
    const order = [[sortBy, sortOrder === "desc" ? "DESC" : "ASC"]];
    try {
      if (etatcommande == "tout") {
        const totalCounttout = await Model.commandeEnDetail.count({
          where: {
            labrcomdetfk: req.params.id,
          },
        });
        const commandes = await Model.commandeEnDetail.findAll({
          offset: offset,
          order: order,
          limit: +pageSize,
          where: {
            labrcomdetfk: req.params.id,
          },
          attributes: {
            exclude: ["updatedAt", "usercommdetfk", "labrcomdetfk"],
          },
          include: [
            { model: Model.user, attributes: ["fullname", "avatar"] },
            { model: Model.produitlabrairie },
          ],
        });
        if (commandes.length > 0) {
          const totalPages = Math.ceil(totalCounttout / pageSize);
          return res.status(200).json({
            success: true,
            commandes: commandes,
            totalPages: totalPages,
          });
        } else {
          return res.status(400).json({
            success: false,
            err: "Aucune commande trouvée pour cet librairie.",
          });
        }
      } else {
        const totalCount = await Model.commandeEnDetail.count({
          where: {
            labrcomdetfk: req.params.id,
            etatVender: etatcommande,
          },
        });
        const commandes = await Model.commandeEnDetail.findAll({
          offset: offset,
          order: order,
          limit: +pageSize,
          where: {
            labrcomdetfk: req.params.id,
            etatVender: etatcommande,
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
        if (commandes.length > 0) {
          const totalPages = Math.ceil(totalCount / pageSize);
          return res.status(200).json({
            success: true,
            commandes: commandes,
            totalPages: totalPages,
          });
        } else {
          return res.status(400).json({
            success: false,
            err: "Aucune commande trouvée pour cet utilisateur.",
          });
        }
      }
    } catch (err) {
      return res.status(400).json({
        success: false,
        error: err.message,
      });
    }
  },

  findSpecCommandeBylibrairie: async (req, res) => {
    const { sortBy, sortOrder, page, pageSize, etat, username } = req.query;

    const offset = (page - 1) * pageSize;
    const order = [[sortBy, sortOrder === "desc" ? "DESC" : "ASC"]];
    const wherename = {};

    try {
      let whereClause = { labrcomdespectfk: req.params.id };
      if (etat && etat === "tout") {
        whereClause.etatClient = {
          [Sequelize.Op.or]: ["en_cours", "livre", "Rejeter"],
        };
      } else if (etat && etat !== "tout") {
        whereClause.etatClient = etat;
      }

      if (username) {
        wherename.fullname = {
          [Sequelize.Op.like]: `%${username}%`,
        };

        whereClause = { ...whereClause, "$user.fullname$": wherename.fullname };
      }

      const count = await Model.commandeSpecial.count({
        where: whereClause,
        include: [
          {
            model: Model.user,
            attributes: [],
            where: wherename,
          },
        ],
      });

      Model.commandeSpecial
        .findAll({
          offset: offset,
          order: order,
          limit: +pageSize,
          where: whereClause,
          include: [
            {
              model: Model.user,

              attributes: ["fullname", "avatar", "telephone", "email", "role"],
              where: wherename,
              include: [
                {
                  model: Model.client,
                  include: [
                    {
                      model: Model.adresses,
                      attributes: {
                        exclude: [
                          "partenaireaddressfk",
                          "fournisseuraddressfk",
                        ],
                      },
                    },
                  ],
                },
              ],
            },
          ],
        })
        .then((response) => {
          if (response != 0) {
            const totalPages = Math.ceil(count / pageSize);
            return res.status(200).json({
              success: true,
              commandes: response,
              totalPages: totalPages,
            });
          } else {
            return res.status(400).json({
              success: false,
              err: "  zero commande trouve ",
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

  Annuler: async (req, res) => {
    try {
      const produits = req.body.produit;
      Model.commandeEnDetail
        .update(
          {
            Data_rejetée: new Date(),
            etatClient: "Annule",
            etatVender: "Rejeter",
          },
          { where: { id: req.params.id } }
        )
        .then((response) => {
          if (response !== 0) {
            produits?.map((e) => {
              Model.produitlabrairie
                .findOne({ where: { id: e.id } })
                .then((response) => {
                  if (response !== null) {
                    const newQte = response.qte + Number(e.Qte);
                    Model.produitlabrairie.update(
                      { qte: newQte },
                      { where: { id: e.id } }
                    );
                  } else {
                    return res.status(400).json({
                      success: false,
                      message: " error to find produit ",
                    });
                  }
                });
            });
            return res.status(200).json({
              success: true,
              message: "commande Annuler",
            });
          } else {
            return res.status(400).json({
              success: false,
              message: "error Annuler commande ",
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

  Annulercommande: async (req, res) => {
    try {
      const produits = req.body.produit;
      Model.commandeEnDetail
        .update(
          {
            Data_rejetée: new Date(),
            etatClient: "Annule",
            etatVender: "Rejeter",
          },
          { where: { id: req.params.id } }
        )
        .then((response) => {
          if (response !== 0) {
            produits?.map((e) => {
              Model.produitlabrairie
                .findOne({ where: { id: e.id } })
                .then((response) => {
                  if (response !== null) {
                    const newQte = response.qte + Number(e.Qte);
                    Model.produitlabrairie.update(
                      { qte: newQte },
                      { where: { id: e.id } }
                    );
                  } else {
                    return res.status(400).json({
                      success: false,
                      message: " error to find produit ",
                    });
                  }
                });
            });
            return res.status(200).json({
              success: true,
              message: "commande Annuler",
            });
          } else {
            return res.status(400).json({
              success: false,
              message: "error Annuler commande ",
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

  Annulercommandespecial: async (req, res) => {
    try {
      Model.commandeSpecial
        .update(
          {
            etatClient: "Rejeter",
          },
          { where: { id: req.params.id } }
        )
        .then((response) => {
          if (response !== 0) {
            return res.status(200).json({
              success: true,
              message: "commande special Annuler",
            });
          } else {
            return res.status(400).json({
              success: false,
              message: "error Annuler commande special",
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
  AnnulercommandeIdentifiant: async (req, res) => {
    try {
      Model.commandeIdentifiant
        .update(
          {
            etatClient: "Rejeter",
          },
          { where: { id: req.params.id } }
        )
        .then((response) => {
          if (response !== 0) {
            return res.status(200).json({
              success: true,
              message: "commande Identifiant Annuler",
            });
          } else {
            return res.status(400).json({
              success: false,
              message: "error Annuler Identifiant special",
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
  AnnulercommandespecIdentifiant: async (req, res) => {
    try {
      Model.commandeSpecialidentifiant
        .update(
          {
            etatClient: "Rejeter",
          },
          { where: { id: req.params.id } }
        )
        .then((response) => {
          if (response !== 0) {
            return res.status(200).json({
              success: true,
              message: "commande Identifiant Annuler",
            });
          } else {
            return res.status(400).json({
              success: false,
              message: "error Annuler Identifiant special",
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
  Accepter: async (req, res) => {
    try {
      Model.commandeEnDetail
        .update(
          { data_acceptation: new Date(), etatVender: "en_cours" },
          { where: { id: req.params.id } }
        )
        .then((response) => {
          if (response !== 0) {
            return res.status(200).json({
              success: true,
              message: "commande accepte",
            });
          } else {
            return res.status(400).json({
              success: false,
              message: "error accepte commande ",
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
  AccepterCommandeSpecial: async (req, res) => {
    try {
      Model.commandeSpecial
        .update({ etatClient: "en_cours" }, { where: { id: req.params.id } })
        .then((response) => {
          if (response !== 0) {
            return res.status(200).json({
              success: true,
              message: "commande Special acceptée",
            });
          } else {
            return res.status(400).json({
              success: false,
              message: "error accepte commande Special ",
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
  AccepterCommandeidentifiant: async (req, res) => {
    try {
      Model.commandeIdentifiant
        .update({ etatClient: "en_cours" }, { where: { id: req.params.id } })
        .then((response) => {
          if (response !== 0) {
            return res.status(200).json({
              success: true,
              message: "commande Identifiant acceptée",
            });
          } else {
            return res.status(400).json({
              success: false,
              message: "error accepte commande Identifiant ",
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
  AccepterCommandespecidentifiant: async (req, res) => {
    try {
      Model.commandeSpecialidentifiant
        .update({ etatClient: "en_cours" }, { where: { id: req.params.id } })
        .then((response) => {
          if (response !== 0) {
            return res.status(200).json({
              success: true,
              message: "commande Identifiant acceptée",
            });
          } else {
            return res.status(400).json({
              success: false,
              message: "error accepte commande Identifiant ",
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
  livre: async (req, res) => {
    try {
      Model.commandeEnDetail
        .update(
          {
            Date_préparée: new Date(),
            etatClient: "Livre",
            etatVender: "Compléter",
          },
          { where: { id: req.params.id } }
        )
        .then((response) => {
          if (response !== 0) {
            return res.status(200).json({
              success: true,
              message: "commande livre",
            });
          } else {
            return res.status(400).json({
              success: false,
              message: "error livre commande ",
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
  livreCommandeSpecial: async (req, res) => {
    try {
      Model.commandeSpecial
        .update(
          {
            etatClient: "Livre",
          },
          { where: { id: req.params.id } }
        )
        .then((response) => {
          if (response !== 0) {
            return res.status(200).json({
              success: true,
              message: "commande Special livre",
            });
          } else {
            return res.status(400).json({
              success: false,
              message: "error livre commande Special",
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
  livreCommandeIdentifiant: async (req, res) => {
    try {
      Model.commandeIdentifiant
        .update(
          {
            etatClient: "Livre",
          },
          { where: { id: req.params.id } }
        )
        .then((response) => {
          if (response !== 0) {
            return res.status(200).json({
              success: true,
              message: "commande Identifiant livre",
            });
          } else {
            return res.status(400).json({
              success: false,
              message: "error livre commande Identifiant",
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
  livreCommandespecIdentifiant: async (req, res) => {
    try {
      Model.commandeSpecialidentifiant
        .update(
          {
            etatClient: "Livre",
          },
          { where: { id: req.params.id } }
        )
        .then((response) => {
          if (response !== 0) {
            return res.status(200).json({
              success: true,
              message: "commande Identifiant livre",
            });
          } else {
            return res.status(400).json({
              success: false,
              message: "error livre commande Identifiant",
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
  addArticle: async (req, res) => {
    try {
      const { Qte, produitlabrcomdetfk, comdetprodlabrfk, prix } = req.body;
      const data = {
        Qte: Qte,
        produitlabrcomdetfk: produitlabrcomdetfk,
        comdetprodlabrfk: comdetprodlabrfk,
      };
      Model.ProduitCommandeEnDetail.findOne({
        where: {
          produitlabrcomdetfk: produitlabrcomdetfk,
          comdetprodlabrfk: comdetprodlabrfk,
        },
      }).then((response) => {
        if (response !== null) {
          const newQte = Number(response.Qte) + Number(Qte);
          Model.commandeEnDetail
            .findOne({ where: { id: comdetprodlabrfk } })
            .then((response) => {
              if (response !== null) {
                const newPrix = response.total_ttc + Qte * prix;
                Model.commandeEnDetail
                  .update(
                    { total_ttc: newPrix },
                    { where: { id: comdetprodlabrfk } }
                  )
                  .then((response) => {
                    if (response !== 0) {
                      Model.ProduitCommandeEnDetail.update(
                        { Qte: newQte },
                        {
                          where: {
                            produitlabrcomdetfk: produitlabrcomdetfk,
                            comdetprodlabrfk: comdetprodlabrfk,
                          },
                        }
                      ).then((response) => {
                        if (response !== 0) {
                          return res.status(200).json({
                            success: true,
                            message: "prod add",
                          });
                        }
                      });
                    }
                  });
              }
            });
        } else {
          Model.ProduitCommandeEnDetail.create(data).then((response) => {
            if (response !== null) {
              Model.commandeEnDetail
                .findOne({ where: { id: comdetprodlabrfk } })
                .then((response) => {
                  if (response !== null) {
                    const newTot = Number(response.total_ttc) + prix * Qte;
                    Model.commandeEnDetail
                      .update(
                        { total_ttc: newTot },
                        { where: { id: comdetprodlabrfk } }
                      )
                      .then((response) => {
                        if (response !== 0) {
                          return res.status(200).json({
                            success: true,
                            message: "prod add",
                          });
                        }
                      });
                  }
                });
            } else {
              return res.status(400).json({
                success: false,
                message: "error to add prod",
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
  deleteArticle: async (req, res) => {
    try {
      Model.ProduitCommandeEnDetail.destroy({
        where: {
          produitlabrcomdetfk: req.params.produitlabrcomdetfk,
          comdetprodlabrfk: req.params.comdetprodlabrfk,
        },
      }).then((response) => {
        if (response !== 0) {
          Model.ProduitCommandeEnDetail.findAll({
            where: { comdetprodlabrfk: req.params.comdetprodlabrfk },
          }).then((response) => {
            if (response.length === 0) {
              Model.commandeEnDetail.destroy({
                where: { id: req.params.comdetprodlabrfk },
              });
            }
          });
          return res.status(200).json({
            success: true,
            message: " produit deleted",
          });
        } else {
          return res.status(200).json({
            success: true,
            message: " produit deleted",
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
  nb_commande_par_jour: async (req, res) => {
    try {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      Model.commandeEnDetail
        .findAll({
          attributes: [
            "createdAt",
            [
              Sequelize.fn("COUNT", Sequelize.col("commandeEnDetail.id")),
              "nombre_commandes",
            ],
          ],
          where: {
            createdAt: {
              [Op.gte]: sevenDaysAgo,
            },
            labrcomdetfk: req.params.id,
          },
          group: ["createdAt"],
          raw: true,
        })
        .then((response) => {
          if (response !== null) {
            return res.status(200).json({
              success: true,
              commandes: response,
            });
          } else {
            return res.status(200).json({
              success: false,
              commandes: [],
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
  produit_plus_vendus: async (req, res) => {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      Model.commandeEnDetail
        .findAll({
          attributes: [],
          include: [
            {
              model: Model.produitlabrairie,
              attributes: [
                "titre",
                [Sequelize.fn("COUNT", Sequelize.col("titre")), "total_ventes"],
              ],

              include: [
                {
                  model: Model.imageProduitLibrairie,
                  attributes: ["name_Image"],
                },
              ],
            },
          ],
          where: {
            createdAt: {
              [Op.gte]: thirtyDaysAgo,
            },
            labrcomdetfk: req.params.id,
          },
          group: ["id"],
          order: ["createdAt"],
        })
        .then((response) => {
          if (response !== null) {
            return res.status(200).json({
              success: true,
              produit: response,
            });
          } else {
            return res.status(200).json({
              success: false,
              produit: [],
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
  nb_commande: async (req, res) => {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      Model.commandeEnDetail
        .findAll({
          attributes: [
            [Sequelize.fn("COUNT", Sequelize.col("id")), "total_commandes"],
            [
              Sequelize.fn(
                "SUM",
                Sequelize.literal(
                  "CASE WHEN etatVender = 'Compléter' THEN 1 ELSE 0 END"
                )
              ),
              "completes",
            ],
            [
              Sequelize.fn(
                "SUM",
                Sequelize.literal(
                  "CASE WHEN etatVender = 'En cours' THEN 1 ELSE 0 END"
                )
              ),
              "en_cours",
            ],
            [
              Sequelize.fn(
                "SUM",
                Sequelize.literal(
                  "CASE WHEN etatVender = 'Rejeter' THEN 1 ELSE 0 END"
                )
              ),
              "rejetees",
            ],
            [
              Sequelize.fn(
                "SUM",
                Sequelize.literal(
                  "CASE WHEN etatVender = 'Nouveau' THEN 1 ELSE 0 END"
                )
              ),
              "nouvelles",
            ],
          ],
          where: {
            createdAt: {
              [Op.gte]: thirtyDaysAgo,
            },
            labrcomdetfk: req.params.id,
          },
        })
        .then((response) => {
          if (response !== null) {
            return res.status(200).json({
              success: true,
              nb_commande: response,
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
  findAllcommande: async (req, res) => {
    const { page, pageSize } = req.query;
    const offset = (page - 1) * pageSize;

    try {
      const response = await Model.commandeEnDetail.findAll({
        limit: +pageSize,
        offset: offset,
        attributes: ["id", "total_ttc", "etatVender", "createdAt"],
        include: [
          { model: Model.user, attributes: ["fullname", "avatar"] },
          { model: Model.labrairie, attributes: ["nameLibrairie"] },
          {
            model: Model.produitlabrairie,
          },
        ],
      });

      return res.status(200).json({
        success: true,
        commandes: response,
      });
    } catch (err) {
      return res.status(400).json({
        success: false,
        error: err,
      });
    }
  },

  findcommande30day: async (req, res) => {
    const { page, pageSize, sortBy, sortOrder } = req.query;
    const offset = (page - 1) * pageSize;
    order = [[sortBy, sortOrder === "desc" ? "DESC" : "ASC"]];

    try {
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - 30);

      Model.commandeEnDetail
        .findAll({
          order: order,
          limit: +pageSize,
          offset: offset,
          where: {
            createdAt: {
              [Op.gte]: daysAgo,
            },
          },
          attributes: ["id", "total_ttc", "etatVender", "createdAt"],
          include: [
            { model: Model.user, attributes: ["fullname", "avatar"] },
            {
              model: Model.produitlabrairie,
              attributes: [
                [Sequelize.fn("COUNT", Sequelize.col("titre")), "nb_Article"],
              ],
            },
            { model: Model.labrairie },
          ],
          group: ["commandeEnDetail.id"],
          order: [["createdAt", "ASC"]],
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

  findCommandefiltre: async (req, res) => {
    const { page, pageSize } = req.body;
    const offset = (page - 1) * pageSize;

    const commandeId = req.params.id;
    const {
      categorie,
      sousCategorie,
      prixMin,
      prixMax,
      quantiteMin,
      quantiteMax,
    } = req.query;

    const whereClause = {};

    if (categorie) whereClause.categorie = categorie;
    if (sousCategorie) whereClause.sousCategorie = sousCategorie;
    if (prixMin !== undefined && prixMax !== undefined) {
      whereClause.prixMin = { [Sequelize.Op.between]: [prixMin, prixMax] };
      whereClause.prixMax = { [Sequelize.Op.between]: [prixMin, prixMax] };
    }
    if (quantiteMin !== undefined && quantiteMax !== undefined) {
      whereClause.quantiteMin = {
        [Sequelize.Op.between]: [quantiteMin, quantiteMax],
      };
      whereClause.quantiteMax = {
        [Sequelize.Op.between]: [quantiteMin, quantiteMax],
      };
    }
    try {
      Model.commandeEnDetail
        .findAll({
          limit: +pageSize,
          offset: offset,
          where: { id: req.params.id },
          attributes: {
            exclude: ["updatedAt", "usercommdetfk", "labrcomdetfk"],
          },
          include: [
            {
              model: Model.user,
              attributes: ["fullname", "avatar", "telephone", "email", "role"],
            },
          ],

          order: [["createdAt", "ASC"]],
        })
        .then((response) => {
          Model.commandeEnDetail
            .findAll({
              where: { id: req.params.id },
              attributes: {
                exclude: ["updatedAt", "usercommdetfk", "labrcomdetfk"],
              },
              include: [
                {
                  model: Model.produitlabrairie,
                  attributes: ["titre", "description", "prix", "prix_en_Solde"],
                  include: [
                    {
                      model: Model.imageProduitLibrairie,
                    },
                  ],
                },
                {
                  model: Model.user,
                  attributes: [
                    "fullname",
                    "avatar",
                    "telephone",
                    "email",
                    "role",
                  ],
                  include: roleIsPartenaire(response[0].user.role),
                },
              ],
              order: [["createdAt", "ASC"]],
            })
            .then((response) => {
              if (response !== null) {
                return res.status(200).json({
                  success: true,
                  commandes: response,
                });
              } else {
                return res.status(400).json({
                  success: false,
                  err: "zero commande trouve",
                });
              }
            });
        });
    } catch (err) {
      return res.status(400).json({
        success: false,
        err: err,
      });
    }
  },

  findNumberArtInCmd: async (req, res) => {
    const { page, pageSize } = req.body;
    const offset = (page - 1) * pageSize;

    try {
      Model.commandeEnDetail
        .findAll({
          limit: +pageSize,
          offset: offset,
          where: { id: req.params.idcmd },
          attributes: ["id", "total_ttc", "etatVender", "createdAt"],
          include: [
            { model: Model.user, attributes: ["fullname", "avatar"] },
            {
              model: Model.produitlabrairie,
              attributes: [
                [Sequelize.fn("COUNT", Sequelize.col("titre")), "nb_Article"],
              ],
            },
          ],
        })
        .then((response) => {
          if (response.length != 0) {
            return res.status(200).json({
              success: true,
              commandes: response,
            });
          } else {
            return res.status(400).json({
              success: false,
              err: "  zero commande trouve ",
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

  findCommandeByall: async (req, res) => {
    const { sortBy, sortOrder, page, pageSize } = req.query;
    const offset = (page - 1) * pageSize;

    try {
      Model.commandeEnDetail
        .findAll({
          limit: +pageSize,
          offset: offset,
          order: [[sortBy, sortOrder === "desc" ? "DESC" : "ASC"]],
          attributes: ["id", "total_ttc", "etatVender", "createdAt"],
          include: [
            {
              model: Model.user,
              attributes: ["fullname", "avatar"],
            },
            {
              model: Model.produitlabrairie,
            },
            {
              model: Model.labrairie,
            },
          ],
        })
        .then((response) => {
          if (response.length != 0) {
            return res.status(200).json({
              success: true,
              commandes: response,
            });
          } else {
            return res.status(400).json({
              success: false,
              err: "zero commande trouve ",
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
  findCommandeByadmindetail: async (req, res) => {
    const { page, pageSize } = req.query;
    const offset = (page - 1) * pageSize;

    try {
      Model.commandeEnDetail
        .findAll({
          limit: +pageSize,
          offset: offset,
          where: { id: req.params.id },
          include: [
            {
              model: Model.user,
              attributes: ["fullname", "avatar", "telephone", "email", "role"],
            },
          ],
        })
        .then((response) => {
          Model.commandeEnDetail
            .findAll({
              where: { id: req.params.id },
              include: [
                {
                  model: Model.produitlabrairie,
                  attributes: ["titre", "description", "prix", "prix_en_Solde"],
                  include: [
                    {
                      model: Model.imageProduitLibrairie,
                    },
                  ],
                },
                {
                  model: Model.labrairie,
                },
                {
                  model: Model.user,
                  attributes: [
                    "fullname",
                    "avatar",
                    "telephone",
                    "email",
                    "role",
                  ],
                  include: [
                    {
                      model: Model.client,
                      attributes: ["userclientfk"],
                      include: [
                        {
                          model: Model.adresses,
                        },
                      ],
                    },
                    {
                      model: Model.partenaire,
                      include: [
                        {
                          model: Model.adresses,
                        },
                      ],
                    },
                  ],
                },
              ],
              order: [["createdAt", "ASC"]],
            })
            .then((response) => {
              if (response !== null) {
                return res.status(200).json({
                  success: true,
                  commandes: response,
                });
              } else {
                return res.status(400).json({
                  success: false,
                  err: "zero commande trouve",
                });
              }
            });
        });
    } catch (err) {
      return res.status(400).json({
        success: false,
        err: err,
      });
    }
  },

  findcmdinday: async (req, res) => {
    const { page, pageSize } = req.body;
    const offset = (page - 1) * pageSize;

    const timestamp = req.params.timestamp;

    const startOfDay = new Date(timestamp);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(timestamp);
    endOfDay.setHours(23, 59, 59, 999);

    try {
      Model.commandeEnDetail
        .findAll({
          limit: +pageSize,
          offset: offset,
          where: {
            createdAt: {
              [Op.between]: [startOfDay, endOfDay],
            },
          },
        })
        .then((response) => {
          if (response.length != 0) {
            return res.status(200).json({
              success: true,
              commandes: response,
            });
          } else {
            return res.status(400).json({
              success: false,
              err: "  zero commande trouve ",
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

  findnbrcmdindate: async (req, res) => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    try {
      Model.commandeEnDetail
        .findAll({
          attributes: [
            [Sequelize.fn("date", Sequelize.col("createdAt")), "date"],
            [Sequelize.fn("count", Sequelize.col("id")), "nbr"],
          ],
          where: {
            createdAt: {
              [Op.gte]: thirtyDaysAgo,
            },
          },

          group: [Sequelize.fn("date", Sequelize.col("createdAt"))],
        })
        .then((response) => {
          if (response.length != 0) {
            return res.status(200).json({
              success: true,
              commandes: response,
            });
          } else {
            return res.status(400).json({
              success: false,
              err: "  zero commande trouve ",
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

  commandefiltrage: async (req, res) => {
    const { sortBy, sortOrder, nameArt, page, pageSize } = req.query;
    const offset = (page - 1) * pageSize;
    const wherec = {};

    if ((sortBy, sortOrder, nameArt)) {
      order = [[sortBy, sortOrder === "desc" ? "DESC" : "ASC"]];
      wherec.titre = nameArt;
    }
    try {
      Model.commandeEnDetail
        .findAll({
          attributes: ["id", "total_ttc", "etatVender", "createdAt"],
          include: [
            { model: Model.user, attributes: ["fullname", "avatar"] },
            {
              model: Model.produitlabrairie,
              where: wherec,
            },
            { model: Model.labrairie },
          ],
          order: [["createdAt", "ASC"]],
          limit: +pageSize,
          offset: offset,
        })
        .then((response) => {
          if (response.length != 0) {
            return res.status(200).json({
              success: true,
              commandes: response,
            });
          } else {
            return res.status(400).json({
              success: false,
              err: "zero commande trouve ",
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

  findCommabyartandid: async (req, res) => {
    const { nameArt, page, pageSize, cmdId, sortBy, sortOrder } = req.query;
    const offset = (page - 1) * pageSize;
    const wherec = {};
    const wherep = {};

    if (sortBy && sortOrder) {
      order = [[sortBy, sortOrder === "desc" ? "DESC" : "ASC"]];
    }

    if (nameArt) {
      wherep.titre = nameArt;
    }

    if (cmdId) {
      wherec.id = cmdId;
    }
    try {
      Model.commandeEnDetail
        .findAll({
          where: wherec,
          //order: order,
          offset: offset,

          limit: +pageSize,
          attributes: ["id", "total_ttc", "etatVender", "createdAt"],
          include: [
            { model: Model.user, attributes: ["fullname", "avatar"] },
            {
              model: Model.produitlabrairie,
              attributes: [],
              where: wherep,
            },
            { model: Model.labrairie },
          ],
        })
        .then((response) => {
          if (response.length != 0) {
            return res.status(200).json({
              success: true,
              commandes: response,
            });
          } else {
            return res.status(400).json({
              success: false,
              err: "zero commande trouve ",
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
function roleIsPartenaire(role) {
  if (role === "partenaire") {
    return [
      {
        model: Model.partenaire,
        //attributes: ["id"],
        include: [{ model: Model.adresses }],
      },
    ];
  } else {
    return [
      {
        model: Model.client,
        //attributes: ["id"],
        include: [{ model: Model.adresses }],
      },
    ];
  }
}

module.exports = commandeDetailController;
