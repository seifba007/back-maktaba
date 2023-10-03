const { response } = require("express");
const Model = require("../Models/index");
const echangeController = {
  AddEchange: async (req, res) => {
    try {
      const { labechfk, clientechfk } = req.body;

      const echange = await Model.echange.create({
        Etat: "En_attente",
        labechfk: labechfk,
        clientechfk: clientechfk,
      });

      const produitsaechange = req.body.produitsaechange;
      for (const produit of produitsaechange) {
        await Model.produitaechange.create({
          Name: produit.name,
          Qte: produit.quantite,
          echangeprodaechk: echange.id,
        });
      }

      const produitsechange = req.body.produitsechange;
      for (const produit of produitsechange) {
        await Model.produitechange.create({
          Name: produit.name,
          Qte: produit.quantite,
          echangeprodechk: echange.id,
        });
      }

      res.status(201).json({
        echange: echange,
        message: "Echange créé avec succès",
      });
    } catch (error) {
      console.error(error);
      res
        .status(400)
        .json({ error: "Erreur lors de la création de cet échange" });
    }
  },
  Accepter: async (req, res) => {
    try {
      const type = await Model.echange.findAll({
        where: { id: req.params.id },
      });
      Model.echange
        .update({ Etat: "Résolue" }, { where: { id: req.params.id } })
        .then((response) => {
          if (response !== 0) {
            return res.status(200).json({
              success: true,
              message: "Echange accepte",
            });
          } else {
            return res.status(400).json({
              success: false,
              message: "error accepte echange ",
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

  Annuler: async (req, res) => {
    try {
      const type = await Model.echange.findAll({
        where: { id: req.params.id },
      });
      Model.echange
        .update({ Etat: "Annulée" }, { where: { id: req.params.id } })
        .then((response) => {
          if (response !== 0) {
            return res.status(200).json({
              success: true,
              message: "Echange annulée",
            });
          } else {
            return res.status(400).json({
              success: false,
              message: "error annulation echange ",
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

  findEchangeLibrarire: async (req, res) => {
    const { sortBy, sortOrder, page, pageSize, etatechange } = req.query;

    const offset = (page - 1) * pageSize;
    const order = [[sortBy, sortOrder === "desc" ? "DESC" : "ASC"]];
    if (etatechange == "tout") {
      try {
        const totalCounttout = await Model.echange.count({
          where:{
            labechfk: req.params.id
          },
        });
        const echanges = await Model.echange.findAll({
          offset: offset,
          order: order,
          limit: +pageSize,
          where:{
            labechfk: req.params.id
          },
          include: [
            {
              model: Model.produitaechange,
            },
            {
              model: Model.produitechange,
            },
          ],
          attributes: {
            exclude: ["updatedAt"],
          },
        });
        if (echanges.length > 0) {
          const totalPages = Math.ceil(totalCounttout / pageSize);
          return res.status(200).json({
            success: true,
            echanges: echanges,
            totalPages: totalPages,
          });
        } else {
          return res.status(400).json({
            success: false,
            err: "Aucune echange trouvée.",
          });
        }
      } catch (err) {
        return res.status(400).json({
          success: false,
          error: err.message,
        });
      }
    } else {
      try {
        const totalCounttout = await Model.echange.count({
          where: {
            labechfk: req.params.id,
            Etat: etatechange,
          },
        });
        const echanges = await Model.echange.findAll({
          offset: offset,
          order: order,
          limit: +pageSize,
          where: {
            labechfk: req.params.id,
            Etat: etatechange,
          },
          include: [
            {
              model: Model.produitaechange,
            },
            {
              model: Model.produitechange,
            },
          ],
          attributes: {
            exclude: ["updatedAt"],
          },
        });
        if (echanges.length > 0) {
          const totalPages = Math.ceil(totalCounttout / pageSize);
          return res.status(200).json({
            success: true,
            echanges: echanges,
            totalPages: totalPages,
          });
        } else {
          return res.status(400).json({
            success: false,
            err: "Aucune echange trouvée.",
          });
        }
      } catch (err) {
        return res.status(400).json({
          success: false,
          error: err.message,
        });
      }
    }
  },

  findEchangeClient: async (req, res) => {
    const { sortBy, sortOrder, page, pageSize, etatechange } = req.query;

    const offset = (page - 1) * pageSize;
    const order = [[sortBy, sortOrder === "desc" ? "DESC" : "ASC"]];
    if (etatechange == "tout") {
      try {
        const totalCounttout = await Model.echange.count({
          where:{
            clientechfk: req.params.id
          },
        });
        const echanges = await Model.echange.findAll({
          offset: offset,
          order: order,
          limit: +pageSize,
          where:{
            clientechfk: req.params.id
          },
          include: [
            {
              model: Model.produitaechange,
            },
            {
              model: Model.produitechange,
            },
          ],
          attributes: {
            exclude: ["updatedAt"],
          },
        });
        if (echanges.length > 0) {
          const totalPages = Math.ceil(totalCounttout / pageSize);
          return res.status(200).json({
            success: true,
            echanges: echanges,
            totalPages: totalPages,
          });
        } else {
          return res.status(400).json({
            success: false,
            err: "Aucune echange trouvée.",
          });
        }
      } catch (err) {
        return res.status(400).json({
          success: false,
          error: err.message,
        });
      }
    } else {
      try {
        const totalCounttout = await Model.echange.count({
          where: {
            clientechfk: req.params.id,
            Etat: etatechange,
          },
        });
        const echanges = await Model.echange.findAll({
          offset: offset,
          order: order,
          limit: +pageSize,
          where: {
            clientechfk: req.params.id,
            Etat: etatechange,
          },
          include: [
            {
              model: Model.produitaechange,
            },
            {
              model: Model.produitechange,
            },
          ],
          attributes: {
            exclude: ["updatedAt"],
          },
        });
        if (echanges.length > 0) {
          const totalPages = Math.ceil(totalCounttout / pageSize);
          return res.status(200).json({
            success: true,
            echanges: echanges,
            totalPages: totalPages,
          });
        } else {
          return res.status(400).json({
            success: false,
            err: "Aucune echange trouvée.",
          });
        }
      } catch (err) {
        return res.status(400).json({
          success: false,
          error: err.message,
        });
      }
    }
  },

  findAllEchange: async (req, res) => {
    const { sortBy, sortOrder, page, pageSize, etatechange } = req.query;

    const offset = (page - 1) * pageSize;
    const order = [[sortBy, sortOrder === "desc" ? "DESC" : "ASC"]];
    if (etatechange == "tout") {
      try {
        const totalCounttout = await Model.echange.count({});
        const echanges = await Model.echange.findAll({
          offset: offset,
          order: order,
          limit: +pageSize,
          include: [
            {
              model: Model.produitaechange,
            },
            {
              model: Model.produitechange,
            },
            {
              model: Model.labrairie,
            },
            {
              model: Model.client,
            },
          ],
          attributes: {
            exclude: ["updatedAt"],
          },
        });
        if (echanges.length > 0) {
          const totalPages = Math.ceil(totalCounttout / pageSize);
          return res.status(200).json({
            success: true,
            echanges: echanges,
            totalPages: totalPages,
          });
        } else {
          return res.status(400).json({
            success: false,
            err: "Aucune echange trouvée.",
          });
        }
      } catch (err) {
        return res.status(400).json({
          success: false,
          error: err.message,
        });
      }
    } else {
      try {
        const totalCounttout = await Model.echange.count({
          where: {
            Etat: etatechange,
          },
        });
        const echanges = await Model.echange.findAll({
          offset: offset,
          order: order,
          limit: +pageSize,
          where: {
            Etat: etatechange,
          },
          include: [
            {
              model: Model.produitaechange,
            },
            {
              model: Model.produitechange,
            },
            {
              model: Model.labrairie,
            },
            {
              model: Model.client,
            },
          ],
          attributes: {
            exclude: ["updatedAt"],
          },
        });
        if (echanges.length > 0) {
          const totalPages = Math.ceil(totalCounttout / pageSize);
          return res.status(200).json({
            success: true,
            echanges: echanges,
            totalPages: totalPages,
          });
        } else {
          return res.status(400).json({
            success: false,
            err: "Aucune echange trouvée.",
          });
        }
      } catch (err) {
        return res.status(400).json({
          success: false,
          error: err.message,
        });
      }
    }
  },

  deleteEchange: async (req, res) => {
    const { ids } = req.body;
    try {
      Model.echange
        .destroy({
          where: {
            id: ids,
          },
        })
        .then((response) => {
          if (response !== null) {
            return res.status(200).json({
              success: true,
              message: "Echanges Deleted",
            });
          } else {
            return res.status(400).json({
              success: false,
              err: "Deleted Failed",
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

module.exports = echangeController;
