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
      clientaddressfk,
      partenaireaddressfk,
      fournisseuraddressfk
    } = req.body;
    
    try {
      //const { error } = addAdresseValidation(req.body);
      //if (error) return res.status(400).json({ success: false, err: error.details[0].message });
      const data = {
        Nom_de_adresse: Nom_de_adresse,
        Adresse: Adresse,
        Gouvernorat: Gouvernorat,
        Ville: Ville,
        Code_postal: Code_postal,
        clientaddressfk: clientaddressfk,
        partenaireaddressfk:partenaireaddressfk,
       fournisseuraddressfk:fournisseuraddressfk
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
        partenaireaddressfk,
      } = req.body;
      const data = {
        Nom_de_adresse: Nom_de_adresse,
        Adresse: Adresse,
        Gouvernorat: Gouvernorat,
        Ville: Ville,
        Code_postal: Code_postal,
        partenaireaddressfk: partenaireaddressfk,
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
      //const { error } = addAdresseValidation(req.body);
      //if (error) return res.status(400).json(error.details[0].message);
      const data = {
        Nom_de_adresse: Nom_de_adresse,
        Adresse: Adresse,
        Gouvernorat: Gouvernorat,
        Ville: Ville,
        Code_postal: Code_postal,
      };
      Model.adresses
        .update(data, {
          where: { id: req.params.id, clientaddressfk: req.params.clientaddressfk },
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
          where: { id: req.params.id, clientaddressfk: req.params.clientaddressfk },
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

  deleteaddresspartenaire: async (req, res) => {
    try {
      Model.adresses
        .destroy({
          where: { id: req.params.id, partenaireaddressfk: req.params.partenaireaddressfk },
        })
        .then((response) => {
          if (response != 0) {
            return res.status(200).json({
              success: true,
              message: "delete partenaire addresse done !! ",
            });
          } else {
            return res.status(200).json({
              success: false,
              meesage: "err delete addreese partenaire",
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

  deleteaddressfournisseur: async (req, res) => {
    try {
      Model.adresses
        .destroy({
          where: { id: req.params.id, fournisseuraddressfk: req.params.fournisseuraddressfk },
        })
        .then((response) => {
          if (response != 0) {
            return res.status(200).json({
              success: true,
              message: "delete fournisseur addresse done !! ",
            });
          } else {
            return res.status(200).json({
              success: false,
              meesage: "err delete addreese fournisseur",
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
