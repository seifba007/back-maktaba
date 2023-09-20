const categorie = require("../Models/categorie");
const Model = require("../Models/index");
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const sequelize = require("sequelize");
const sousCategorie = require("../Models/sousCategorie");
const cloudinary = require("../middleware/cloudinary");

const {
  addadminValidation,
  deletecategoryValidation,
  addcategoryValidation,
  filtercommandeValidation,
} = require("../middleware/auth/validationSchema");
const adminController = {
  add: async (req, res) => {
    const data = req.body;
    try {
      const { error } = addadminValidation(data);
      if (error)
        return res
          .status(400)
          .json({ success: false, err: error.details[0].message });
      const passwordHash = bcrypt.hashSync(req.body.password, 10);
      const datauser = {
        fullname: req.body.fullname,
        email: req.body.email,
        password: passwordHash,
        email_verifie: "verifie",
        etatCompte: "active",
        role: "Admin",
      };
      Model.user.create(datauser).then((user) => {
        if (user !== null) {
          const dataAdmin = {
            id: user.id,
            userId: user.id,
          };
          Model.admin.create(dataAdmin).then((client) => {
            if (client !== null) {
              res.status(200).json({
                success: true,
                message: "Admin created",
              });
            } else {
              res.status(400).json({
                success: false,
                message: "error to add admin",
              });
            }
          });
        } else {
          res.status(400).json({
            success: false,
            message: "error to add admin",
          });
        }
      });
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
          role: ["partenaire", "labrairie"],
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
          },
        ],
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
            include: ["id", "name"],
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
  findAllproduits: async (req, res) => {
    try {
      Model.produitlabrairie.findAll().then((response) => {
        try {
          if (response !== null) {
            return res.status(200).json({
              success: true,
              produits: response,
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
  deletecategory: async (req, res) => {
    const { ids } = req.body;
    try {
      const { error } = deletecategoryValidation(req.body);
      if (error)
        return res
          .status(400)
          .json({ success: false, err: error.details[0].message });
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
              message: " category deleted",
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
    //const { error } = addcategoryValidation(req.body);
    //if (error)return res.status(400).json({ success: false, err: error.details[0].message });
    try {

      req.files.forEach(async (file) => {
        const result = await cloudinary.uploader.upload(file.path);
        const imageUrl = result.secure_url
        console.log(imageUrl)
        const { subcategories } = req.body;
        const data = {
          name: req.body.name,
          Description: req.body.Description,
          image: imageUrl,
        };
        const category = await Model.categorie.create(data);
        const souscategories = [];
        for (const subcateName of subcategories) {
          const subcategory =  await Model.Souscategorie.create({
            name: subcateName,
            catagsouscatafk: category.id,
          });
          souscategories.push(subcategory);
        }
        res.status(200).json({
          success: true,
          category:category,
          souscategory: souscategories,
          message: "category and subcategories added",
        });
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

  findAllavis: async (req, res) => {
    const clientavisprodfk = req.params.id;

    try {
      Model.avisProduitlibraire
        .findOne({
          attributes: [
            "clientavisprodfk",
            [
              sequelize.fn("SUM", sequelize.col("nbStart")),
              "nombre_total_etoiles",
            ],
          ],
          where: {
            clientavisprodfk: clientavisprodfk,
          },
        })
        .then((response) => {
          try {
            if (response !== null) {
              return res.status(200).json({
                success: true,
                avis: response,
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


  findavisproduit: async (req, res) => {
    const produitid = req.params.id;
    try {
      Model.avisProduitlibraire
        .findOne({
          attributes: ['nbStart', [sequelize.fn('COUNT', sequelize.col('nbStart')), 'nombre_avis']],
          where: {
            prodavisproduitsfk: produitid,
          },
          group: ['nbStart'],
        })
        .then((response) => {
          try {
            if (response !== null) {
              return res.status(200).json({
                success: true,
                avis: response,
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

  findNbreAvisProduit: async (req, res) => {
    const produitid = req.params.id;
  
    try {
      const avisProduit = await Model.avisProduitlibraire.findAll({
        where: {
          prodavisproduitsfk: produitid,
        },
      });
  
      if (avisProduit.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Aucun avis trouvé pour ce produit.",
        });
      }
  
      const etoileCounts = {
        5: 0,
        4: 0,
        3: 0,
        2: 0,
        1: 0,
      };
  
      avisProduit.forEach((avis) => {
        console.log(avis)
        etoileCounts[avis.dataValues.nbStart] += 1;
      });
  
      const response = {
        success: true,
        avis: {
          5: etoileCounts[5],
          4: etoileCounts[4],
          3: etoileCounts[3],
          2: etoileCounts[2],
          1: etoileCounts[1],
        },
      };
  
      return res.status(200).json(response);
    } catch (err) {
      return res.status(500).json({
        success: false,
        error: err.message,
      });
    }
  },

  findTotalAvisProduit: async (req, res) => {
    const produitid = req.params.id;
  
    try {
      const allAvis = await Model.avisProduitlibraire.findAll({
        where:{
          prodavisproduitsfk: produitid
        }
      });
  
      if (allAvis.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Aucun avis trouvé pour ce produit.",
        });
      }
  
      let totalStars = 0;
  
      allAvis.forEach((avis) => {
        totalStars += avis.dataValues.nbStart;
      });
  
      const response = {
        success: true,
        sommeStart: totalStars,
      };
  
      return res.status(200).json(response);
    } catch (err) {
      return res.status(500).json({
        success: false,
        error: err.message,
      });
    }
  },

  findMoyeAvisProduit: async (req, res) => {
    const produitid = req.params.id;

  try {
    const avisProduit = await Model.avisProduitlibraire.findAll({
      where: {
        prodavisproduitsfk: produitid,
      },
    });

    if (avisProduit.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Aucun avis trouvé pour ce produit.",
      });
    }

    let totalStars = 0;

    const totalAvis = avisProduit.length;

    avisProduit.forEach((avis) => {
      totalStars += avis.dataValues.nbStart;
    });

    const moyenne = totalStars / totalAvis;

    const response = {
      success: true,
      moyenneAvis: moyenne,
    };

    return res.status(200).json(response);
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
  },
  

  findavgavis: async (req, res) => {
    const clientavisprodfk = req.params.id;
    try {
      Model.avisProduitlibraire
        .findOne({
          attributes: [
            "clientavisprodfk",
            [sequelize.fn("AVG", sequelize.col("nbStart")), "moyenne_avis"],
          ],
          where: {
            clientavisprodfk: clientavisprodfk,
          },
        })
        .then((response) => {
          try {
            if (response !== null) {
              return res.status(200).json({
                success: true,
                avismoy: response,
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
  find: async (req, res) => {
    const clientavisprodfk = req.params.id;
    try {
      Model.avisProduitlibraire
        .findOne({
          attributes: [
            "clientavisprodfk",
            [sequelize.fn("AVG", sequelize.col("nbStart")), "moyenne_avis"],
          ],
          where: {
            clientavisprodfk: clientavisprodfk,
          },
        })
        .then((response) => {
          try {
            if (response !== null) {
              return res.status(200).json({
                success: true,
                avismoy: response,
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
  gettop10prod: async (req, res) => {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const topProducts = await Model.avisProduitlibraire.findAll({
        attributes: [
          [sequelize.fn("SUM", sequelize.col("nbStart")), "totalAvis"],
          "prodavisproduitsfk",
        ],
        where: {
          createdAt: {
            [Op.gte]: thirtyDaysAgo,
          },
        },
        group: ["prodavisproduitsfk"],
        order: [[sequelize.literal("totalAvis"), "DESC"]],
        limit: 10,
        include: [
          {
            model: Model.produitlabrairie,
            include: [
              {
                model: Model.imageProduitLibrairie,
                attributes: ["name_Image"],
              },
            ],
          },
        ],
      });

      return res.status(200).json({
        success: true,
        produit: topProducts.map((item) => ({
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

  findusernameetabllis: async (req, res) => {
    try {
      Model.user
        .findAll({
          attributes: [
            "id",
            "email",
            "email_verifie",
            "role",
            "fullname",
            "avatar",
            "Date_de_naissance",
            "telephone",
            "point",
          ],

          include: [
            {
              model: Model.partenaire,
              attributes: ["nameetablissement"],
            },
            {
              model: Model.fournisseur,
              attributes: ["nameetablissement"],
            },
            {
              model: Model.labrairie,
              attributes: ["nameLibrairie"],
            },
          ],
        })
        .then((response) => {
          try {
            if (response !== null) {
              return res.status(200).json({
                success: true,
                users: response,
              });
            } else {
              return res.status(200).json({
                success: true,
                users: [],
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

 
  
  findCommandefiltre: async (req, res) => {
    const { sortBy, sortOrder, page, pageSize } = req.query;
    const offset = (page - 1) * pageSize;
    const order = [[sortBy, sortOrder === "desc" ? "DESC" : "ASC"]];

    const filters = req.query;
    const whereClause = {
      
      qte: {
        [sequelize.Op.gt]: 0, 
      },
    };

    if (filters.categprodlabfk) {
      if (typeof filters.categprodlabfk === "string") {
        filters.categprodlabfk = filters.categprodlabfk
          .split(",")
          .map((id) => parseInt(id, 10));
      }
      whereClause.categprodlabfk = filters.categprodlabfk;
    }

    if (filters.souscatprodfk) {
      if (typeof filters.souscatprodfk === "string") {
        filters.souscatprodfk = filters.souscatprodfk.split(",").map((id) =>
          parseInt(id, 10)
        );
      }
      whereClause.souscatprodfk = filters.souscatprodfk;
    }

    if (filters.qteMin && filters.qteMax) {
      whereClause.qte = {
        [sequelize.Op.between]: [filters.qteMin, filters.qteMax],
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
      whereClause.titre = {
        [sequelize.Op.like]:  `%${filters.titre}%`,
      };
    }

    if (filters.prixMin && filters.prixMax) {
      whereClause[sequelize.Op.or] = [
        {
          prix: {
            [sequelize.Op.between]: [filters.prixMin, filters.prixMax],
          },
        },
        {
          prix_en_solde: {
            [sequelize.Op.between]: [filters.prixMin, filters.prixMax],
          },
        },
      ];
    } else if (filters.prixMin) {
      whereClause[sequelize.Op.or] = [
        {
          prix: { [sequelize.Op.gte]: filters.prixMin },
        },
        {
          prix_en_solde: { [sequelize.Op.gte]: filters.prixMin },
        },
      ];
    } else if (filters.prixMax) {
      whereClause[sequelize.Op.or] = [
        {
          prix: { [sequelize.Op.lte]: filters.prixMax },
        },
        {
          prix_en_solde: { [sequelize.Op.lte]: filters.prixMax },
        },
      ];
    }

    try {
      const totalCount = await Model.produitlabrairie.count({
        where: whereClause,
      });

      const produits = await Model.produitlabrairie.findAll({
        offset: offset,
        order: order,
        where: whereClause,
        limit: +pageSize,
        include: [
          {
            model: Model.categorie,
            attributes: ["name"],
          },
          {
            model: Model.Souscategorie,
            attributes: ["name"],
          },
          {
            model: Model.imageProduitLibrairie,
            where:{
              name_image :{
                [sequelize.Op.ne]: "https://res.cloudinary.com/doytw80zj/image/upload/v1693689652/27002_omkvdd.jpg"
              }
            }
          },
          {
            model: Model.avisProduitlibraire,
          },
          {
            model: Model.labrairie,
            attributes: [
              "id",
              "adresse",
              "telephone",
              "nameLibrairie",
              "facebook",
              "instagram",
              "imageStore",
              "emailLib",
            ],
          },
        ],
      });

      if (produits.length > 0) {
        const totalPages = Math.ceil(totalCount / pageSize);
        return res.status(200).json({
          success: true,
          produits: produits,
          totalPages: totalPages,
        });
      } else {
        return res.status(200).json({
          success: true,
          message: "Aucun produit trouv� avec ces filtres.",
        });
      }
    } catch (err) {
      return res.status(400).json({
        success: false,
        error: err.message,
      });
    }
  },

  findproduitbyname: async (req, res) => {
    const { name } = req.query;
    try {
      Model.produitlabrairie
        .findAll({
          where: {
            titre: name,
          },
        })
        .then((response) => {
          try {
            if (response !== null) {
              return res.status(200).json({
                success: true,
                produits: response,
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

  findfournissbyname: async (req, res) => {
    const { name } = req.query;
    try {
      Model.fournisseur
        .findAll({
          where: {
            nameetablissement: name,
          },
          include: [
            {
              model: Model.user,
            },
          ],
        })
        .then((response) => {
          try {
            if (response !== null) {
              return res.status(200).json({
                success: true,
                fournisseur: response,
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

  getAllAvis: async (req, res) => {
    try {
      Model.avisProduitlibraire.findAll({}).then((response) => {
        try {
          if (response !== null) {
            return res.status(200).json({
              success: true,
              avis: response,
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
};

module.exports = adminController;
