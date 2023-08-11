const categorie = require("../Models/categorie");
const Model = require("../Models/index");
const bcrypt = require("bcrypt");
const sequelize = require('sequelize');
const sousCategorie = require("../Models/sousCategorie");
const adminController = {
  add:async(req, res) => {
    try {
        const passwordHash = bcrypt.hashSync(req.body.password, 10);
          const datauser = {
            fullname : req.body.fullname,
            email: req.body.email,
            password: passwordHash,
            email_verifie: "verifie",
            etatCompte:"active",
            role : "Admin"
          };
          Model.user.create(datauser).then((user) => {
            if (user !== null) {
              const dataAdmin={
                id : user.id, 
                userId : user.id
              }
              Model.admin.create(dataAdmin).then((client)=>{
                if(client!==null){
                  res.status(200).json({
                    success: true, 
                    message: "Admin created",
                  });
                }else{
                    res.status(400).json({
                        success: false, 
                        message: "error to add admin",
                      });
                }
              })
            }else{
                res.status(400).json({
                    success: false, 
                    message: "error to add admin",
                  });
            }
          })
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err,
        });
    }
  },

  findAllusersrole : async(req,res)=>{
    try{
      Model.user.findAll().then((response)=>{
        try{
            if(response!==null){
              return res.status(200).json({
                success : true , 
                users: response,
              })
            }else{
              return res.status(200).json({
                success : true , 
                users: [],
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
  },

  findAllcategories: async (req, res) => {
    try {
      Model.categorie
        .findAll({
          attributes: {
            include: ["id","name"],
          },
          include: [
            {
              model: Model.Souscategorie,
              attributes: ["id", "name"],
            },
          ],
        
        })
        .then((response) => {
          if (response !== null) {
            return res.status(200).json({
              success: true,
              categories: response,
            });
          } else {
            return res.status(400).json({
              success: false,
              err: " zero category",
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

  findAllproduits : async(req,res)=>{
    try{
      Model.produitlabrairie.findAll().then((response)=>{
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
  },

  deletecategory: async (req, res) => {
    const { ids } = req.body;
    try {
      Model.categorie
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



  addcategory: async (req, res) => {
    try {
      const {name,Description, subcategories} = req.body

      const data = {
        name: req.body.name,
        Description:req.body.Description
      };

      const category = await Model.categorie.create(data);
        const souscategories = [];
        for(const subcateName of subcategories){
          const subcategory = await  Model.Souscategorie.create({
            name: subcateName,
            categorieId: category.id
          });
          souscategories.push(subcategory)
        }
        res.status(200).json({
          success: true,
          message: "category and subcategories added",
        });
    } catch (err) {
      return res.status(400).json({
        success: false,
        error: err,
      });
    }
  },

  deletesuggestion: async (req, res) => {
    const { ids } = req.body;
    console.log(ids);
    try {
      Model.suggestionProduit
        .destroy({
          where: {
            id: ids,
          },
        })
        .then((reponse) => {
          if (reponse !== 0) {
            return res.status(200).json({
              success: true,
              message: " suggestion deleted",
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

  findAllavis : async(req,res)=>{
    const clientId = req.params.id;

  try{
    Model.avisProduitlibraire.findOne(
      {
        attributes: ['clientId', [sequelize.fn('SUM', sequelize.col('nbStart')), 'nombre_total_etoiles']],
        where: {
          clientId: clientId
        }
      }
    ).then((response)=>{
      try{
          if(response!==null){
            return res.status(200).json({
              success : true , 
              avis: response,
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
  },


  findavgavis : async(req,res)=>{
    const clientId = req.params.id;

  try{
    Model.avisProduitlibraire.findOne(
      {
        attributes: ['clientId', [sequelize.fn('AVG', sequelize.col('nbStart')), 'moyenne_avis']],
        where: {
          clientId: clientId
        }
      }
    ).then((response)=>{
      try{
          if(response!==null){
            return res.status(200).json({
              success : true , 
              avismoy: response,
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
  },
  
};

module.exports = adminController;