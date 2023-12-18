const Model = require("../Models/index");
const {
  suggestionProduitValidation,
} = require("../middleware/auth/validationSchema");
const cloudinary = require("../middleware/cloudinary");
const sendMail = require("../config/Noemailer.config");

const suggestionProduitController = {
  add: async (req, res) => {
    const {
      Titre,
      Description,
      usersuggeprodfk,
      soussuggestfk,
      categoriesuggestfk,
      email,
    } = req.body;
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
    const { sortBy, sortOrder, page, pageSize } = req.query;
    const offset = (page - 1) * pageSize;
    const order = [[sortBy, sortOrder === "desc" ? "DESC" : "ASC"]];
    try {
      const suggestioncount = await Model.suggestionProduit.count({})
      await Model.suggestionProduit
        .findAll({
          limit:+pageSize,
          order:order,
          offset:offset,
          include: [
            { model: Model.Souscategorie },
            { model: Model.categorie },

            {
              model: Model.user,
              attributes: ["email", "role", "fullname", "avatar", "telephone"],
            },
          ],
        })
        .then((suggestionProduit) => {
          if (suggestionProduit !== null) {
            const totalcount = Math.ceil(suggestioncount/pageSize)
            return res.status(200).json({
              success: true,
              suggestionProduit: suggestionProduit,
              totalPages:totalcount
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
        error: err.message,
      });
    }
  },

  AccepterSuggestion: async (req, res) => {
    const {email} = req.body
    try {
      const numUpdated= await Model.suggestionProduit.update(
        { etat: "Accepter" },
        { where: { id: req.params.id } }
      );
  
      if (numUpdated !== 0) {
        const produit = await Model.suggestionProduit.findAll({ where: { id: req.params.id } });
        sendMail.sendSuggestionProduitEmail(email, produit[0].dataValues.Description, produit[0].dataValues.Titre);
        return res.status(200).json({
          success: true,
          message: "Suggestion accepted",
          produit: produit,
        });
      } else {
        return res.status(400).json({
          success: false,
          message: "Suggestion not found or not updated",
        });
      }
    } catch (err) {
      return res.status(400).json({
        success: false,
        error: err.message,
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
              message: "suggestion deleted",
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
