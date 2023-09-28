const { response } = require("express");
const Model = require("../Models/index");
const cloudinary = require("../middleware/cloudinary");
const { Sequelize, where, Op, or } = require("sequelize");
const serviceInformatiqueController = {
  addServiceInfo: async (req, res) => {
    try {
      const {
        fullname,
        telephone,
        email,
        Type_service,
        Description,
        userservInfofk,
        labrservInfofk,
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
          userservInfofk: userservInfofk,
          labrservInfofk: labrservInfofk,
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

  findServiceByuser: async (req, res) => {
    const { sortBy, sortOrder, page, pageSize } = req.query;

    const offset = (page - 1) * pageSize;
    const order = [[sortBy, sortOrder === "desc" ? "DESC" : "ASC"]];
    try {
    
        const totalCounttout = await Model.serviceInformatique.count({
          where: {
            userservInfofk: req.params.id,
          },
        });
        const services = await Model.serviceInformatique.findAll({
          offset: offset,
          order: order,
          limit: +pageSize,
          where: {
            userservInfofk: req.params.id,
          },
          attributes: {
            exclude: ["updatedAt", "userservInfofk", "labrcomdetfk"],
          },
          include: [
            {
              model: Model.labrairie,
              attributes: ["id", "nameLibrairie", "imageStore"],
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
            err: "Aucune service trouvée pour cet utilisateur.",
          });
        
      }
    } catch (err) {
      return res.status(400).json({
        success: false,
        error: err.message,
      });
    }
  },

  findServiceByLibrairie: async (req, res) => {
    const { sortBy, sortOrder, page, pageSize } = req.query;

    const offset = (page - 1) * pageSize;
    const order = [[sortBy, sortOrder === "desc" ? "DESC" : "ASC"]];
    try {
    
        const totalCounttout = await Model.serviceInformatique.count({
          where: {
            labrservInfofk: req.params.id,
          },
        });
        const services = await Model.serviceInformatique.findAll({
          offset: offset,
          order: order,
          limit: +pageSize,
          where: {
            labrservInfofk: req.params.id,
          },
          attributes: {
            exclude: ["updatedAt"],
          },
          include: [
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
            err: "Aucune service trouvée pour cette librairie.",
          });
        
      }
    } catch (err) {
      return res.status(400).json({
        success: false,
        error: err.message,
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
