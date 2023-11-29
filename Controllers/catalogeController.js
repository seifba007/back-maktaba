const { response } = require("express");
const Model = require("../Models/index");
const { catalogeValidation } = require("../middleware/auth/validationSchema");
const { Sequelize, where } = require("sequelize");
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

      const data = {
        titre: titre,
        description: description,
        prix: prix,
        etat: etat,
        admincatalogefk: admincatalogefk,
        categoriecatalogefk: categoriecatalogefk,
        souscatalogefk: souscatalogefk,
      };

      const catalog = await Model.cataloge.create(data);

      if (catalog != null) {
        const uploadPromises = [];

        req.files.forEach((file) => {
          const uploadPromise = cloudinary.uploader
            .upload(file.path)
            .then((result) => {
              const imageUrl = result.secure_url;

              return Model.imageCataloge.create({
                name_Image: imageUrl,
                imagecatalogefk: catalog.id,
              });
            });

          uploadPromises.push(uploadPromise);
        });

        await Promise.all(uploadPromises);

        return res.status(200).json({
          success: true,
          message: "Catalog created successfully",
        });
      } else {
        return res.status(400).json({
          success: false,
          error: "Error creating catalog",
        });
      }
    } catch (err) {
      return res.status(400).json({
        success: false,
        error: err.message,
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
      const catalogId = req.params.id;
      const {
        titre,
        description,
        prix,
        etat,
        admincatalogefk,
        categoriecatalogefk,
        souscatalogefk,
      } = req.body;

      const data = {
        titre: titre,
        description: description,
        prix: prix,
        etat: etat,
        admincatalogefk: admincatalogefk,
        categoriecatalogefk: categoriecatalogefk,
        souscatalogefk: souscatalogefk,
      };

      const updatedCatalog = await Model.cataloge.update(data, {
        where: { id: catalogId },
      });

      if (req.files.length > 0) {
        Model.imageCataloge.destroy({
          where: {
            imagecatalogefk: catalogId,
          },
        });
      }

      if (updatedCatalog != null) {
        const uploadPromises = [];

        req.files.forEach((file) => {
          const uploadPromise = cloudinary.uploader
            .upload(file.path)
            .then((result) => {
              const imageUrl = result.secure_url;

              return Model.imageCataloge.create({
                name_Image: imageUrl,
                imagecatalogefk: catalogId,
              });
            });

          uploadPromises.push(uploadPromise);
        });

        await Promise.all(uploadPromises);

        return res.status(200).json({
          success: true,
          message: "Catalog updated successfully",
        });
      } else {
        return res.status(400).json({
          success: false,
          error: err.message,
        });
      }
    } catch (err) {
      return res.status(400).json({
        success: false,
        error: err.message || "Unexpected error",
      });
    }
  },
};

module.exports = CatalogeController;
