const { response } = require("express");
const Model = require("../Models/index");
const { Sequelize } = require("sequelize");
const commandeEnGrosController = {
  add: async (req, res) => {
    try {
      const { total_ttc, fourcomgrofk, labrcomgrofk } = req.body;
      const data = {
        total_ttc: total_ttc,
        etat: "en_cours",
        fourcomgrofk: fourcomgrofk,
        labrcomgrofk: labrcomgrofk,
      };

      Model.commandeEnGros.create(data).then((response) => {});
      return res.status(200).json({
        success: true,
        message: " add commande en gros Done !!",
      });
    } catch (err) {
      return res.status(400).json({
        success: false,
        error: err.message,
      });
    }
  },

  addcommandegros: async (req, res) => {
    const { commande } = req.body;
    try {
      commande.map((data) => {
        let commandes = {
          total_ttc: data.total_ttc,
          etatlabrairie: "en cours",
          etatfournisseur: "Nouveau",
          Adresse: data.Adresse,
          Mode_liv: data.Mode_liv,
          Mode_pay: data.Mode_pay,
          fourcomgrofk: data.fourcomgrofk,
          labrcomgrofk: data.labrcomgrofk,
        };
        Model.commandeEnGros.create(commandes).then((response) => {
          if (response !== null) {
            data.produits.map((e) => {
              e.comgrosprodfourrfk = response.id;
            });
            Model.ProduitCommandeEnGros.bulkCreate(data.produits).then(
              (response) => {
                data.produits.map((e) => {
                  Model.produitfournisseur
                    .findByPk(e.prodfourcommgrosfk)
                    .then((produit) => {
                      if (produit !== null) {
                        let updatedQte = produit.qte - e.Qte;
                        if (updatedQte < 0) {
                          updatedQte = 0;
                        }
                        return Model.produitfournisseur.update(
                          { qte: updatedQte },
                          { where: { id: e.prodfourcommgrosfk } }
                        );
                      }
                    });
                });
              }
            );
          } else {
            return res.status(400).json({
              success: false,
              message: " error lorsque l'ajoute de commande",
            });
          }
        });
      });
      return res.status(200).json({
        success: true,
        message: " add commande en  gros  Done !!",
      });
    } catch (err) {
      return res.status(400).json({
        success: false,
        error: err.message,
      });
    }
  },
  findcommandeByLabriarie: async (req, res) => {
    try {
      Model.commandeEnGros
        .findAll({
          where: { labrairieId: req.params.id },
          include: [
            {
              model: Model.fournisseur,
              attributes: ["id"],
              include: [{ model: Model.user, attributes: ["fullname"] }],
            },
            {
              model: Model.produit,
              attributes: [
                "titre",
                "description",
                "image",
                "prix",
                "prix_en_gros",
              ],
            },
          ],
        })
        .then((response) => {
          if (response !== null) {
            return res.status(200).json({
              success: true,
              commande: response,
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
module.exports = commandeEnGrosController;
