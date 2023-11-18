const { response } = require("express");
const Model = require("../Models/index");
const { catalogeValidation } = require("../middleware/auth/validationSchema");
const { Sequelize } = require("sequelize");
const cloudinary = require("../middleware/cloudinary");

const CatalogeController = {
  add: async (req, res) => {
    try {
      const {
        titre,
        description,
        prix,
        etat,
        admincatalogefk,
        categoriecatalogefk,
        souscatalogefk,
      } = req.body;

      req.files.forEach(async (file) => {
        const result = await cloudinary.uploader.upload(file.path);
        const imageUrl = result.secure_url;
      });

      const data = {
        titre: titre,
        description: description,
        prix: prix,
        etat: etat,
        admincatalogefk: admincatalogefk,
        categoriecatalogefk: categoriecatalogefk,
        souscatalogefk: souscatalogefk,
      };
      const images = [];
      const catalogues = await Model.cataloge.create(data);
      if (catalogues != null) {
        req.files.forEach(async (file) => {
          const result = await cloudinary.uploader.upload(file.path);
          const imageUrl = result.secure_url;

          await Model.imageCataloge
            .create({
              name_Image: imageUrl,
              imagecatalogefk: catalogues.id,
            })
            .then((response) => {
              if (response !== null) {
                return res.status(200).json({
                  success: true,
                  message: "Catlogue creer avec succes",
                });
              } else {
                return res.status(400).json({
                  success: false,
                  error: "error",
                });
              }
            });
        });
      } else {
        return res.status(400).json({
          success: false,
          error: "erreur de creation de catalogue",
        });
      }
    } catch (err) {
      return res.status(400).json({
        success: false,
        error: err,
      });
    }
  },

  findAll: async (req, res) => {
    const { page, pageSize, sortBy, sortOrder } = req.query;
    const offset = (page - 1) * pageSize;
    const filters = req.query;
    let whereClause = {};

    if (sortBy && sortOrder) {
      order = [[sortBy, sortOrder === "desc" ? "DESC" : "ASC"]];
    }

    if (filters.category) {
      whereClause.categoriecatalogefk = filters.category;
    }

    if (filters.subcategory) {
      whereClause.souscatalogefk = filters.subcategory;
    }

    if (filters.titre) {
      whereClause.titre = {
        [Sequelize.Op.like]: `%${filters.titre}%`,
      };
    }

    const totalCount = await Model.cataloge.count({
      where: whereClause,
    });

    try {
      const catalogue = await Model.cataloge.findAll({
        order: order,
        limit: +pageSize,
        offset: offset,
        where: whereClause,
        attributes: {
          exclude: ["updatedAt", "admincatalogefk", "categoriecatalogefk"],
        },
        include: [
          { model: Model.imageCataloge, attributes: ["id", "name_Image"] },
          { model: Model.categorie },
        ],
      });

      if (catalogue.length > 0) {
        const totalPages = Math.ceil(totalCount / pageSize);
        return res.status(200).json({
          success: true,
          catalogue: catalogue,
          totalPages: totalPages,
        });
      } else {
        return res.status(400).json({
          success: false,
          err: "il n y 'a pas des catalogues",
        });
      }
    } catch (err) {
      return res.status(400).json({
        success: false,
        error: err,
      });
    }
  },
  findOne: async (req, res) => {
    try {
      Model.cataloge
        .findOne({
          where: { id: req.params.id },
          include: [
            { model: Model.imageCataloge, attributes: ["id", "name_Image"] },
            { model: Model.categorie, attributes: ["id", "name"] },
            { model: Model.Souscategorie, attributes: ["id", "name"] },
          ],
        })
        .then((response) => {
          if (response !== null) {
            return res.status(200).json({
              success: true,
              produits: response,
            });
          } else {
            return res.status(200).json({
              success: false,
              produits: [],
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
    try {
      Model.cataloge
        .destroy({
          where: {
            id: req.params.id,
          },
        })
        .then((response) => {
          if (response != 0) {
            return res.status(200).json({
              success: true,
              message: " cataloge deleted",
            });
          } else {
            return res.status(400).json({
              success: false,
              message: "delete failed",
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
  changeVisibilite: async (req, res) => {
    try {
      Model.cataloge
        .update({ etat: req.body.etat }, { where: { id: req.params.id } })
        .then((response) => {
          if (response !== 0) {
            return res.status(200).json({
              success: true,
              message: "  change etat cataloge tDone",
            });
          } else {
            return res.status(200).json({
              success: false,
              message: "error to change etat ",
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
      const { titre, description, etat, categoriecatalogefk, souscatalogefk } =
        req.body;
      const data = {
        titre: titre,
        description: description,
        categoriecatalogefk: categoriecatalogefk,
        souscatalogefk: souscatalogefk,
        etat: etat,
      };
      Model.cataloge
        .update(data, { where: { id: req.params.id } })
        .then((response) => {
          if (response !== 0) {
            if (req.files.length !== 0) {
              req.body["image"] = req.files[0].filename;
              Model.imageCataloge
                .update(
                  { name_Image: req.body.image },
                  { where: { catalogeId: req.params.id } }
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
                })
                .catch((err) => {
                  return res.status(400).json({
                    success: false,
                    error: err,
                  });
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
};

module.exports = CatalogeController;
