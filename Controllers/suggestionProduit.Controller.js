const Model = require("../Models/index");
const { suggestionProduitValidation } = require("../middleware/auth/validationSchema");
const cloudinary = require("../middleware/cloudinary");

const suggestionProduitController = {
  add: async (req, res) => {
    const { Titre, Description, image, usersuggeprodfk, soussuggestfk, categoriesuggestfk } =
      req.body;
    try {
      
      req.files.forEach(async (file) => {
        const result = await cloudinary.uploader.upload(file.path); 
        const imageUrl = result.secure_url;
        const data = {
          Titre: Titre,
          Description: Description,
          image: imageUrl,
          etat: "en_cours",
          usersuggeprodfk: usersuggeprodfk,
          soussuggestfk: soussuggestfk,
          categoriesuggestfk: categoriesuggestfk,
        };
        Model.suggestionProduit.create(data).then((response) => {
          if (response !== null) {
            return res.status(200).json({
              success: true,
              message: "demande bien envoyer",
            });
          } else {
            return res.status(400).json({
              success: false,
              message: " error to send Demende",
            });
          }
        });
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
      await Model.suggestionProduit
        .findAll({
          include: [Model.Souscategorie, Model.categorie, Model.user],
        })
        .then((suggestionProduit) => {
          if (suggestionProduit !== null) {
            return res.status(200).json({
              success: true,
              suggestionProduit: suggestionProduit,
            });
          } else {
            return res.status(200).json({
              success: true,
              suggestionProduit: 0,
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
module.exports = suggestionProduitController;
