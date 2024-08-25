const { response } = require("express");
const Model = require("../Models/index");
const cloudinary = require("../middleware/cloudinary");
const mediaController = {
  Addmedia: async (req, res) => {
    try {
      const { texte, image, description, police,taille } = req.body;
      let media = null;

      if (!req.files || req.files.length === 0) {
        media = await Model.media.create({
          texte: texte,
          description: description,
          police: police,
          taille: taille,
          Etat: "Valider",
        });

        return res.status(200).json({
          success: true,
          message: "Media created successfully without images",
          media,
        });
      }

      const uploadedFiles = await Promise.all(
        req.files.map(async (file) => {
          try {
            const result = await cloudinary.uploader.upload(file.path);
            return result.secure_url;
          } catch (error) {
            throw new Error(`File upload failed: ${error.message}`);
          }
        })
      );

      media = await Model.media.create({
        image:uploadedFiles.join(","),
        texte: texte,
        description: description,
        police: police,
        taille: taille,
        Etat: "Valider",
      });

      res.status(201).json({
        media: media,
        message: "Media créé avec succès",
      });
    } catch (error) {
      console.error(error);
      res
        .status(400)
        .json({ error: "Erreur lors de la création de cette media" });
    }
  },
  findAllmedia: async (req, res) => {
    const { sortBy, sortOrder, page, pageSize } = req.query;

    const offset = (page - 1) * pageSize;
    const order = [[sortBy, sortOrder === "desc" ? "DESC" : "ASC"]];
    try {
      const totalCounttout = await Model.media.count({});
      const media = await Model.media.findAll({
        offset: offset,
        order: order,
        limit: +pageSize,
      });
      if (media.length > 0) {
        const totalPages = Math.ceil(totalCounttout / pageSize);
        return res.status(200).json({
          success: true,
          media: media,
          totalPages: totalPages,
        });
      } else {
        return res.status(400).json({
          success: false,
          err: "Aucune media trouvée.",
        });
      }
    } catch (err) {
      return res.status(400).json({
        success: false,
        error: err.message,
      });
    }
  },

  findonemedia: async (req, res) => {
    try {
      const media = await Model.media.findAll({
        where: {
          id: req.params.id,
        },
      });
      if (media.length > 0) {
        return res.status(200).json({
          success: true,
          media: media,
        });
      } else {
        return res.status(400).json({
          success: false,
          err: "Aucune media trouvée.",
        });
      }
    } catch (err) {
      return res.status(400).json({
        success: false,
        error: err.message,
      });
    }
  },

  update: async (req, res) => {
    try {
      const { texte, description, police, taille } = req.body;
  
      const updateData = {};
  
      if (texte !== undefined) updateData.texte = texte;
      if (description !== undefined) updateData.Description = description;
      if (police !== undefined) updateData.police = police;
      if (taille !== undefined) updateData.taille = taille;
  
      updateData.Etat = "Accepter";
  
      if (req.files && req.files.length > 0) {
        const uploadedFiles = await Promise.all(
          req.files.map(async (file) => {
            try {
              const result = await cloudinary.uploader.upload(file.path);
              return result.secure_url;
            } catch (error) {
              throw new Error(`File upload failed: ${error.message}`);
            }
          })
        );
  
        updateData.image = uploadedFiles.join(",");
      }
  
      const response = await Model.media.update(updateData, {
        where: { id: req.params.id }
      });
  
      if (response[0] !== 0) { 
        return res.status(200).json({
          success: true,
          message: "Media updated successfully",
        });
      } else {
        return res.status(400).json({
          success: false,
          message: "Error updating media",
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

module.exports = mediaController;
