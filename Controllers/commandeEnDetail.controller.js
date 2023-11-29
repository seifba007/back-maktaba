const { response } = require("express");
const Model = require("../Models/index");
const cloudinary = require("../middleware/cloudinary");
const { Sequelize, where, Op, or } = require("sequelize");
const commandeDetailController = {
  add: async (req, res) => {
    const { commande } = req.body;
    try {
      commande.map((data) => {
        let commandes = {
          total_ttc: data.total_ttc,
          etatClient: "en cours",
          etatVender: "Nouveau",
          Adresse: data.Adresse,
          Mode_liv: data.Mode_liv,
          Mode_pay: data.Mode_pay,
          usercommdetfk: data.usercommdetfk,
          labrcomdetfk: data.labrcomdetfk,
        };
        Model.commandeEnDetail.create(commandes).then((response) => {
          if (response !== null) {
            data.produits.map((e) => {
              e.comdetprodlabrfk = response.id;
            });
            Model.ProduitCommandeEnDetail.bulkCreate(data.produits).then(
              (response) => {
                data.produits.map((e) => {
                  Model.produitlabrairie
                    .findByPk(e.prodlaibrcommdetfk)
                    .then((produit) => {
                      if (produit !== null) {
                        const updatedQte = produit.qte - e.Qte;
                        if (updatedQte < 0) {
                          updatedQte = 0;
                        }
                        return Model.produitlabrairie.update(
                          { qte: updatedQte },
                          { where: { id: e.prodlaibrcommdetfk } }
                        );
                      }
                    });
                });
              }
            );
          } else {
            return res.status(400).json({
              success: false,
              message: " error lorsque l'ajoute de commande",
            });
          }
        });
      });
      return res.status(200).json({
        success: true,
        message: " add commande en  detail  Done !!",
      });
    } catch (err) {
      return res.status(400).json({
        success: false,
        error: err,
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
        usercommdespectfk,
        labrcomdespectfk,
      } = req.body;
      let imageUrl = "";

      req.files.forEach(async (file) => {
        const result = await cloudinary.uploader.upload(file.path);
        imageUrl = result.secure_url;
        console.log(imageUrl);
        const commande = await Model.commandeSpecial.create({
          etatClient: etatClient,
          Adresse: Adresse,
          Description: Description,
          email: email,
          telephone: telephone,
          Nom: Nom,
          Fichier: imageUrl,
          usercommdespectfk: usercommdespectfk,
          labrcomdespectfk: labrcomdespectfk,
        });
        res.status(200).json(commande);
      });
    } catch (error) {
      console.error(error);
      res
        .status(400)
        .json({ error: "Erreur lors de la création de la commande" });
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
    const { sortBy, sortOrder, page, pageSize } = req.query;
    const offset = (page - 1) * pageSize;
    const order = [[sortBy, sortOrder === "desc" ? "DESC" : "ASC"]];

    try {
      const totalCount = await Model.commandeSpecial.count({
        where: { usercommdespectfk: req.params.id },
      });

      Model.commandeSpecial
        .findAll({
          offset: offset,
          order: order,
          limit: +pageSize,
          where: { usercommdespectfk: req.params.id },
          include: [
            {
              model: Model.labrairie,
              attributes: ["id", "nameLibrairie", "imageStore"],
            },
          ],
        })
        .then((response) => {
          if (response !== null) {
            const totalPages = Math.ceil(totalCount / pageSize);
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
                attributes: ["name_Image"]
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
    const { sortBy, sortOrder, page, pageSize } = req.query;

    const offset = (page - 1) * pageSize;
    const order = [[sortBy, sortOrder === "desc" ? "DESC" : "ASC"]];
    try {
      Model.commandeSpecial
        .findAll({
          offset: offset,
          order: order,
          limit: +pageSize,
          where: { labrcomdespectfk: req.params.id },
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

          order: order,
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
                  //include: roleIsPartenaire(response[0].user.role),
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
