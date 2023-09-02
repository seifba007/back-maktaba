const { where } = require("sequelize");
const Model = require("../Models/index");
const { codepromoValidation } = require("../middleware/auth/validationSchema");
const codePromo = {
  add: async (req, res) => {
    const { userName,  pourcentage, labrairieId, partenaireId } = req.body;
    try {
      const code = Math.floor(Math.random() * 9000) + userName;

      let data = {
        code: code,
        userName: userName,
        pourcentage: pourcentage,
        labrairieId: labrairieId,
        partenaireId: partenaireId,
      };

      Model.codePromo.create(data).then((response) => {
        if (response !== null) {
          return res.status(200).json({
            success: true,
            message: " code created",
            code: response,
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

  update: async (req, res) => {
    try {
      Model.codePromo
        .update(
          { pourcentage: req.body.pourcentage },
          {
            where: {
              id: req.params.id,
            },
          }
        )
        .then((response) => {
          if (response !== 0) {
            return res.status(200).json({
              success: true,
              message: " update done ! ",
            });
          } else {
            return res.status(400).json({
              success: false,
              error: "error update ",
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
          where: { code: req.params.code },
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
    try {
      Model.codePromo.findAll().then((response) => {
        if (response !== null) {
          res.status(200).json({
            success: true,
            codes: response,
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


  findCodeOrPartenaire: async (req, res) => {
    const {codeName, partenaireId} = req.query
    if(codeName){
      try {
        Model.codePromo.findAll({
          where: {
            code: codeName
          }
        }).then((response) => {
          if (response !== null) {
            res.status(200).json({
              success: true,
              codes: response,
            });
          }
        });
      } catch (err) {
        return res.status(400).json({
          success: false,
          error: err,
        });
      }
    }if(partenaireId){
      try {
        Model.codePromo.findAll({
          include:[
            {
              model: Model.partenaire,
              where: {
                id: partenaireId
              },
              attributes:["nameetablissement"]
              
            }
          ]
         
        }).then((response) => {
          if (response !== null) {
            res.status(200).json({
              success: true,
              codes: response,
            });
          }
        });
      } catch (err) {
        return res.status(400).json({
          success: false,
          error: err,
        });
      }
    }
  },
};
module.exports = codePromo;
