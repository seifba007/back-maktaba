const { response } = require("express");
const Model = require("../Models/index");
const avisProduitfournisseur = require("../Models/avisproduitfournisseur");
const { Sequelize } = require("sequelize");
const {
  addAvisProdValidation,
} = require("../middleware/auth/validationSchema");
const avisProduitfournisseurController = {
  add: async (req, res) => {
    const { nbStart, commenter, clientavisprodfourfk, prodfouravisfk, partavisprodfourfk } =
      req.body;
    try {
      const { error } = addAvisProdValidation({commenter:commenter,nbStart:nbStart});
            if (error)
        return res
          .status(400)
          .json({ success: false, err: error.details[0].message });
      const dataclient = {
        nbStart: nbStart,
        commenter: commenter,
        clientavisprodfourfk: clientavisprodfourfk,
        partavisprodfourfk: partavisprodfourfk,
        prodfouravisfk: prodfouravisfk,
      };
      const datapartenaire = {
        nbStart: nbStart,
        commenter: commenter,
        clientavisprodfourfk: clientavisprodfourfk,
        partavisprodfourfk: partavisprodfourfk,
        prodfouravisfk: prodfouravisfk,
      };
      if (clientavisprodfourfk) {
        Model.avisProduitfournisseur.create(dataclient).then((response) => {
          if (response) {
            return res.status(200).json({
              success: true,
              message: "avis fournisseur created",
            });
          } else {
            return res.status(200).json({
              success: false,
              message: "err create avis",
            });
          }
        });
      } else if (partavisprodfourfk) {
        Model.avisProduitfournisseur.create(datapartenaire).then((response) => {
          if (response) {
            return res.status(200).json({
              success: true,
              message: "avis created",
            });
          } else {
            return res.status(200).json({
              success: false,
              message: "err create avis",
            });
          }
        });
      }
    } catch (err) {
      return res.status(400).json({
        success: false,
        error: err,
      });
    }
  },
  update: async (req, res) => {
    const { nbStart, commenter } = req.body;

    try {
      const { error } = addAvisProdValidation(req.body);
      if (error) return res.status(400).json(error.details[0].message);
      const data = {
        nbStart: nbStart,
        commenter: commenter,
      };
      Model.avisProduitfournisseur
        .update(data, {
          where: { id: req.params.id },
        })
        .then((response) => {
          if (response !== 0) {
            return res.status(200).json({
              success: true,
              message: "update avis done",
            });
          } else {
            return res.status(400).json({
              success: false,
              message: "err to update avis",
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
      Model.avisProduitfournisseur
        .destroy({
          where: { id: req.params.id },
        })
        .then((response) => {
          if (response != 0) {
            return res.status(200).json({
              success: true,
              message: "delete avis  done !! ",
            });
          } else {
            return res.status(400).json({
              success: false,
              meesage: "err to  delete your avis",
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

  getAllAvisByClient: async (req, res) => {
    try {
      Model.avisProduitfournisseur
        .findAll({
          where: { clientavisprodfourfk: req.params.clientavisprodfourfk },
          
          include: [
            {
              model: Model.produitfournisseur,
              attributes: ["id", "titre", "prix"],
              include: [
                {
                  model: Model.imageProduitFournsseur,
                  attributes: ["name_Image"],
                },
                {
                  model: Model.fournisseur,
                  attributes: ["nameetablissement"],
                },
              ],
            },
          ],
        })
        .then((response) => {
          if (response !== null) {
            return res.status(200).json({
              success: true,
              avis: response,
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
  getAllAvisByPartnier: async (req, res) => {
    try {
      const response = await Model.avisProduitfournisseur.findAll({
        where: { partavisprodfourfk: req.params.partavisprodfourfk },
        
        include: [
          {
            model: Model.produitfournisseur,
            attributes: ["id", "titre", "prix"],
            include: [
              {
                model: Model.imageProduitFournsseur,
                attributes: ["name_Image"],
              },
              {
                model: Model.fournisseur,
                attributes: ["nameetablissement"],
              },
            ],
          },
        ],
      });

      if (response.length !== 0) {
        return res.status(200).json({
          success: true,
          avis: response,
        });
      } else {
        return res.status(400).json({
          success: false,
          error: "No Avis for this partenaire",
        });
      }
    } catch (err) {
      return res.status(400).json({
        success: false,
        error: err.message || "An error occurred",
      });
    }
  },
  getAllAvisByproduit: async (req, res) => {
    try {
      const avisOptions = {
        where: { prodfouravisfk: req.params.prodfouravisfk },
        
        include: [
          {
            model: Model.client,
            include: [
              { model: Model.user, attributes: ["fullname", "avatar"] },
            ],
          },
          {
            model: Model.partenaire,
            include: [
              { model: Model.user, attributes: ["fullname", "avatar"] },
            ],
          },
        ],
      };

      const response = await Model.avisProduitfournisseur.findAll(avisOptions);

      if (response.length !== 0) {
        return res.status(200).json({
          success: true,
          avis: response,
        });
      } else {
        return res.status(400).json({
          success: false,
          error: "No Avis for this produit fournisseur",
        });
      }
    } catch (err) {
      return res.status(400).json({
        success: false,
        error: err.message || "An error occurred",
      });
    }
  },

  getAllavisBylibriarie: async (req, res) => {
    try {
      const fournisseurId = req.params.id;

      const avisOptions = {
        include: [
          {
            model: Model.produitfournisseur,
            attributes: ["titre"],
            include: [
              {
                model: Model.imageProduitFournsseur,
                attributes: ["name_Image"],
              },
              {
                model: Model.fournisseur,
                attributes: [],
                where: { id: fournisseurId },
              },
            ],
          },
          {
            model: Model.client,
            attributes: ["id"],
            include: [
              { model: Model.user, attributes: ["fullname", "avatar"] },
            ],
          },
          {
            model: Model.partenaire,
            attributes: ["id", "nameetablissement", "image"],
            include: [
              { model: Model.user, attributes: ["fullname", "avatar"] },
            ],
          },
        ],
      };

      const response = await Model.avisProduitfournisseur.findAll(avisOptions);

      if (response.length !== 0) {
        return res.status(200).json({
          success: true,
          avis: response,
        });
      } else {
        return res.status(400).json({
          success: false,
          error: "No Avis for this fournisseur",
        });
      }
    } catch (err) {
      return res.status(400).json({
        success: false,
        error: err.message || "An error fournisseur",
      });
    }
  },

  getAvisByArticle: async (req, res) => {
    const { nameArticle } = req.body;
    try {
      Model.avisProduitfournisseur
        .findAll({
          attributes: {
            exclude: ["updatedAt", "clientavisprodfk", "prodavisproduitsfk"],
          },
          include: [
            {
              model: Model.produitlabrairie,
              attributes: ["id", "titre", "prix"],
              where: { titre: nameArticle },
              include: [
                {
                  model: Model.imageProduitLibrairie,
                  attributes: ["name_Image"],
                },
                {
                  model: Model.labrairie,
                  attributes: ["nameLibrairie"],
                },
              ],
            },
          ],
        })
        .then((response) => {
          if (response !== null) {
            return res.status(200).json({
              success: true,
              avis: response,
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

  getTopAvisProduit: async (req, res) => {
    try {
      Model.produitlabrairie
        .findAll({
          include: [
            {
              model: Model.avisProduitfournisseur,
              attributes: [
                "id",
                "nbStart",
                "commenter",
                "clientavisprodfk",
                "prodavisproduitsfk",
              ],
              order: [["nbStart", "DESC"]],
              limit: 1,
              include: [
                { model: Model.client, attributes: ["userclientfk"] , include:[{
                  model: Model.user,
                  attributes: ["fullname","avatar"],
                }]},
                {
                  model: Model.produitlabrairie,
                  attributes: ["id"],
                  include: [
                    {
                      model: Model.imageProduitLibrairie,
                      attributes: ["name_Image"],
                    },
                    {
                      model: Model.labrairie,
                      attributes: ["nameLibrairie"],
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
              produits: response,
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
module.exports = avisProduitfournisseurController;
