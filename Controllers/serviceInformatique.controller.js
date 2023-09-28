const { response } = require("express");
const Model = require("../Models/index");
const cloudinary = require("../middleware/cloudinary");
const { Sequelize, where, Op, or } = require("sequelize");
const sendMail = require("../config/Noemailer.config");
const serviceInformatiqueController = {
  addServiceInfo: async (req, res) => {
    try {
      const {
        fullname,
        telephone,
        email,
        Type_service,
        Description,
        adminservInfofk,
 
      } = req.body;

      let imageUrl = "";

      req.files.forEach(async (file) => {
        const result = await cloudinary.uploader.upload(file.path);
        imageUrl = result.secure_url;
        const serviceInformatique = await Model.serviceInformatique.create({
          fullname: fullname,
          telephone: telephone,
          email: email,
          Type_service: Type_service,
          Fichier: imageUrl,
          Description: Description,
          Etat: "En attente",
          adminservInfofk: adminservInfofk,
        });
        res.status(200).json(serviceInformatique);
      });
    } catch (error) {
      console.error(error);
      res
        .status(400)
        .json({ error: "Erreur lors de la création de ce service" });
    }
  },

  Accepter: async (req, res) => {
    try {
      const type = await Model.serviceInformatique.findAll( {
        where: { id: req.params.id }
      })
      Model.serviceInformatique
        .update(
          { Etat: "Résolu" },
          { where: { id: req.params.id } }
        )
        .then((response) => {
          if (response !== 0) {
           
            sendMail.sendAccepterService(req.body.email,type[0].dataValues.Type_service)
            return res.status(200).json({
              success: true,
              message: "Service accepte",
            });
          } else {
            return res.status(400).json({
              success: false,
              message: "error accepte service ",
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
      const type = await Model.serviceInformatique.findAll( {
        where: { id: req.params.id }
      })
      Model.serviceInformatique
        .update(
          { Etat: "Annuler" },
          { where: { id: req.params.id } }
        )
        .then((response) => {
          if (response !== 0) {
            sendMail.sendAnnulerService(req.body.email,type[0].dataValues.Type_service)
            return res.status(200).json({
              success: true,
              message: "Service Annulée",
            });
          } else {
            return res.status(400).json({
              success: false,
              message: "error annulation service ",
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

  findAllServices: async (req, res) => {
    const { sortBy, sortOrder, page, pageSize } = req.query;

    const offset = (page - 1) * pageSize;
    const order = [[sortBy, sortOrder === "desc" ? "DESC" : "ASC"]];
    try {
        const totalCounttout = await Model.serviceInformatique.count({});
        const services = await Model.serviceInformatique.findAll({
          offset: offset,
          order: order,
          limit: +pageSize,
          attributes: {
            exclude: ["updatedAt"],
          },
          include: [
            {
              model: Model.labrairie,
              attributes: ["id", "nameLibrairie", "imageStore"],
            },
            {
              model: Model.user,  
       
              attributes: {
                exclude: ["password","email_verifie","Date_de_naissance","point","etatCompte"],
              },
            },
          ],
        });
        if (services.length > 0) {
          const totalPages = Math.ceil(totalCounttout / pageSize);
          return res.status(200).json({
            success: true,
            services: services,
            totalPages: totalPages,
          });
        } else {
          return res.status(400).json({
            success: false,
            err: "Aucune service trouvée.",
          });
        
      }
    } catch (err) {
      return res.status(400).json({
        success: false,
        error: err.message,
      });
    }
  },

  deleteServiceInfo: async (req, res) => {
    const { ids } = req.body;
    try {
      Model.serviceInformatique
        .destroy({
          where: {
            id: ids,
          },
        })
        .then((response) => {
          if (response !== null) {
            return res.status(200).json({
              success: true,
              message: "Services Deleted",
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

module.exports = serviceInformatiqueController;
