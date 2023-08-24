const Model = require("../Models/index");
const suggestionProduitController = {
  add: async (req, res) => {
    const { Titre, Description, image, userId, SouscategorieId, categorieId } =
      req.body;
    req.body["image"] = req.files[0].filename;
    try {
      const { error } = suggestionProduitController(data);
      if (error) return res.status(400).json(error.details[0].message);

      const data = {
        Titre: Titre,
        Description: Description,
        image: image,
        etat: "en_cours",
        userId: userId,
        SouscategorieId: SouscategorieId,
        categorieId: categorieId,
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
