const { response } = require("express");
const Model = require("../Models/index");
const { Sequelize, where } = require("sequelize");
const cloudinary = require("../middleware/cloudinary");

const CatalogeFournisseurController = {
  add: async (req, res) => {
    try {
      const {
        titre,
        description,
        prix,
        etat,
        codebar,
        admincatalogefourfk,
        categoriecatalogefourfk,
        souscatalogefourfk,
      } = req.body;

      const data = {
        titre: titre,
        description: description,
        prix: prix,
        etat: etat,
        codebar: codebar,
        admincatalogefourfk: admincatalogefourfk,
        categoriecatalogefourfk: categoriecatalogefourfk,
        souscatalogefourfk: souscatalogefourfk,
      };

      const catalog = await Model.catalogefournisseur.create(data);

      if (catalog != null) {
        const uploadPromises = [];

        req.files.forEach((file) => {
          const uploadPromise = cloudinary.uploader
            .upload(file.path)
            .then((result) => {
              const imageUrl = result.secure_url;

              return Model.imageCatalogeFournisseur.create({
                name_Image: imageUrl,
                imagecatalogefourfk: catalog.id,
              });
            });

          uploadPromises.push(uploadPromise);
        });

        await Promise.all(uploadPromises);

        return res.status(200).json({
          success: true,
          message: "Catalog fournisseur created successfully",
          catalog:catalog
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
      whereClause.categoriecatalogefourfk = filters.category;
    }

    if (filters.subcategory) {
      whereClause.souscatalogefourfk = filters.subcategory;
    }

    if (filters.titre) {
      whereClause[Sequelize.Op.or] = [
        {
          titre: {
            [Sequelize.Op.like]: `%${filters.titre}%`,
          },
        },
        {
          codebar: {
            [Sequelize.Op.like]: `%${filters.titre}%`,
          },
        },
      ];
    }

    if (filters.codebar) {
      whereClause.codebar = {
        [Sequelize.Op.like]: `%${filters.codebar}%`,
      };
    }

    const totalCount = await Model.catalogefournisseur.count({
      where: whereClause,
    });

    try {
      const catalogue = await Model.catalogefournisseur.findAll({
        order: order,
        limit: +pageSize,
        offset: offset,
        where: whereClause,
        attributes: {
          exclude: ["updatedAt", "admincatalogefourfk", "categoriecatalogefourfk"],
        },
        include: [
          { model: Model.imageCatalogeFournisseur, attributes: ["id", "name_Image"] },
          { model: Model.categorie },
          { model: Model.Souscategorie },
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
      Model.catalogefournisseur
        .findOne({
          where: { id: req.params.id },
          include: [
            { model: Model.imageCatalogeFournisseur, attributes: ["id", "name_Image"] },
            { model: Model.categorie },
            { model: Model.Souscategorie },
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
      Model.catalogefournisseur
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
      Model.catalogefournisseur
        .update({ etat: req.body.etat }, { where: { id: req.params.id } })
        .then((response) => {
          if (response !== 0) {
            return res.status(200).json({
              success: true,
              message: "change etat cataloge tDone",
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
        codebar,
        admincatalogefourfk,
        categoriecatalogefourfk,
        souscatalogefourfk,
      } = req.body;

      const data = {
        titre: titre,
        description: description,
        prix: prix,
        etat: etat,
        codebar:codebar,
        admincatalogefourfk: admincatalogefourfk,
        categoriecatalogefourfk: categoriecatalogefourfk,
        souscatalogefourfk: souscatalogefourfk,
      };

      const updatedCatalog = await Model.catalogefournisseur.update(data, {
        where: { id: catalogId },
      });

      if (req.files.length > 0) {
        Model.imageCatalogeFournisseur.destroy({
          where: {
            imagecatalogefourfk: catalogId,
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

              return Model.imageCatalogeFournisseur.create({
                name_Image: imageUrl,
                imagecatalogefourfk: catalogId,
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
        error: err.message,
      });
    }
  },

  findAllCatalogue: async (req, res) => {
    const { page, pageSize, sortBy, sortOrder } = req.query;
    const offset = (page - 1) * pageSize;
    const filters = req.query;
    let whereClause = {etat: "Visible"};

    if (sortBy && sortOrder) {
      order = [[sortBy, sortOrder === "desc" ? "DESC" : "ASC"]];
    }

    if (filters.category) {
      whereClause.categoriecatalogefourfk = filters.category;
    }

    if (filters.subcategory) {
      whereClause.souscatalogefourfk = filters.subcategory;
    }

    if (filters.titre) {
      whereClause[Sequelize.Op.or] = [
        {
          titre: {
            [Sequelize.Op.like]: `%${filters.titre}%`,
          },
        },
        {
          codebar: {
            [Sequelize.Op.like]: `%${filters.titre}%`,
          },
        },
      ];
    }

    if (filters.codebar) {
      whereClause.codebar = {
        [Sequelize.Op.like]: `%${filters.codebar}%`,
      };
    }

    const totalCount = await Model.catalogefournisseur.count({
      where: whereClause,
    });

    try {
      const catalogue = await Model.catalogefournisseur.findAll({
        order: order,
        limit: +pageSize,
        offset: offset,
        where: whereClause,
        attributes: {
          exclude: ["updatedAt", "admincatalogefourfk", "categoriecatalogefourfk"],
        },
        include: [
          { model: Model.imageCatalogeFournisseur, attributes: ["id", "name_Image"] },
          { model: Model.categorie },
          { model: Model.Souscategorie },
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
};

module.exports = CatalogeFournisseurController;
