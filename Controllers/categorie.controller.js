const { Sequelize } = require("sequelize");
const Model = require("../Models/index");
const categorieController = {

  add: async (req, res) => {
    try {
      const data = {
        name: req.body.name,
        Description:req.body.Description
      };
      await Model.categorie.create(data).then((reponse) => {
        if (reponse !== null) {
          res.status(200).json({
            success: true,
            categorie: reponse,
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
      const data = {
        name: req.body.name,
      };
      await Model.categorie
        .update(data, {
          where: {
            id: req.params.id,
          },
        })
        .then((reponse) => {
          if (reponse) {
            res.status(200).json({
              success: true,
              message: "update done",
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
      await Model.categorie
        .destroy({
          where: {
            id: req.params.id,
          },
        })
        .then((reponse) => {
          if (reponse !== 0) {
            res.status(200).json({
              success: true,
              message: "delete done",
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
  find: async (req, res) => {
    try {
      await Model.categorie.findAll(
        {
         where:{
          id: req.params.id
         },
          include: [
            {
              model: Model.Souscategorie,
              attributes: {
                exclude: ["name"],
              },
            },
          ],
        },
     ).then((categorie) => {
        res.status(200).json({
          success: true,
          categorie: categorie,
        });
      });
    } catch (err) {
      return res.status(400).json({
        success: false,
        error: err,
      });
    }
  },
   NbfindProduitLibByCategorie : async (req, res) => {
    try {
      const labrairieId = req.params.id;
  
      // Check if the labrairieId is undefined or null
      if (!labrairieId) {
        return res.status(400).json({
          success: false,
          error: 'Labrairie ID is required',
        });
      }
  
      // Verify that the column names are correct
      // Replace `correctColumnName` with the actual column name in your database
      const response = await Model.categorie.findAll({
        include: [
          {
            model: Model.produitlabrairie,
            attributes: [
              [Sequelize.fn('COUNT', Sequelize.col('titre')), 'nb_Produit'],
              'updatedAt'
            ],
            where: { /* Replace 'labrairieId' with the correct column name if different */ },
          },
        ],
        attributes: ['id', 'name', 'Description'],
        group: ['categorie.id']
      });
  
      return res.status(200).json({
        success: true,
        produit: response,
      });
  
    } catch (err) {
      // Catch any other errors that occur
      return res.status(400).json({
        success: false,
        error: err.message,
      });
    }
  },
  
};
module.exports = categorieController;
