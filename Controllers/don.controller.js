const { response } = require("express");
const Model = require("../Models/index");
const cloudinary = require("../middleware/cloudinary");
const sendMail = require("../config/Noemailer.config");
const donController = {
  addDon: async (req, res) => {
    try {
      const {
        fullname,
        telephone,
        email,
        Description,
        category,
        nbrelement,
        disponibilite,
        Etatelement,
        admindonfk,
      } = req.body;

      const don = await Model.don.create({
        fullname: fullname,
        telephone: telephone,
        email: email,
        Description: Description,
        category: category,
        nbrelement: nbrelement,
        disponibilite: disponibilite,
        Etatelement: Etatelement,
        Etatdon: "En_attente",
        admindonfk: admindonfk,
      });

      req.files.forEach(async (file) => {
        const result = await cloudinary.uploader.upload(file.path);
        const imageUrl = result.secure_url;
        await Model.imageDon.create({
          Image: imageUrl,
          imagedonfk: don.id,
        });
      });
      res.status(201).json({ 
        don: don,
        message: "Don créé avec succès" 
    });
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: "Erreur lors de la création de ce don" });
    }
  },

  Accepter: async (req, res) => {
    try {
      const type = await Model.don.findAll({
        where: { id: req.params.id },
      });
      Model.don
        .update({ Etatdon: "Reçu" }, { where: { id: req.params.id } })
        .then((response) => {
          if (response !== 0) {
            sendMail.sendAccepterDon(
              req.body.email,
              type[0].dataValues.Description
            );
            return res.status(200).json({
              success: true,
              message: "Don accepte",
            });
          } else {
            return res.status(400).json({
              success: false,
              message: "error accepte don ",
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
      const type = await Model.don.findAll({
        where: { id: req.params.id },
      });
      Model.don
        .update({ Etatdon: "Annuler" }, { where: { id: req.params.id } })
        .then((response) => {
          if (response !== 0) {
            sendMail.sendAnnulerDon(
              req.body.email,
              type[0].dataValues.Description
            );
            return res.status(200).json({
              success: true,
              message: "Don Annulée",
            });
          } else {
            return res.status(400).json({
              success: false,
              message: "error annulation don",
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

  findAllDon: async (req, res) => {
    const { sortBy, sortOrder, page, pageSize, etatdon } = req.query;

    const offset = (page - 1) * pageSize;
    const order = [[sortBy, sortOrder === "desc" ? "DESC" : "ASC"]];
    if (etatdon == "tout") {
      try {
        const totalCounttout = await Model.don.count({});
        const dons = await Model.don.findAll({
          offset: offset,
          order: order,
          limit: +pageSize,
          include:[
            {
                model: Model.imageDon,
                attributes: ["Image"],
              },
          ],
          attributes: {
            exclude: ["updatedAt"],
          },
        });
        if (dons.length > 0) {
          const totalPages = Math.ceil(totalCounttout / pageSize);
          return res.status(200).json({
            success: true,
            dons: dons,
            totalPages: totalPages,
          });
        } else {
          return res.status(400).json({
            success: false,
            err: "Aucune don trouvée.",
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
        const totalCounttout = await Model.don.count({
          where: {
            Etatdon: etatdon,
          },
        });
        const dons = await Model.don.findAll({
          offset: offset,
          order: order,
          limit: +pageSize,
          where: {
            Etatdon: etatdon,
          },
          include:[
            {
                model: Model.imageDon,
                attributes: ["Image"],
              },
          ],
          attributes: {
            exclude: ["updatedAt"],
          },
        });
        if (dons.length > 0) {
          const totalPages = Math.ceil(totalCounttout / pageSize);
          return res.status(200).json({
            success: true,
            dons: dons,
            totalPages: totalPages,
          });
        } else {
          return res.status(400).json({
            success: false,
            err: "Aucune don trouvée.",
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

  deleteDon: async (req, res) => {
    const { ids } = req.body;
    try {
      Model.don
        .destroy({
          where: {
            id: ids,
          },
        })
        .then((response) => {
          if (response !== null) {
            return res.status(200).json({
              success: true,
              message: "Dons Deleted",
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

module.exports = donController;
