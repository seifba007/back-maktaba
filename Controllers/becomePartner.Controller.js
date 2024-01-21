const { response } = require("express");
const express = require("express");
const Model = require("../Models/index");
const bcrypt = require("bcrypt");
const sendMail = require("../config/Noemailer.config");
const cloudinary = require("../middleware/cloudinary");
const { Sequelize, where } = require("sequelize");

const fournisseur = require("../Models/fournisseur");
const {
  becomePartnerValidation,
} = require("../middleware/auth/validationSchema");
const { image } = require("../middleware/cloudinary");
const BecomePartnerController = {
  add: async (req, res) => {
    const {
      fullname,
      email,
      phone,
      Role,
      name_work,
      links,
      detail,
      pack,
      adminpartfk,
    } = req.body;

    if (!fullname || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: "Fullname, email, and phone are required fields.",
      });
    }

    try {
      const existingEmail = await Model.user.findOne({
        where: { email: email },
      });

      if (existingEmail) {
        return res.status(400).json({
          success: false,
          message: "Email already exists. Please use a different email.",
        });
      }

      let result = "";

      req.files.forEach(async (file) => {
        result = file.filename;
      });

      const data = {
        fullname: fullname,
        email: email,
        phone: phone,
        Role: Role,
        name_work: name_work,
        file: result,
        links: links,
        detail: detail,
        pack: pack,
        etat: "en attente",
        adminpartfk: adminpartfk,
      };

      const response = await Model.BecomePartner.create(data);

      if (response) {
        return res.status(200).json({
          success: true,
          message: "Votre demande a bien été reçue",
        });
      } else {
        return res.status(500).json({
          success: false,
          message: "Error creating demand. Please try again.",
        });
      }
    } catch (err) {
      res.status(500).json({
        success: false,
        error: err.message,
      });
    }
  },

  findAll: async (req, res) => {
    const { sortBy, sortOrder, page, pageSize, role } = req.query;
    const offset = (page - 1) * pageSize;
    const order = [[sortBy, sortOrder === "desc" ? "DESC" : "ASC"]];

    const filters = req.query;
    const whereClause = {};

    if (filters.fullname) {
      whereClause.fullname = { [Sequelize.Op.like]: `%${filters.fullname}%` };
    }

    if (role && role === "tout") {
      whereClause.Role = {
        [Sequelize.Op.or]: [
          "Librairie",
          "Fournisseur",
          "Enterprise",
          "Ecole",
          "Association",
        ],
      };
    } else if (role && role !== "tout") {
      whereClause.Role = role;
    }

    try {
      const result = await Model.BecomePartner.findAndCountAll({
        where: whereClause,
        order: order,
        offset: offset,
        limit: +pageSize,
      });

      if (result.rows.length > 0) {
        const totalPages = Math.ceil(result.count / pageSize);
        return res.status(200).json({
          success: true,
          demande: result.rows,
          totalPages: totalPages,
        });
      } else {
        return res.status(200).json({
          success: true,
          message: "No demande found.",
        });
      }
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  },

  accepte: async (req, res) => {
    try {
      const { Role, username, email } = req.body;
      const characters =
        "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
      let Password = "";
      for (let i = 0; i < 25; i++) {
        Password += characters[Math.floor(Math.random() * characters.length)];
      }
      Model.BecomePartner.update(
        { etat: "accepte" },
        { where: { id: req.params.id } }
      );
      const passwordHash = bcrypt.hashSync(Password, 10);
      switch (Role) {
        case "labrairie":
          const datauser = {
            email: email,
            fullname: username,
            password: passwordHash,
            email_verifie: "verifie",
            role: "labrairie",
            etatCompte: "active",
          };
          Model.user.findOne({ where: { email: email } }).then((response) => {
            if (response === null) {
              Model.user.create(datauser).then((user) => {
                if (user !== null) {
                  const dataLabriarie = {
                    id: user.id,
                    userlabfk: user.id,
                  };
                  Model.labrairie.create(dataLabriarie).then((labrairie) => {
                    sendMail.acceptationDemendePartenariat(email, Password);
                    if (labrairie !== null) {
                      return res.status(200).json({
                        success: true,
                        message: "success create labrairie",
                      });
                    }
                  });
                }
              });
            } else {
              sendMail.DemendePartenariatRejected(email);
              return res.status(200).json({
                success: false,
                message: "email exist ",
              });
            }
          });
          break;
        case "fournisseur":
          const datauser1 = {
            email: email,
            fullname: username,
            password: passwordHash,
            email_verifie: "verifie",
            role: "fournisseur",
            etatCompte: "active",
          };
          Model.user.findOne({ where: { email: email } }).then((response) => {
            if (response === null) {
              Model.user.create(datauser1).then((user) => {
                if (user !== null) {
                  const datafournisseur = {
                    id: user.id,
                    userfourfk: user.id,
                  };
                  Model.fournisseur
                    .create(datafournisseur)
                    .then((fournisseur) => {
                      sendMail.acceptationDemendePartenariat(email, Password);
                      if (fournisseur !== null) {
                        return res.status(200).json({
                          success: true,
                          message: "success create fournsisseur",
                        });
                      }
                    });
                }
              });
            } else {
              sendMail.DemendePartenariatRejected(email);
              return res.status(400).json({
                success: false,
                message: "email exist ",
              });
            }
          });
          break;
        default:
          const datauser2 = {
            email: email,
            fullname: username,
            password: passwordHash,
            email_verifie: "verifie",
            role: "partenaire",
            etatCompte: "active",
          };
          Model.user.findOne({ where: { email: email } }).then((response) => {
            if (response === null) {
              Model.user.create(datauser2).then((user) => {
                if (user !== null) {
                  const datapartenaire = {
                    id: user.id,
                    userparfk: user.id,
                  };
                  Model.partenaire.create(datapartenaire).then((partainer) => {
                    sendMail.acceptationDemendePartenariat(email, Password);
                    if (partainer !== null) {
                      return res.status(200).json({
                        success: true,
                        message: "success create partainer",
                      });
                    }
                  });
                }
              });
            } else {
              sendMail.DemendePartenariatRejected(email);
              return res.status(400).json({
                success: false,
                message: "email exist ",
              });
            }
          });
          break;
      }
    } catch (err) {
      res.status(400).json({
        success: false,
        error: err.message,
      });
    }
  },
  Annuler: async (req, res) => {
    try {
      Model.BecomePartner.update(
        { etat: "Annuler" },
        { where: { id: req.params.id } }
      ).then((response) => {
        if (response !== 0) {
          return res.status(200).json({
            success: true,
            message: "demende  Annuler",
          });
        } else {
          return res.status(400).json({
            success: false,
            message: "error",
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

module.exports = BecomePartnerController;
