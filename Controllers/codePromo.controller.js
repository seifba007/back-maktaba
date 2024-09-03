const { where } = require("sequelize");
const Model = require("../Models/index");
const { Sequelize } = require("sequelize");
const { codepromoValidation } = require("../middleware/auth/validationSchema");
const codeClient = require("../Models/codeClient");
const codePromo = {
  add: async (req, res) => {
    const { code, categories, labcodeprfk, partcodeprfk, fourcodeprfk } = req.body;
  
    function generateRandomCode() {
      let code = "";
      const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      for (let i = 0; i < 8; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        code += characters[randomIndex];
      }
      return code;
    }
  
    try {
      let newPromo = null;
      let generatedCode = code;
  
      if (!code) {
        generatedCode = generateRandomCode();
      } else {
        if (code.length !== 8) {
          return res.status(400).json({
            success: false,
            message: "The code must be exactly 8 characters long.",
          });
        }
  
        const validCodePattern = /^[A-Z0-9]+$/;
        if (!validCodePattern.test(code)) {
          return res.status(400).json({
            success: false,
            message: "The code must contain only uppercase letters and numbers.",
          });
        }
  
        const existingCode = await Model.codePromo.findOne({
          where: { code: code },
        });
  
        if (existingCode) {
          return res.status(400).json({
            success: false,
            message: "Code already exists.",
          });
        }
      }
  
      let data = {
        code: generatedCode,
        labcodeprfk: labcodeprfk,
        partcodeprfk: partcodeprfk,
        fourcodeprfk: fourcodeprfk,
        etat: "Non_Confirmer",
      };
  
      newPromo = await Model.codePromo.create(data);
  
      for (const category of categories) {
        const categoryRecord = await Model.categorie.findOne({
          where: { id: category.id },
        });
  
        if (!categoryRecord) {
          return res.status(400).json({
            success: false,
            message: `Category with ID ${category.id} does not exist.`,
          });
        }
        await Model.codePromocategory.create({
          promocodeid: newPromo.id,
          ctagorieid: categoryRecord.id,
          discountPercentage: category.discountPercentage,
        });
      }
  
      return res.status(200).json({
        success: true,
        message: "Code created and associated with categories successfully.",
        code: newPromo,
      });
    } catch (err) {
      return res.status(400).json({
        success: false,
        error: err.message,
      });
    }
  },
  

  addmanual: async (req, res) => {
    const {
      code,
      userName,
      pourcentage,
      labcodeprfk,
      partcodeprfk,
      fourcodeprfk,
    } = req.body;

    try {
      if (code.length !== 8) {
        return res.status(400).json({
          success: false,
          message: "The code must be exactly 8 characters long.",
        });
      }

      const validCodePattern = /^[A-Z0-9]+$/;
      if (!validCodePattern.test(code)) {
        return res.status(400).json({
          success: false,
          message: "The code must contain only uppercase letters and numbers.",
        });
      }
      const existingCode = await Model.codePromo.findOne({
        where: { code: code },
      });

      if (existingCode) {
        return res.status(400).json({
          success: false,
          message: "Code already exists",
        });
      }

      let data = {
        code: code,
        userName: userName,
        pourcentage: pourcentage,
        labcodeprfk: labcodeprfk,
        partcodeprfk: partcodeprfk,
        fourcodeprfk: fourcodeprfk,
        etat: "Non_Confirmer",
      };

      const response = await Model.codePromo.create(data);

      if (response !== null) {
        return res.status(200).json({
          success: true,
          message: "Code created successfully",
          code: response,
        });
      }
    } catch (err) {
      return res.status(400).json({
        success: false,
        error: err,
      });
    }
  },

  update: async (req, res) => {
    try {
        const { pourcentage, etat, categories } = req.body;
        const update = {};

        if (pourcentage) {
            update.pourcentage = pourcentage;
        }

        if (etat) {
            update.etat = etat;
        }

        const updatedPromo = await Model.codePromo.update(update, {
            where: {
                id: req.params.id,
            },
        });

        if (updatedPromo[0] === 0) {
            return res.status(400).json({
                success: false,
                error: "Error updating promo code",
            });
        }

        if (categories && categories.length > 0) {
            await Model.codePromocategory.destroy({
                where: { promocodeid: req.params.id },
            });

            for (const category of categories) {
                const categoryRecord = await Model.categorie.findOne({
                    where: { id: category.id },
                });

                if (!categoryRecord) {
                    return res.status(400).json({
                        success: false,
                        message: `Category with ID ${category.id} does not exist.`,
                    });
                }

                await Model.codePromocategory.create({
                    promocodeid: req.params.id,
                    ctagorieid: categoryRecord.id,
                    discountPercentage: category.discountPercentage,
                });
            }
        }

        return res.status(200).json({
            success: true,
            message: "Promo code and associated categories updated successfully!",
        });

    } catch (err) {
        return res.status(400).json({
            success: false,
            error: err.message,
        });
    }
},


  delete: async (req, res) => {
    try {
      Model.codePromo
        .destroy({
          where: {
            id: req.params.id,
          },
        })
        .then((reponse) => {
          if (reponse !== 0) {
            res.status(200).json({
              success: true,
              message: " codePromo delete",
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

  findOne: async (req, res) => {
    try {
      Model.codePromo
        .findOne({
          where: { id: req.params.id },
          include: [
            {
              model: Model.labrairie,
              attributes: ["id"],
              include: [{ model: Model.user, attributes: ["fullname"] }],
            },
            {
              model: Model.partenaire,
              attributes: ["id"],
              include: [{ model: Model.user, attributes: ["fullname"] }],
            },
          ],
        })
        .then((response) => {
          if (response !== null) {
            res.status(200).json({
              success: true,
              code: response,
            });
          } else {
            res.status(200).json({
              success: false,
              err: "code introuvable",
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

  findAll: async (req, res) => {
    const { sortBy, sortOrder, page, pageSize } = req.query;
    const offset = (page - 1) * pageSize;
    const order = [[sortBy, sortOrder === "desc" ? "DESC" : "ASC"]];
    try {
      const codePromocount = await Model.codePromo.count();
      Model.codePromo
        .findAll({
          limit: +pageSize,
          offset: offset,
          order: order,
        })
        .then((response) => {
          if (response !== null) {
            const totalPages = Math.ceil(codePromocount / pageSize);
            res.status(200).json({
              success: true,
              bonAchat: response,
              totalPages: totalPages,
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

  findByuser: async (req, res) => {
    const { sortBy, sortOrder, page, pageSize, etat } = req.query;
    const offset = (page - 1) * pageSize;
    const order = [[sortBy, sortOrder === "desc" ? "DESC" : "ASC"]];
    let whereClause = { usercodefk: req.params.id };
    try {
      if (etat && etat === "tout") {
        whereClause.etat = {
          [Sequelize.Op.or]: ["Non_Confirmer", "Valider"],
        };
      } else if (etat && etat !== "tout") {
        whereClause.etat = etat;
      }

      const totalCount = await Model.codePromo.count({
        where: whereClause,
      });

      Model.codePromo
        .findAll({
          offset: offset,
          order: order,
          limit: +pageSize,
          where: whereClause,
          include: [
            {
              model: Model.partenaire,
              attributes: ["id", "nameetablissement"],
              include: [
                { model: Model.user, attributes: ["fullname", "avatar"] },
              ],
            },
            {
              attributes: ["id"],
              include: [
                { model: Model.user, attributes: ["fullname", "avatar"] },
              ],
            },
            {
              model: Model.labrairie,
              attributes: ["id", "nameLibrairie"],
              include: [
                { model: Model.user, attributes: ["fullname", "avatar"] },
              ],
            },
          ],
        })
        .then((response) => {
          const totalPages = Math.ceil(totalCount / pageSize);
          if (response !== null) {
            res.status(200).json({
              success: true,
              bonAchat: response,
              totalPages: totalPages,
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

  findBypartenaire: async (req, res) => {
    const { sortBy, sortOrder, page, pageSize, etat } = req.query;
    const offset = (page - 1) * pageSize;
    const order = [[sortBy, sortOrder === "desc" ? "DESC" : "ASC"]];
    let whereClause = { partcodeprfk: req.params.id };
    if (etat && etat === "tout") {
      whereClause.etat = {
        [Sequelize.Op.or]: ["Non_Confirmer", "Valider"],
      };
    } else if (etat && etat !== "tout") {
      whereClause.etat = etat;
    }

    try {
      const totalCount = await Model.codePromo.count({
        where: whereClause,
      });

      Model.codePromo
        .findAll({
          order: order,
          offset: offset,
          limit: +pageSize,
          where: whereClause,
          include: [
            {
              model: Model.partenaire,
              //attributes: ["fullname", "avatar"],
              include: [
                {
                  model: Model.user,
                },
              ],
            },
          ],
        })
        .then((response) => {
          const totalPages = Math.ceil(totalCount / pageSize);
          if (response !== null) {
            res.status(200).json({
              success: true,
              bonAchat: response,
              totalPages: totalPages,
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

  findBypartenairecommande: async (req, res) => {
    const { sortBy, sortOrder, page, pageSize, etat } = req.query;
    const offset = (page - 1) * pageSize;
    const order = [[sortBy, sortOrder === "desc" ? "DESC" : "ASC"]];
    let whereClause = { clienthiscodeprfk: req.params.id };
    if (etat && etat === "tout") {
      whereClause.etat = {
        [Sequelize.Op.or]: ["Non_Confirmer", "Valider"],
      };
    } else if (etat && etat !== "tout") {
      whereClause.etat = etat;
    }

    try {
      const totalCount = await Model.historycodePromo.count({
        where: whereClause,
      });

      Model.historycodePromo
        .findAll({
          order: order,
          offset: offset,
          limit: +pageSize,
          where: whereClause,
          group: ['parthiscodeprfk'], 
          include: [
            {
              model: Model.partenaire,
              //attributes: ["fullname", "avatar"],
              include: [
                {
                  model: Model.user,
                },
              ],
            },
          ],
        })
        .then((response) => {
          const totalPages = Math.ceil(totalCount / pageSize);
          if (response !== null) {
            res.status(200).json({
              success: true,
              commandes: response,
              totalPages: totalPages,
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

  findBycode: async (req, res) => {
    const { sortBy, sortOrder, page, pageSize, code, etat } = req.query;
    const offset = (page - 1) * pageSize;
    const order = [[sortBy, sortOrder === "desc" ? "DESC" : "ASC"]];
    let whereClause = { code: code };
    if (etat && etat === "tout") {
      whereClause.etat = {
        [Sequelize.Op.or]: ["Non_Confirmer", "Valider"],
      };
    } else if (etat && etat !== "tout") {
      whereClause.etat = etat;
    }

    try {
      const totalCount = await Model.codePromo.count({
        where: whereClause,
      });

      Model.codePromo
        .findAll({
          order: order,
          offset: offset,
          limit: +pageSize,
          where: whereClause,
          include: [
            {
              model: Model.partenaire,
              //attributes: ["fullname", "avatar"],
              include: [
                {
                  model: Model.user,
                },
              ],
            },
          ],
        })
        .then((response) => {
          const totalPages = Math.ceil(totalCount / pageSize);
          if (response !== null) {
            res.status(200).json({
              success: true,
              bonAchat: response,
              totalPages: totalPages,
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

  findBylibrairie: async (req, res) => {
    const { sortBy, sortOrder, page, pageSize, etat } = req.query;
    const offset = (page - 1) * pageSize;
    const order = [[sortBy, sortOrder === "desc" ? "DESC" : "ASC"]];
    let whereClause = { labbonachafk: req.params.id };
    try {
      if (etat && etat === "tout") {
        whereClause.etat = {
          [Sequelize.Op.or]: ["Non_Valide", "Valide"],
        };
      } else if (etat && etat !== "tout") {
        whereClause.etat = etat;
      }
      const totalCount = await Model.bonAchat.count({
        where: whereClause,
      });

      Model.bonAchat
        .findAll({
          order: order,
          offset: offset,
          limit: +pageSize,
          where: whereClause,
          include: [
            {
              model: Model.user,
              attributes: ["fullname", "avatar"],
              include: [Model.labrairie],
            },
          ],
        })
        .then((response) => {
          const totalPages = Math.ceil(totalCount / pageSize);
          if (response !== null) {
            res.status(200).json({
              success: true,
              bonAchat: response,
              totalPages: totalPages,
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

  findByfournisseurs: async (req, res) => {
    const { sortBy, sortOrder, page, pageSize, etat } = req.query;
    const offset = (page - 1) * pageSize;
    const order = [[sortBy, sortOrder === "desc" ? "DESC" : "ASC"]];
    let whereClause = { fourbonachafk: req.params.id };
    if (etat && etat === "tout") {
      whereClause.etat = {
        [Sequelize.Op.or]: ["Non_Valide", "Valide"],
      };
    } else if (etat && etat !== "tout") {
      whereClause.etat = etat;
    }

    try {
      const totalCount = await Model.bonAchat.count({
        where: whereClause,
      });

      Model.bonAchat
        .findAll({
          order: order,
          offset: offset,
          limit: +pageSize,
          where: whereClause,
          include: [
            {
              model: Model.user,
              attributes: ["fullname", "avatar"],
              include: [Model.client, Model.fournisseur, Model.labrairie],
            },
          ],
        })
        .then((response) => {
          const totalPages = Math.ceil(totalCount / pageSize);
          if (response !== null) {
            res.status(200).json({
              success: true,
              bonAchat: response,
              totalPages: totalPages,
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
module.exports = codePromo;
