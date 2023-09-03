const Model = require("../Models/index");
const { Sequelize } = require("sequelize");
const {
  produitlibrairieValidation,
} = require("../middleware/auth/validationSchema");
const produitController = {
  add_produit_with_import_image: async (req, res) => {
    const {
      titre,
      description,
      image,
      qte,
      prix,
      labrairieId,
      categorieId,
      SouscategorieId,
    } = req.body;

    try {
      const { error } = produitlibrairieValidation(req.body);
      if (error)
        return res
          .status(400)
          .json({ success: false, err: error.details[0].message });
      req.body["image"] = req.files;

      const produitData = {
        titre: titre,
        description: description,
        prix: prix,
        qte: qte,
        categorieId: categorieId,
        labrairieId: labrairieId,
        SouscategorieId: SouscategorieId,
      };
      const images = [];
      Model.produitlabrairie.create(produitData).then((response) => {
        if (response !== null) {
          image.map((e) => {
            images.push({
              name_Image: e.filename,
              produitlabrairieId: response.id,
            });
          });
          Model.imageProduitLibrairie.bulkCreate(images).then((response) => {
            if (response !== null) {
              return res.status(200).json({
                success: true,
                message: "add produit librairie Done !! ",
              });
            } else {
              return res.status(400).json({
                success: false,
                error: err,
              });
            }
          });
        } else {
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
  add: async (req, res) => {
    try {
      const { titre, description, image, prix, labrairieId, categorieId,SouscategorieId,qte } =
        req.body;
      const produitData = {
        titre: titre,
        description: description,
        prix: prix,
        qte: qte,
        categorieId: categorieId,
        labrairieId: labrairieId,
        SouscategorieId:SouscategorieId
      };
      const images = [];
      Model.produitlabrairie.create(produitData).then((response) => {
        if (response !== null) {
          image.map((e) => {
            images.push({
              name_Image:e.name_Image,
              produitlabrairieId: response.id,
            });
          });
          Model.imageProduitLibrairie.bulkCreate(images).then((response) => {
            if (response !== null) {
              return res.status(200).json({
                success: true,
                message: "add produit librairie Done !! ",
              });
            } else {
              return res.status(400).json({
                success: false,
                error: err,
              });
            }
          });
        } else {
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
  update: async (req, res) => {
    try {
      const { qte, prix, prix_en_Solde, remise } = req.body;
      if (prix_en_Solde !== undefined) {
        var etat = "remise";
      }
      if (remise == 0 || remise === undefined) {
        var etat = "en_Stock";
        var prix_solde = 0;
      } else {
        var prix_solde = prix_en_Solde;
      }
      const produitData = {
        prix: prix,
        etat: etat,
        qte: qte,
        prix_en_Solde: prix_solde,
        remise: remise,
      };
      Model.produitlabrairie
        .update(produitData, { where: { id: req.params.id } })
        .then((response) => {
          if (response !== 0) {
            if (req.files.length !== 0) {
              req.body["image"] = req.files[0].filename;
              Model.imageProduitLibrairie
                .update(
                  { name_Image: req.body.image },
                  { where: { produitlabrairieId: req.params.id } }
                )
                .then((response) => {
                  if (response !== 0) {
                    return res.status(200).json({
                      success: true,
                      message: " update done ! ",
                    });
                  } else {
                    return res.status(400).json({
                      success: false,
                      error: "error update ",
                    });
                  }
                });
            } else {
              return res.status(200).json({
                success: true,
                message: "update done",
              });
            }
          }
        });
    } catch (err) {
      return res.status(400).json({
        success: false,
        error: err,
      });
    }
  },
  delete: async (req, res) => {
    const { ids } = req.body;
    try {
      Model.produitlabrairie
        .destroy({
          where: {
            id: ids,
          },
        })
        .then((reponse) => {
          if (reponse !== 0) {
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


  findAll: async (req, res) => {
    const { sortBy, sortOrder, page, pageSize } = req.query;

    const offset = (page - 1) * pageSize;

    if ((sortBy, sortOrder)) {
      order = [[sortBy, sortOrder === "desc" ? "DESC" : "ASC"]];
    }
    try {
      Model.produitlabrairie
        .findAll({
          limit: +pageSize,
          offset: offset,
          order: order,
          include: [
            {
              model: Model.labrairie,
              attributes: ["id", "imageStore", "nameLibrairie"],
            },
            {
              model: Model.imageProduitLibrairie,
              attributes: ["name_Image"],
              separate: true,
            },
            {
              model: Model.avisProduitlibraire,
             
            },
            { model: Model.categorie, attributes: ["id", "name"] },
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
              err: " zero produit",
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

  findAllProduitByLabrairie: async (req, res) => {
    const { page, pageSize, sortBy, sortOrder } = req.query;
    const offset = (page - 1) * pageSize;

    if ((sortBy, sortOrder)) {
      order = [[sortBy, sortOrder === "desc" ? "DESC" : "ASC"]];
    }

    try {
      Model.produitlabrairie
        .findAll({
          order: order,
          limit: +pageSize,
          offset: offset,
          where: { labrairieId: req.params.id },
          
          include: [
            {
              model: Model.labrairie,
              attributes: ["imageStore", "nameLibrairie"],
            },
            {
              model: Model.imageProduitLibrairie,
              attributes: ["name_Image"],
              separate: true,
            },
            {
              model: Model.avisProduitlibraire,
              
            },
          ],

          group: ["produitlabrairie.id"],
        })
        .then((response) => {
          if (response.length !== 0) {
            res.status(200).json({
              success: true,
              produit: response,
            });
          } else {
            res.status(400).json({
              success: false,
              err: " labrairieId have zero produit",
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


  findOneProduit: async (req, res) => {
    try {
      const { id } = req.params;
      Model.produitlabrairie
        .findOne({
          where: { id: id },
          attributes: {
            exclude: ["createdAt", "updatedAt", "labrairieId"],
          },
          include: [
            {
              model: Model.labrairie,
              attributes: ["id", "nameLibrairie", "imageStore"],
            },
            {
              model: Model.imageProduitLibrairie,
              attributes: ["name_Image"],
              separate: true,
            },
            {
              model: Model.avisProduitlibraire,
              attributes: [
                [Sequelize.fn("max", Sequelize.col("nbStart")), "max_nb"],
                [Sequelize.fn("SUM", Sequelize.col("nbStart")), "total_avis"],
              ],
            },
          ],
          group: ["produitlabrairie.id"],
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
              err: " error produit ne exist pas ",
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


  findProduitsBycategorie: async (req, res) => {
    const { page, pageSize, sortBy, sortOrder } = req.query;
    const offset = (page - 1) * pageSize;

    if ((sortBy, sortOrder)) {
      order = [[sortBy, sortOrder === "desc" ? "DESC" : "ASC"]];
    }
    try {
      Model.produitlabrairie
        .findAll({
          order: order,
          limit: +pageSize,
          offset: offset,
          where: { categorieId: req.params.categorieId },
          attributes: {
            exclude: ["categorieId", "description"],
          },
          include: [
            {
              model: Model.labrairie,
              attributes: ["imageStore", "nameLibrairie"],
            },
            {
              model: Model.imageProduitLibrairie,
              attributes: ["name_Image"],
              separate: true,
            },
            {
              model: Model.avisProduitlibraire,
             
            },
          ],
          order: order,
        })
        .then((response) => {
          if (response.length != 0) {
            return res.status(200).json({
              success: true,
              produit: response,
            });
          } else {
            return res.status(400).json({
              success: false,
              message: "zero produit  in this categorie",
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


  produit_mieux_notes: async (req, res) => {
    const { page, pageSize, sortBy, sortOrder } = req.query;
    const offset = (page - 1) * pageSize;

    if ((sortBy, sortOrder)) {
      order = [[sortBy, sortOrder === "desc" ? "DESC" : "ASC"]];
    }

    try {
      Model.produitlabrairie
        .findAll({
          order: order,
          limit: +pageSize,
          offset: offset,
          attributes: ["id", "titre"],
          include: [
            {
              model: Model.avisProduitlibraire,
            },
            {
              model: Model.imageProduitLibrairie,
              attributes: ["name_Image"],
            },
          ],
          where: {
            labrairieId: req.params.id,
          },
         
        })
        .then((response) => {
          if (response !== null) {
            return res.status(200).json({
              success: true,
              produit: response,
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
  produit_mieux: async (req, res) => {
    try {
      Model.produitlabrairie
        .findAll({
          attributes: ["id", "titre"],
          include: [
            {
              model: Model.avisProduitlibraire,
              attributes: [
                [Sequelize.fn("SUM", Sequelize.col("nbStart")), "total_stars"],
                [Sequelize.fn("Max", Sequelize.col("nbStart")), "Max_avis"],
              ],
            },
            {
              model : Model.imageProduitLibrairie  , attributes : ["name_Image"]
            }
          ],
          where: {
            labrairieId: req.params.id,
          },
          group: ["produitlabrairie.id", "produitlabrairie.titre"],
          having: Sequelize.literal("SUM(nbStart) >24"),
        })
        .then((response) => {
          if (response !== null) {
            return res.status(200).json({
              success: true,
              produit: response,
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

  produitfiltreage: async (req, res) => {
    const { sortBy, sortOrder, page, pageSize, namearticle } = req.query;
    const offset = (page - 1) * pageSize;
    const wherec = {};
    order = [[sortBy, sortOrder === "desc" ? "DESC" : "ASC"]];
    wherec.titre = namearticle;

    try {
      Model.produitlabrairie
        .findAll({
          order: order,
          limit: +pageSize,
          offset: offset,
          where: wherec,
          include: [
            {
              model: Model.imageProduitLibrairie,
              attributes: ["name_Image"],
            },
            {
              model: Model.labrairie,
              attributes: ["id","adresse","telephone","nameLibrairie","facebook","instagram","imageStore","emailLib"]
            },
          ],
        })
        .then((response) => {
          if (response !== null) {
            return res.status(200).json({
              success: true,
              produit: response,
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
};
module.exports = produitController;
