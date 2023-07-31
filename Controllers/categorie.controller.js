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
  NbfindProduitLibByCategorie: async (req, res) => {
   try{
    Model.categorie
    .findAll({
      include: [
        {
          model: Model.produitlabrairie,
          attributes:[[Sequelize.fn("COUNT", Sequelize.col("titre")), "nb_Produit"],"updatedAt"],
          where: { labrairieId: req.params.id },
        },
      ],
      attributes:["id","name",'Description'],
      group:["categorie.id"]
    })
    .then((response) => {
        return res.status(200).json({
            success: true,
            produit: response,
          });
    });
   }catch(err){
    return res.status(400).json({
        success: false,
        error: err,
      });
   }
},
 addCategory : async (req, res) => {
  const { categoryTitle, categoryDescription, subcategories } = req.body;

  const transaction = await db.sequelize.transaction();

  try {
  
    const existingCategory = await Category.findOne({
      where: { title: categoryTitle },
      transaction,
    });

    if (existingCategory) {
   
      res.status(400).json({ error: 'Category with the same title already exists.' });
      return;
    }

   
    const category = await Category.create(
      { title: categoryTitle, description: categoryDescription },
      { transaction }
    );

    const subcategoryPromises = subcategories.map((subcategory) => {
      return Subcategory.create({ title: subcategory.title, categoryId: category.id }, { transaction });
    });

    const createdSubcategories = await Promise.all(subcategoryPromises);

  
    await transaction.commit();

  
    res.status(200).json({ category: { category, subcategories: createdSubcategories } });
  } catch (error) {
  
    await transaction.rollback();
    res.status(500).json({ error: error.message });
  }
}
};
module.exports = categorieController;
