const { response } = require("express");
const Model = require("../Models/index");
const offreController = {
    AddOffre: async (req, res) => {
        try {
          const {Description ,echangeofffk, labofffk } = req.body;
    
          const offre = await Model.offre.create({
            Description: Description,
            echangeofffk: echangeofffk,
            labofffk: labofffk,
          });
    
          const produitsaechange = req.body.produitsaechange;
          for (const produit of produitsaechange) {
            await Model.produitaechange.create({
              Name: produit.name,
              Qte: produit.quantite,
              offreprodaechk: offre.id,
            });
          }
    
          const produitsechange = req.body.produitsechange;
          for (const produit of produitsechange) {
            await Model.produitechange.create({
              Name: produit.name,
              Qte: produit.quantite,
              offreprodechk: offre.id,
            });
          }
    
          res.status(201).json({
            offre: offre,
            message: "Offre créé avec succès",
          });
        } catch (error) {
          console.error(error);
          res
            .status(400)
            .json({ error: "Erreur lors de la création de cette offre" });
        }
      },
      findAllOffre: async (req, res) => {
        const { sortBy, sortOrder, page, pageSize} = req.query;
    
        const offset = (page - 1) * pageSize;
        const order = [[sortBy, sortOrder === "desc" ? "DESC" : "ASC"]];
          try {
            const totalCounttout = await Model.offre.count({ });
            const offres = await Model.offre.findAll({
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
              ],
              attributes: {
                exclude: ["updatedAt"],
              },
            });
            if (offres.length > 0) {
              const totalPages = Math.ceil(totalCounttout / pageSize);
              return res.status(200).json({
                success: true,
                offres: offres,
                totalPages: totalPages,
              });
            } else {
              return res.status(400).json({
                success: false,
                err: "Aucune offre trouvée.",
              });
            }
          } catch (err) {
            return res.status(400).json({
              success: false,
              error: err.message,
            });
          }
        
      },

      findOffrebyechange: async (req, res) => {
        const { sortBy, sortOrder, page, pageSize} = req.query;
    
        const offset = (page - 1) * pageSize;
        const order = [[sortBy, sortOrder === "desc" ? "DESC" : "ASC"]];
          try {
            const totalCounttout = await Model.offre.count({
              where:{
                echangeofffk: req.params.id
              },
             });
            const offres = await Model.offre.findAll({
              offset: offset,
              order: order,
              limit: +pageSize,
              where:{
                echangeofffk: req.params.id
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
            if (offres.length > 0) {
              const totalPages = Math.ceil(totalCounttout / pageSize);
              return res.status(200).json({
                success: true,
                offres: offres,
                totalPages: totalPages,
              });
            } else {
              return res.status(400).json({
                success: false,
                err: "Aucune offre trouvée pour cette echange.",
              });
            }
          } catch (err) {
            return res.status(400).json({
              success: false,
              error: err.message,
            });
          }
        
      },

      findOffrebylibrarire: async (req, res) => {
        const { sortBy, sortOrder, page, pageSize} = req.query;
    
        const offset = (page - 1) * pageSize;
        const order = [[sortBy, sortOrder === "desc" ? "DESC" : "ASC"]];
          try {
            const totalCounttout = await Model.offre.count({
              where:{
                labofffk: req.params.id
              },
             });
            const offres = await Model.offre.findAll({
              offset: offset,
              order: order,
              limit: +pageSize,
              where:{
                labofffk: req.params.id
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
            if (offres.length > 0) {
              const totalPages = Math.ceil(totalCounttout / pageSize);
              return res.status(200).json({
                success: true,
                offres: offres,
                totalPages: totalPages,
              });
            } else {
              return res.status(400).json({
                success: false,
                err: "Aucune offre trouvée pour cette librarire.",
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

module.exports = offreController;