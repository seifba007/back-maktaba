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


  if (filters.categorieId) {
    whereClause.categorieId = filters.categorieId;
  }

  if (filters.SouscategorieId) {
    whereClause.SouscategorieId = filters.SouscategorieId;
  }
  
  
  if (filters.prixMin && filters.prixMax) {
    whereClause.prix = { 
      [Sequelize.Op.between]: [filters.prixMin, filters.prixMax]
    };
  } else if (filters.prixMin) {
    whereClause.prix = { [Sequelize.Op.gte]: filters.prixMin };
  } else if (filters.prixMax) {
    whereClause.prix = { [Sequelize.Op.lte]: filters.prixMax };
  }
  if (filters.qteMin && filters.qteMax) {
    whereClause.qte = { 
      [Sequelize.Op.between]: [filters.qteMin, filters.qteMax]
    };
  } else if (filters.qteMin) {
    whereClause.qte = { [Sequelize.Op.gte]: filters.qteMin };
  } else if (filters.qteMax) {
    whereClause.qte = { [Sequelize.Op.lte]: filters.qteMax };
  }

  if (filters.etat) {
    whereClause.etat = filters.etat;
  }

  if (filters.titre) {
    whereClause.titre = filters.titre;
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
