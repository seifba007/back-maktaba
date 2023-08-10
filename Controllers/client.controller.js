const { where,Sequelize } = require("sequelize");
const Model = require("../Models/index");
const clientController = {
  findOneClient: async (req, res) => {
    try {
      Model.user
        .findOne({
          where: { id: req.params.id },
          attributes: { exclude: ["password", "createdAt", "updatedAt","email_verifie","role"] },
          include: [
            {
              model: Model.client,
              attributes: ["id"],
              include: [
                {
                  model: Model.adresses,
                  attributes: {
                    exclude: ["clientId", "createdAt", "updatedAt"],
                  },
                },
              ],
            },
          ],
        })
        .then((response) => {
          if (response !== null) {
            return res.status(200).json({
              success: true,
              client: response,
            });
          } else {
            return res.status(200).json({
              success: false,
              message: "client introuvable",
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

  filterproduit: async (req, res) => {
  const filters = req.body; 
  const whereClause = {};
  
  if (filters.categoryId) whereClause.categorieId = filters.categoryId;
  
  if (filters.priceMin && filters.priceMax) {
    whereClause.prix = { 
      [Sequelize.Op.between]: [filters.priceMin, filters.priceMax]
    };
  } else if (filters.priceMin) {
    whereClause.prix = { [Sequelize.Op.gte]: filters.priceMin };
  } else if (filters.priceMax) {
    whereClause.prix = { [Sequelize.Op.lte]: filters.priceMax };
  }
  
    try{
      Model.produitlabrairie.findAll(
        
        {
          where: whereClause,
          include: [
            {
              model: Model.categorie,
              attributes: ["id", "name"],
            },
          ],
        }
        
      ).then((response)=>{
        try{
            if(response!==null){
              return res.status(200).json({
                success : true , 
                produits: response,
              })
            }
        }catch(err){
          return res.status(400).json({
            success: false,
            error:err,
          });
        }
      })
    }catch(err){
      return res.status(400).json({
        success: false,
        error:err,
      });
    }
  }
};
module.exports = clientController;
