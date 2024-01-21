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

  findAllLivraison: async (req, res) => {
    const { sortBy, sortOrder, page, pageSize, etat, librairiename } = req.query;

    const offset = (page - 1) * pageSize;
    const order = [[sortBy, sortOrder === "desc" ? "DESC" : "ASC"]];
    const wherename = {};
    try {
      let whereClause = { fourcomgrofk: req.params.id };

      if (etat && etat === "tout") {
        whereClause.etat = {
          [Sequelize.Op.or]: ["en_cours", "Compléter"],
        };
      } else if (etat && etat !== "tout") {
        whereClause.etat = etat;
      }

      if (librairiename) {
        wherename.nameLibrairie = {
          [Sequelize.Op.like]: `%${librairiename}%`,
        };

        whereClause = { ...whereClause, "$labrairie.nameLibrairie$": wherename.nameLibrairie};
      }

      const count = await Model.commandeEnGros.count({
        where: whereClause,
        include: [
          {
            model: Model.labrairie,
            where: wherename,
          },
        ],
      });

      const commandes = await Model.commandeEnGros.findAll({
        offset: offset,
        order: order,
        limit: +pageSize,
        where: whereClause,
        include: [
          { model: Model.labrairie, attributes: ["nameLibrairie"],where: wherename, },
          { model: Model.produitlabrairie },
        ],
      });

      if (commandes) {
        const totalPages = Math.ceil(count / pageSize);
        return res.status(200).json({
          success: true,
          livraison: commandes,
          totalPages: totalPages,
        });
      }
    } catch (err) {
      return res.status(400).json({
        success: false,
        error: err.message,
      });
    }
  },
};
module.exports = commandeEnGrosController;
