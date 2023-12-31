const Model = require("../Models/index");
const { addAdresseValidation } = require("../middleware/auth/validationSchema");
const adressesController = {
  add: async (req, res) => {
    const {
      Nom_de_adresse,
      Adresse,
      Gouvernorat,
      Ville,
      Code_postal,
      clientId,
      partenaireId,
      fournisseurId
    } = req.body;
    try {
      const { error } = addAdresseValidation(req.body);
      if (error) return res.status(400).json({ success: false, err: error.details[0].message });
      const data = {
        Nom_de_adresse: Nom_de_adresse,
        Adresse: Adresse,
        Gouvernorat: Gouvernorat,
        Ville: Ville,
        Code_postal: Code_postal,
        clientId: clientId,
        partenaireId:partenaireId,
       fournisseurId:fournisseurId
      };
      Model.adresses.create(data).then((response) => {
        if (response !== null) {
          return res.status(200).json({
            success: true,
            message: "add addresse Done !! ",
          });
        } else {
          return res.status(500).json({
            success: false,
            message: " err to  add addresse ",
            error: err,
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
  addbypartnier: async (req, res) => {
    try {
      const {
        Nom_de_adresse,
        Adresse,
        Gouvernorat,
        Ville,
        Code_postal,
        partenaireId,
      } = req.body;
      const data = {
        Nom_de_adresse: Nom_de_adresse,
        Adresse: Adresse,
        Gouvernorat: Gouvernorat,
        Ville: Ville,
        Code_postal: Code_postal,
        partenaireId: partenaireId,
      };
      Model.adresses.create(data).then((response) => {
        if (response !== null) {
          return res.status(200).json({
            success: true,
            message: "add addresse Done !! ",
          });
        } else {
          return res.status(500).json({
            success: false,
            message: " err to  add addresse ",
            error: err,
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
    const { Nom_de_adresse, Adresse, Gouvernorat, Ville, Code_postal } =
      req.body;
    try {
      const { error } = addAdresseValidation(req.body);
      if (error) return res.status(400).json(error.details[0].message);
      const data = {
        Nom_de_adresse: Nom_de_adresse,
        Adresse: Adresse,
        Gouvernorat: Gouvernorat,
        Ville: Ville,
        Code_postal: Code_postal,
      };
      Model.adresses
        .update(data, {
          where: { id: req.params.id, clientId: req.params.clientId },
        })
        .then((response) => {
          if (response != 0) {
            return res.status(200).json({
              success: true,
              message: " upadte addresse done !! ",
            });
          } else {
            return res.status(200).json({
              success: false,
              message: "err update addresse ",
              error: err,
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
      Model.adresses
        .destroy({
          where: { id: req.params.id, clientId: req.params.clientId },
        })
        .then((response) => {
          if (response != 0) {
            return res.status(200).json({
              success: true,
              message: "delete addresse done !! ",
            });
          } else {
            return res.status(200).json({
              success: false,
              meesage: "err delete addreese",
            });
          }
        });
    } catch (err) {
      return res.status(400).json({
        success: false,
        err: err,
      });
    }
  },
};
module.exports = adressesController;
