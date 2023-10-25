const Model = require("../Models/index");
const { Sequelize } = require("sequelize");
const cloudinary = require("../middleware/cloudinary");

const {
  produitlibrairieValidation,
} = require("../middleware/auth/validationSchema");
const updateProductNewState = async () => {
  try {
    const products = await Model.produitlabrairie.findAll({
      where: {
        etat: 'Nouveau',
      }
    });

    for (const product of products) {
      product.etat = 'ancien';
      await product.save();
    }
  } catch (err) {
    console.error('Erreur lors de la mise à jour de l\'état des produits :', err);
  }
};
const updateProductTopState = async () => {
  try {
    Model.ProduitCommandeEnDetail.findAll({
      attributes: ['prodlaibrcommdetfk', [Sequelize.fn('COUNT', 'prodlaibrcommdetfk'), 'count']],
      group: ['prodlaibrcommdetfk'],
      order: [[Sequelize.literal('count'), 'DESC']],
      limit: 3
    }).then(topProducts => {
      Model.produitlabrairie.update({ etat: 'ancien' }, { where: { etat: 'plus ventes' } })
      topProducts.forEach(product => {
        Model.produitlabrairie.update({ etat: 'plus ventes' }, { where: { id: product.prodlaibrcommdetfk } })
          .then(() => {
            console.log(`Produit ID: ${product.prodlaibrcommdetfk} mis à jour avec succès.`);
          })
          .catch(err => {
            console.error(`Erreur lors de la mise à jour du produit ID ${product.prodlaibrcommdetfk} :`, err);
          });
      });
    }).catch(err => {
      console.error('Erreur lors de la récupération des produits :', err);
    });
    //console.log('État des produits mis à jour.');
  } catch (err) {
    console.error('Erreur lors de la mise à jour de l\'état des produits :', err);
  }
};
const updateNewInterval = 24 * 60 * 60 * 1000; 
const updateTopInterval =  72 * 60 * 60 * 1000;
setInterval(updateProductNewState, updateNewInterval);
setInterval(updateProductTopState, updateTopInterval);
const produitController = {
  
  add_produit: async (req, res) => {

    try {
      const produit = await Model.produitlabrairie.create({
        titre: req.body.titre,
        description: req.body.description,
        qte: req.body.qte,
        prix: req.body.prix,
        etat: "Nouveau",
        labrprodfk: req.body.labrprodfk,
        categprodlabfk: req.body.categprodlabfk,
        souscatprodfk: req.body.souscatprodfk,
      });
      
      req.files.forEach(async (file) => {
       
        const result = await cloudinary.uploader.upload(file.path); 
        const imageUrl = result.secure_url;

        await Model.imageProduitLibrairie.create({
          name_Image: imageUrl,
          imageprodfk: produit.id,
        });
      });

      res.status(201).json({ message: "Produit créé avec succès" });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "Erreur lors de la création du produit" });
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
                  { where: { produitlabrprodfk: req.params.id } }
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
          where: {
            qte: {
              [Sequelize.Op.gt]: 0, 
            },
          },
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
    const filters = req.query;
    let whereClause = {};

    whereClause = {
      labrprodfk: req.params.id,
      qte: {
        [Sequelize.Op.gt]: 0, 
      },
    };
    if (filters.titre) {
      whereClause.titre = {
        [Sequelize.Op.like]: `%${filters.titre}%`,
      };
    }

    if (sortBy && sortOrder) {
      order = [[sortBy, sortOrder === "desc" ? "DESC" : "ASC"]];
    }

    try {
      const totalCount = await Model.produitlabrairie.count({
        where: whereClause
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
            model: Model.categorie,
            attributes: ["id","name", "Description","image"],
          },
          {
            model: Model.imageProduitLibrairie,
          },
          {
            model: Model.avisProduitlibraire,
          },
        ],
        group: ["produitlabrairie.id"],
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
          err: "Aucun produit trouv� pour cette labrairie.",
        });
      }
    } catch (err) {
      return res.status(400).json({
        success: false,
        error: err.message,
      });
    }
  },

  findOneProduit: async (req, res) => {
    try {
      const { id } = req.params;
      Model.produitlabrairie
        .findOne({
          where: { 
            id: id,
            qte: {
              [Sequelize.Op.gt]: 0, 
            },
          },
          attributes: {
            exclude: ["createdAt", "updatedAt", "labrprodfk"],
          },
          include: [
            {
              model: Model.labrairie,
              attributes: ["id", "nameLibrairie", "imageStore"],
            },
            {
              model: Model.categorie,
              attributes: ["id", "name", "Description","image"],
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
              err: " produit ne exist pas ",
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
          where: { 
            categprodlabfk: req.params.categprodlabfk ,
            qte: {
              [Sequelize.Op.gt]: 0, 
            },
          },
          attributes: {
            exclude: ["categprodlabfk", "description"],
          },
          include: [
            {
              model: Model.labrairie,
              attributes: ["imageStore", "nameLibrairie"],
            },
            {
              model: Model.imageProduitLibrairie,
              where:{
                name_image :{
                  [Sequelize.Op.ne]: "https://res.cloudinary.com/doytw80zj/image/upload/v1693689652/27002_omkvdd.jpg"
                }
              }
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
            labrprodfk: req.params.id,
            qte: {
              [Sequelize.Op.gt]: 0, 
            },
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
              model: Model.imageProduitLibrairie,
              attributes: ["name_Image"],
            },
          ],
          where: {
            labrprodfk: req.params.id,
            qte: {
              [Sequelize.Op.gt]: 0, 
            },
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
    const wherec = {
      qte: {
        [Sequelize.Op.gt]: 0, 
      },
    };
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
