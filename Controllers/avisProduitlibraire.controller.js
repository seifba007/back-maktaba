const { response } = require("express");
const Model = require("../Models/index");
const avisProduitlibraire = require("../Models/avisProduitlibraire");
const { Sequelize } = require("sequelize");
const { addAvisProdValidation } = require("../middleware/auth/validationSchema");
const avisProduitlibraireController = {
  add: async (req, res) => {
    const { nbStart, commenter, clientId, produitlabrairieId, partenaireId } = req.body;
    try {
      const { error } = addAvisProdValidation(req.body);
      if (error) return res.status(400).json(error.details[0].message);
      const dataclient = {
        nbStart: nbStart,
        commenter: commenter,
        clientId: clientId,
        partenaireId: partenaireId,
        produitlabrairieId: produitlabrairieId,
      };
      const datapartenaire = {
        nbStart: nbStart,
        commenter: commenter,
        clientId: clientId,
        partenaireId: partenaireId,
        produitlabrairieId: produitlabrairieId,
      };
      if(clientId){
        Model.avisProduitlibraire.create(dataclient).then((response) => {
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
      }else if(partenaireId){
        Model.avisProduitlibraire.create(datapartenaire).then((response) => {
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
      Model.avisProduitlibraire
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
      Model.avisProduitlibraire
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
      Model.avisProduitlibraire
        .findAll({
          where: { clientId: req.params.clientId },
          attributes: {
            exclude: ["updatedAt", "clientId", "produitlabrairieId"],
          },
          include: [
            {
              model: Model.produitlabrairie,
              attributes: ["id", "titre","prix"],
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
  getAllAvisByPartnier: async (req, res) => {
    try {
      const response = await Model.avisProduitlibraire.findAll({
        where: { partenaireId: req.params.partenaireId },
        attributes: {
          exclude: ["updatedAt", "produitlabrairieId"],
        },
        include: [
          {
            model: Model.produitlabrairie,
            attributes: ["id", "titre", "prix"],
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
        where: { produitlabrairieId: req.params.produitlabrairieId },
        attributes: {
          exclude: ["updatedAt", "clientId", "produitlabrairieId"],
        },
        include: [
          {
            model: Model.client,
            attributes: ["id"],
            include: [
              { model: Model.user, attributes: ["fullname", "avatar"] },
            ],
          },
          {
            model: Model.partenaire, // Include partenaire information directly
            attributes: ["id", "nameetablissement", "image"],
            include: [
              { model: Model.user, attributes: ["fullname", "avatar"] },
            ],
          },
        ],
      };
  
      const response = await Model.avisProduitlibraire.findAll(avisOptions);
  
      if (response.length !== 0) {
        return res.status(200).json({
          success: true,
          avis: response,
        });
      } else {
        return res.status(400).json({
          success: false,
          error: "No Avis for this produitlabrairie",
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
      const labrairieId = req.params.id;
  
      const avisOptions = {
        include: [
          {
            model: Model.produitlabrairie,
            attributes: ["titre"],
            include: [
              { model: Model.imageProduitLibrairie, attributes: ["name_Image"] },
              { model: Model.labrairie, attributes: [], where: { id: labrairieId } }
            ],
          },
          {
            model: Model.client,
            attributes: ["id"],
            include: [{ model: Model.user, attributes: ["fullname", "avatar"] }],
          },
          {
            model: Model.partenaire, 
            attributes: ["id", "nameetablissement", "image"],
            include: [{ model: Model.user, attributes: ["fullname", "avatar"] }],
          },
        ],
      };
  
      const response = await Model.avisProduitlibraire.findAll(avisOptions);
  
      if (response.length !== 0) {
        return res.status(200).json({
          success: true,
          avis: response,
        });
      } else {
        return res.status(400).json({
          success: false,
          error: "No Avis for this labrairie",
        });
      }
    } catch (err) {
      return res.status(400).json({
        success: false,
        error: err.message || "An error occurred",
      });
    }
  },

};
module.exports = avisProduitlibraireController;