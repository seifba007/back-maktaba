const Model = require("../Models/index");
const { bonAchatValidation } = require("../middleware/auth/validationSchema");
const bonAchatController = {

  add: async (req, res) => {
    const { solde, userbonachafk, partbonachafk, nbpoint, fourbonachafk, labbonachafk } = req.body;
    try {
      //const { error } = bonAchatValidation(req.body);
      //if (error) return res.status(400).json({ success: false, err: error.details[0].message });
  
      const user = await Model.user.findByPk(userbonachafk);
      if (!user || user.point < nbpoint) {
        return res.status(400).json({
          success: false,
          message: "L'utilisateur n'a pas suffisamment de points pour créer ce bon d'achat",
        });
      }
  
      function generateRandomCode() {
        let code = "#";
        for (let i = 0; i < 7; i++) {
          const randomDigit = Math.floor(Math.random() * 10);
          code += randomDigit;
        }
        for (let i = 0; i < 2; i++) {
          const randomDigit = Math.floor(Math.random() * 10);
          code += randomDigit;
        }
        return code;
      }
  
      const data = {
        solde: solde,
        etat: "Valide",
        code: generateRandomCode(),
        userbonachafk: userbonachafk,
        partbonachafk: partbonachafk,
        fourbonachafk: fourbonachafk,
        labbonachafk: labbonachafk,
      };
  
      const updatedPoint = Number(user.point) - Number(nbpoint);
      await Model.user.update({ point: updatedPoint }, { where: { id: userbonachafk } });
  
      
      const response = await Model.bonAchat.create(data);
  
      return res.status(200).json({
        success: true,
        message: "Bon d'achat créé",
        bonAchat: response,
        nbpoint: nbpoint,
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
      Model.bonAchat
        .update(
          { etat: "Non Valide" },
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
      Model.bonAchat
        .destroy({
          where: {
            id: req.params.id,
          },
        })
        .then((reponse) => {
          if (reponse !== 0) {
            res.status(200).json({
              success: true,
              message: " bon d'achat delete",
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
      Model.bonAchat.findAll().then((response) => {
        if (response !== null) {
          res.status(200).json({
            success: true,
            bonAchat: response,
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
      Model.bonAchat
        .findOne({
           where: { id: req.params.id },
           include: [
            {
              model: Model.partenaire,
              attributes: ["id", "nameetablissement"],
              include: [{ model: Model.user, attributes: ["fullname"] }],
            },
            {
              model: Model.labrairie,
              attributes: ["id", "nameLibrairie"],
              include: [{ model: Model.user, attributes: ["fullname"] }],
            },
          ],
          })
        .then((response) => {
          if (response !== null) {
            res.status(200).json({
              success: true,
              bonAchat: response,
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

    const { sortBy, sortOrder, page, pageSize } = req.query;
    const offset = (page - 1) * pageSize;
    const order = [[sortBy, sortOrder === "desc" ? "DESC" : "ASC"]];

    try {
      Model.bonAchat
        .findAll({
          offset:offset,
          order:order,
          limit: +pageSize,
          where: {
            userbonachafk: req.params.id,
          },
          include: [
            {
              model: Model.partenaire,
              attributes: ["id", "nameetablissement"],
              include: [{ model: Model.user, attributes: ["fullname"] }],
            },
            {
              model: Model.labrairie,
              attributes: ["id", "nameLibrairie"],
              include: [{ model: Model.user, attributes: ["fullname"] }],
            },
          ],
        })
        .then((response) => {
          if (response !== null) {
            res.status(200).json({
              success: true,
              bonAchat: response,
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
    try {
      Model.bonAchat
        .findAll({
          where: {
            partbonachafk: req.params.id,
          },
          include: [
            {
              model: Model.user,
              include: [Model.client, Model.fournisseur, Model.labrairie],
            },
          ],
        })
        .then((response) => {
          if (response !== null) {
            res.status(200).json({
              success: true,
              bonAchat: response,
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

module.exports = bonAchatController;
