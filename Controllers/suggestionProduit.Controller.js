const Model = require("../Models/index");
const { suggestionProduitValidation } = require("../middleware/auth/validationSchema");
const suggestionProduitController = {
  add: async (req, res) => {
    const { Titre, Description, image, usersuggeprodfk, soussuggestfk, categoriesuggestfk } =
      req.body;
    req.body["image"] = req.files[0];
    try {
      const { error } = suggestionProduitValidation(req.body);
      if (error) return res.status(400).json({ success: false, err: error.details[0].message });

      const data = {
        Titre: Titre,
        Description: Description,
        image: image,
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
