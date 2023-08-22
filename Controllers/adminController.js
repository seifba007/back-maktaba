const categorie = require("../Models/categorie");
const Model = require("../Models/index");
const bcrypt = require("bcrypt");
const { Op } = require('sequelize');
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
  findAllusersrole: async (req, res) => {
    try {
      const response = await Model.user.findAll({
        where: {
          role: ['partenaire', 'labrairie']
        },
        include: [
          {
            model: Model.partenaire,
            attributes: {
              include: ["nameetablissement"],
            }, 
            required: false,
    
          },
          {
            model: Model.labrairie, 
            attributes: {
              include: ["nameLibrairie"],
            }, 
            required: false,
     
          }
        ]
      });
  
      if (response.length > 0) {
        return res.status(200).json({
          success: true,
          users: response,
        });
      } else {
        return res.status(400).json({
          success: false,
          err: "Zero users",
        });
      }
    } catch (err) {
      return res.status(400).json({
        success: false,
        error: err.message,
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
    console.log(ids);
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
      const data = {
        name: req.body.name,
        Description: req.body.Description,
        image: req.file.filename
      };
  
      
      const categorie = await Model.categorie.create(data);
  
      
      const sousCategories = req.body.sousCategories; 
      if (sousCategories && sousCategories.length > 0) {
        const sousCategoriesCréées = await Promise.all(sousCategories.map(async nomSousCat => {
          return await Model.Souscategorie.create({
            name: nomSousCat,
            Description: nomSousCat,
            categorieId: categorie.id
          });
        }));
  
        console.log('Sous-catégories ajoutées avec succès:', sousCategoriesCréées);
      }
  
      console.log('Catégorie ajoutée avec succès:', categorie);
      res.send('Catégorie ajoutée avec succès');
    } catch (err) {
      console.error('Erreur lors de l\'ajout de la catégorie:', err);
      res.status(500).send('Erreur lors de l\'ajout de la catégorie');
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

  gettop10prod: async (req, res) => {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const topProducts = await Model.avisProduitlibraire.findAll({
        attributes: [
          [sequelize.fn('SUM', sequelize.col('nbStart')), 'totalAvis'],
          'produitlabrairieId', 
        ],
        where: {
          createdAt: {
            [Op.gte]: thirtyDaysAgo,
          },
        },
        group: ['produitlabrairieId'],
        order: [[sequelize.literal('totalAvis'), 'DESC']],
        limit: 10,
        include: [
          {
            model: Model.produitlabrairie,
            include: [
              {
                model: Model.imageProduitLibrairie,
                attributes: ['name_Image'],
              },
            ],
          },
        ],
      });
  
      return res.status(200).json({
        success: true,
        produit: topProducts.map(item => ({
          totalAvis: item.dataValues.totalAvis,
          produitlabrairie: item.produitlabrairie,
        })),
      });
    } catch (err) {
      console.error(err);
      return res.status(400).json({
        success: false,
        error: err.message,
      });
    }
  },
    findusernameetabllis : async(req,res)=>{
      try{
        Model.user.findAll({
          where: {
            role: ['partenaire']
          },
          include:[{
            model: Model.partenaire,
            attributes: [ 'nameetablissement']
          }
          ]
        }).then((response)=>{
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
  

  findAllcommandefiltrer: async (req, res) => {
    
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
        [sequelize.Op.between]: [filters.prixMin, filters.prixMax]
      };
    } else if (filters.prixMin) {
      whereClause.prix = { [sequelize.Op.gte]: filters.prixMin };
    } else if (filters.prixMax) {
      whereClause.prix = { [sequelize.Op.lte]: filters.prixMax };
    }
    
    if (filters.qteMin && filters.qteMax) {
      whereClause.qte = { 
        [sequelize.Op.between]: [filters.qteMin, filters.qteMax]
      };
    } else if (filters.qteMin) {
      whereClause.qte = { [sequelize.Op.gte]: filters.qteMin };
    } else if (filters.qteMax) {
      whereClause.qte = { [sequelize.Op.lte]: filters.qteMax };
    }
    
    if (filters.etat) {
      whereClause.etat = filters.etat;
    }
    if (filters.titre) {
      whereClause.titre = filters.titre;
    }
    try {
      Model.commandeEnDetail.findAll({
        attributes: ["id", "total_ttc", "etatVender", "createdAt"],
        include: [
          { model: Model.user, attributes: ["fullname", "avatar"] },
          { model: Model.labrairie, attributes: ["nameLibrairie"] },
          {
            model: Model.produitlabrairie,
            where: whereClause
           
          },
          
        ],
      }).then((response) => {
        try {
          if (response !== null) {
            return res.status(200).json({
              success: true,
              commandes: response,
            });
          }
        } catch (err) {
          return res.status(400).json({
            success: false,
            error: err,
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
  
  findAlllivraisonfiltrer : async(req,res)=>{

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
        [sequelize.Op.between]: [filters.prixMin, filters.prixMax]
      };
    } else if (filters.prixMin) {
      whereClause.prix = { [sequelize.Op.gte]: filters.prixMin };
    } else if (filters.prixMax) {
      whereClause.prix = { [sequelize.Op.lte]: filters.prixMax };
    }
    
    if (filters.qteMin && filters.qteMax) {
      whereClause.qte = { 
        [sequelize.Op.between]: [filters.qteMin, filters.qteMax]
      };
    } else if (filters.qteMin) {
      whereClause.qte = { [sequelize.Op.gte]: filters.qteMin };
    } else if (filters.qteMax) {
      whereClause.qte = { [sequelize.Op.lte]: filters.qteMax };
    }
    
    if (filters.etat) {
      whereClause.etat = filters.etat;
    }
    if (filters.titre) {
      whereClause.titre = filters.titre;
    }
  
    try{
      Model.commandeEnDetail.findAll({
        
        attributes: ["id", "total_ttc", "etatVender", "createdAt"],
        where : {
          etatVender : ['Compléter']
        } ,
        include: [
          { model: Model.user, attributes: ["fullname", "avatar"] },
          {
            model: Model.labrairie,
            attributes: ["nameLibrairie"],
          },
          {
            model: Model.produitlabrairie,
            
            where: whereClause
          }
          
        ],
      }).then((response)=>{
        try{
            if(response!==null){
              return res.status(200).json({
                success : true , 
                livraison: response,
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