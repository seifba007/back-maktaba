const { Sequelize } = require("sequelize");
const Model = require("../Models/index");
const produitFavorieController = {
  add: async (req, res) => {
    try {
      const { userId, produitlabrairieId } = req.body;
      const data = {
        userId: userId,
        produitlabrairieId: produitlabrairieId,
      };

      Model.produitFavorie.findOne({where:{userId:userId,produitlabrairieId:produitlabrairieId}}).then((response)=>{
        if(response!==null){
            return res.status(200).json({
              success: false,
              message: " produit est deja dans la liste de produit favorie",
            });
          }else{
            Model.produitFavorie.create(data).then((response) => {
             
              if (response !== null) {
                return res.status(200).json({
                  success: true,
                  message: " add produitFavorie Done",
                });
              } else {
                return res.status(200).json({
                  success: false,
                  message: "  err  to add produit in list favorie",
                });
              }
            });
          }
      })
    
    } catch (err) {
      return res.status(400).json({
        success: false,
        error: err,
      });
    }
  },

  delete: async (req, res) => {
    try {
      Model.produitFavorie
        .destroy({
          where: { id: req.params.id, userId: req.params.userId },
        })
        .then((response) => {
          if (response !== 0) {
            return res.status(200).json({
              success: true,
              message: "delete favorie produit done",
            });
          } else {
            return res.status(400).json({
              success: false,
              message: "err to delete favorie produit",
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
  
  findAllByclient: async (req, res) => {
    try {
      Model.produitFavorie
        .findAll({
          where: { userId: req.params.userId },
          attributes: ["id"],
          include: [
            {
              model: Model.produitlabrairie,
              attributes: {
                exclude: ["createdAt", "updatedAt", "id", "categorieId","labrairieId"],
              },
              include: [
                {
                  model: Model.labrairie,
                  attributes: ["id","imageStore", "nameLibrairie"],
                },  {
                  model: Model.imageProduitLibrairie,
                  attributes: ["name_Image"],
                  
                },
                {
                  model: Model.avisProduitlibraire,
              
                },
              ],
             
            },
          ],
         
        })
        .then((response) => {
          if (response !== null) {
            return res.status(200).json({
              success: true,
              produitFavorie: response,
            });
          } else {
            return res.status(400).json({
              success: false,
              message: "err to find favorie produit",
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
module.exports = produitFavorieController;
