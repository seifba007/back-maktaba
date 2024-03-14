const Model = require("../Models/index");
const { Sequelize } = require("sequelize");
const cloudinary = require("../middleware/cloudinary");

const updateProductNewState = async () => {
  try {
    const products = await Model.produitfournisseur.findAll({
      where: {
        etat: "Nouveau",
      },
    });

    for (const product of products) {
      product.etat = "ancien";
      await product.save();
    }
  } catch (err) {
    console.error(
      "Erreur lors de la mise à jour de l'état des produits :",
      err
    );
  }
};

const updateProductTopState = async () => {
  try {
    Model.ProduitCommandeEnGros.findAll({
      attributes: [
        "prodlaibrcommgrosfk",
        [Sequelize.fn("COUNT", "prodlaibrcommgrosfk"), "count"],
      ],
      group: ["prodlaibrcommgrosfk"],
      order: [[Sequelize.literal("count"), "DESC"]],
      limit: 3,
    })
      .then((topProducts) => {
        Model.produitfournisseur.update(
          { etat: "ancien" },
          { where: { etat: "plus ventes" } }
        );
        topProducts.forEach((product) => {
          Model.produitfournisseur
            .update(
              { etat: "plus ventes" },
              { where: { id: product.prodlaibrcommgrosfk } }
            )
            .then(() => {
              console.log(
                `Produit ID: ${product.prodlaibrcommgrosfk} mis à jour avec succès.`
              );
            })
            .catch((err) => {
              console.error(
                `Erreur lors de la mise à jour du produit ID ${product.prodlaibrcommgrosfk} :`,
                err
              );
            });
        });
      })
      .catch((err) => {
        console.error("Erreur lors de la récupération des produits :", err);
      });
  } catch (err) {
    console.error(
      "Erreur lors de la mise à jour de l'état des produits :",
      err
    );
  }
};
const updateNewInterval = 24 * 60 * 60 * 1000;
const updateTopInterval = 72 * 60 * 60 * 1000;
setInterval(updateProductNewState, updateNewInterval);
setInterval(updateProductTopState, updateTopInterval);
const produitfournisseurController = {
  add_produit: async (req, res) => {
    try {
      const produits = [];

      const produitsarr = req.body.products;

      for (const productData of produitsarr) {
        const produit = await Model.produitfournisseur.create({
          titre: productData.titre,
          description: productData.description,
          etat: "Nouveau",
          Visibilite: "Visible",
          codebar: productData.codebar,
          fourprodfk: productData.fourprodfk,
          categprodfoufk: productData.categprodfoufk,
          souscatprodfourfk: productData.souscatprodfourfk,
        });

        const image = await Model.imageProduitFournsseur.create({
          name_Image: productData.image,
          imageprodfourfk: produit.id,
        });

        produits.push({
          produit: produit,
          image: image,
        });
      }

      res
        .status(201)
        .json({ message: "Products created successfully", produits });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error creating products" });
    }
  },

  update: async (req, res) => {
    try {
      const { qte, prix, prix_en_Solde, remise } = req.body;
      if (prix_en_Solde !== undefined) {
        var etat = "remise";
      }
      if (remise == 0 || remise === undefined) {
        var etat = "Nouveau";
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
      Model.produitfournisseur
        .update(produitData, { where: { id: req.params.id } })
        .then((response) => {
          if (response !== 0) {
            const uploadPromises = [];

            req.files.forEach((file) => {
              const uploadPromise = cloudinary.uploader
                .upload(file.path)
                .then((result) => {
                  const imageUrl = result.secure_url;

                  return Model.imageProduitFournsseur.create({
                    name_Image: imageUrl,
                    imageprodfourfk: req.params.id,
                  });
                });

              uploadPromises.push(uploadPromise);
            });

            Promise.all(uploadPromises);

            return res.status(200).json({
              success: true,
              message: "produit updated successfully",
            });
          } else {
            return res.status(400).json({
              success: false,
              error: err.message,
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
  delete: async (req, res) => {
    const { ids } = req.body;
    try {
      Model.produitfournisseur
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
      Model.produitfournisseur
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
              model: Model.imageProduitFournsseur,
              attributes: ["name_Image"],
            },
            {
              model: Model.fournisseur,
              
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

  findAllProduitByfournisseur: async (req, res) => {
    const { page, pageSize, sortBy, sortOrder } = req.query;
    const offset = (page - 1) * pageSize;
    const filters = req.query;
    let whereClause = {};

    whereClause = {
      fourprodfk: req.params.id,
      //qte: {
      // [Sequelize.Op.gt]: 0,
      //},
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
      const totalCount = await Model.produitfournisseur.count({
        where: whereClause,
      });

      const products = await Model.produitfournisseur.findAll({
        order: order,
        limit: +pageSize,
        offset: offset,
        where: whereClause,
        include: [
          {
            model: Model.fournisseur,
            attributes: ["id", "avatar", "nameetablissement"],
          },
          {
            model: Model.categorie,
            attributes: ["id", "name", "Description", "image"],
          },
          {
            model: Model.imageProduitFournsseur,
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
          err: "Aucun produit trouv� pour cette fournisseur.",
        });
      }
    } catch (err) {
      return res.status(400).json({
        success: false,
        error: err.message,
      });
    }
  },

  findoneproduit: async (req, res) => {
    try {
      const { id } = req.params;
      Model.produitfournisseur
        .findOne({
          where: {
            id: id,
            qte: {
              [Sequelize.Op.gt]: 0,
            },
          },
          attributes: {
            exclude: ["createdAt", "updatedAt", "fourprodfk"],
          },
          include: [
            {
              model: Model.fournisseur,
              attributes: ["id", "avatar", "nameetablissement"],
            },
            {
              model: Model.categorie,
              attributes: ["id", "name", "Description", "image"],
            },
            {
              model: Model.imageProduitFournsseur,
              attributes: ["name_Image"],
              separate: true,
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
      Model.produitfournisseur
        .findAll({
          order: order,
          limit: +pageSize,
          offset: offset,
          where: {
            categprodfoufk: req.params.categprodfoufk,
            qte: {
              [Sequelize.Op.gt]: 0,
            },
          },
          attributes: {
            exclude: ["categprodfoufk", "description"],
          },
          include: [
            {
              model: Model.fournisseur,
              attributes: ["id", "avatar", "nameetablissement"],
            },
            {
              model: Model.imageProduitFournsseur,
              where: {
                name_image: {
                  [Sequelize.Op.ne]:
                    "https://res.cloudinary.com/doytw80zj/image/upload/v1693689652/27002_omkvdd.jpg",
                },
              },
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
      Model.produitfournisseur
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
              model: Model.imageProduitFournsseur,
              attributes: ["name_Image"],
            },
          ],
          where: {
            fourprodfk: req.params.id,
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
      Model.produitfournisseur
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
              model: Model.imageProduitFournsseur,
              attributes: ["name_Image"],
            },
          ],
          where: {
            fourprodfk: req.params.id,
            qte: {
              [Sequelize.Op.gt]: 0,
            },
          },
          group: ["produitfournisseur.id", "produitfournisseur.titre"],
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
    if(namearticle){
      wherec.titre = namearticle;
    }

    try {
      Model.produitfournisseur
        .findAll({
          order: order,
          limit: +pageSize,
          offset: offset,
          where: wherec,
          include: [
            {
              model: Model.imageProduitFournsseur,
              attributes: ["name_Image"],
            },
            {
              model: Model.fournisseur,
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
module.exports = produitfournisseurController;
