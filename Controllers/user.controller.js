const Model = require("../Models/index");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendMail = require("../config/Noemailer.config");
const { response } = require("express");
const cloudinary = require("../middleware/cloudinary");

const { where } = require("sequelize");
const { createAccessToken, createRefreshToken } = require("../services/jwt");
const {
  registerValidation,
  loginValidation,
} = require("../middleware/auth/validationSchema");
const user = require("../Models/user");
const refreshTokens = [];
const forgetpasswordToken = [];

const userController = {
  login: async (req, res) => {
    const data = req.body;
    const { email, password } = req.body;

    try {
      const { error } = loginValidation(data);
      if (error)
        return res.status(400).json({
          success: false,
          err: error.details[0].message,
        });
      Model.user.findOne({ where: { email: email } }).then((User) => {
        if (User === null) {
          return res.status(400).json({
            success: false,
            err: "l'email n'existe pas",
          });
        } else {
          if (User.etatCompte !== "bloque") {
            if (User.email_verifie === "verifie") {
              bcrypt.compare(password, User.password).then((isMatch) => {
                if (!isMatch) {
                  return res.status(400).json({
                    success: false,
                    err: "le mot de passe n'est pas correct",
                  });
                } else {
                  const accessToken = createAccessToken({ id: User.id });
                  const refreshToken = createRefreshToken({ id: User.id });
                  refreshTokens.push(refreshToken);
                  res.status(200).json({
                    success: true,
                    message: "success",
                    accessToken: accessToken,
                    refreshToken: refreshToken,
                    user: User,
                  });
                }
              });
            } else {
              return res.status(400).json({
                success: false,
                err: "verifie votre compte s'il vous plait",
              });
            }
          } else {
            return res.status(200).json({
              success: false,
              error: "bloque",
            });
          }
        }
      });
    } catch (err) {
      return res.status(400).json({
        success: false,
        error: err,
      });
    }
  },
  register: async (req, res) => {
    const data = req.body;
    const { fullname, email, password } = req.body;
    try {
      const { error } = registerValidation(data);
      if (error)
        return res
          .status(400)
          .json({ success: false, err: error.details[0].message });
      Model.user.findOne({ where: { email: email } }).then((user) => {
        if (user !== null) {
          return res.status(400).json({
            success: false,
            err: "email exist",
          });
        } else {
          const passwordHash = bcrypt.hashSync(password, 10);
          function generateVerificationToken(length) {
            const characters =
              "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            let token = "";

            for (let i = 0; i < length; i++) {
              const randomIndex = Math.floor(Math.random() * characters.length);
              token += characters.charAt(randomIndex);
            }

            return token;
          }
          const verificationToken = generateVerificationToken(32);
          const datauser = {
            fullname: fullname,
            email: email,
            password: passwordHash,
            email_verifie: "non_verifie",
            role: "client",
            etatCompte: "active",
            point: 0,
            verification_token: verificationToken,
          };

          Model.user.create(datauser).then((user) => {
            if (user !== null) {
              const dataClient = {
                id: user.id,
                userclientfk: user.id,
              };
              Model.client.create(dataClient).then((client) => {
                if (client !== null) {
                  let link = `${process.env.URL_BACK}/user/verif/${verificationToken}`;
                  sendMail.sendEmailVerification(req.body.email, link);
                  res.status(200).json({
                    success: true,
                    message: "verif your email now ",
                  });
                }
              });
            }
          });
        }
      });
    } catch (err) {
      res.status(400).json({
        success: false,
        error: err,
      });
    }
  },

  emailVerification: async (req, res) => {
    try {
      Model.user
        .findOne({ where: { verification_token: req.params.email } })
        .then(async (user) => {
          if (user !== null) {
            await Model.user
              .update(
                { email_verifie: "verifie" },
                {
                  where: {
                    verification_token: req.params.email,
                  },
                }
              )
              .then((response) => {
                if (response != 0) {
                  res.redirect(`${process.env.URL_FRONT}/login`);
                }
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
  refresh: async (req, res) => {
    try {
      const refreshToken = req.body.refreshToken;
      if (!refreshToken || !refreshTokens.includes(refreshToken)) {
        return res.json({
          success: false,
          error: "Refresh token not found",
        });
      }
      jwt.verify(refreshToken, process.env.REFRESH_KEY, (err, User) => {
        if (!err) {
          var accessToken = jwt.sign(
            {
              id: User.id,
              fullname: User.fullname,
            },
            process.env.PRIVATE_KEY,
            { expiresIn: "1h" }
          );
          return res.json({ success: true, accessToken });
        } else {
          return res.json({
            success: false,
            message: "Invalid refresh token",
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

  sendMailforgotPassword: async (req, res) => {
    try {
      Model.user
        .findOne({ where: { email: req.body.email } })
        .then((olduser) => {
          if (olduser === null) {
            return res.status(400).json({
              success: false,
              message: " user not exist",
            });
          } else {
            const secret = process.env.forget_key + olduser.password;
            const token = jwt.sign(
              { email: olduser.email, id: olduser.id },
              secret,
              {
                expiresIn: "5m",
              }
            );
            forgetpasswordToken.push(token);
            const link = `${process.env.URL_FRONT}/reset-password/${olduser.id}/${token}`;
            sendMail.sendEmailToForgetPassword(req.body.email, link);
            res.status(200).json({
              success: true,
              message: "check your inbox now",
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
  forgotpassword: async (req, res) => {
    try {
      const id = req.params.id;
      const { password, token } = req.body;
      if (!token || !forgetpasswordToken.includes(token)) {
        return res.status(400).json({
          success: false,
          error: " token not found",
        });
      }
      Model.user.findOne({ where: { id: id } }).then((olduser) => {
        if (olduser !== null) {
          const secret = process.env.forget_key + olduser.password;
          jwt.verify(token, secret, async (err, olduser) => {
            if (!err) {
              const newPassword = bcrypt.hashSync(password, 10);
              await Model.user
                .update(
                  { password: newPassword },
                  {
                    where: {
                      id: id,
                    },
                  }
                )
                .then((response) => {
                  if (response !== 0) {
                    return res.status(200).json({
                      success: true,
                      message: " forgot password Done",
                    });
                  }
                });
            } else {
              return res.status(400).json({
                success: false,
                message: "Invalid refresh token",
              });
            }
          });
        } else {
          return res.status(400).json({
            success: false,
            message: " user not exist",
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
  Contact: async (req, res) => {
    try {
      const { email, sujet, message, name } = req.body;
      sendMail.sendContactEmail(email, sujet, message, name);
      res.status(200).json({
        success: true,
        message: " message envoyer ",
      });
    } catch (err) {
      return res.status(400).json({
        success: false,
        error: err,
      });
    }
  },
  authWithSocialMedia: async (req, res) => {
    try {
      const { email, fullname } = req.body;
      Model.user.findOne({ where: { email: email } }).then((user) => {
        if (user !== null) {
          const accessToken = createAccessToken({ id: user.id });
          const refreshToken = createRefreshToken({ id: user.id });
          refreshTokens.push(refreshToken);
          return res.status(200).json({
            success: true,
            message: "success login",
            accessToken: accessToken,
            refreshToken: refreshToken,
            user:user
          });
        } else {
          const characters =
            "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
          let Password = "";
          for (let i = 0; i < 25; i++) {
            Password +=
              characters[Math.floor(Math.random() * characters.length)];
          }
          const passwordHash = bcrypt.hashSync(Password, 10);
          const datauser = {
            fullname: fullname,
            email: email,
            password: passwordHash,
            email_verifie: "verifie",
            role: "client",
            etatCompte: "active",
          };
          Model.user.create(datauser).then((user) => {
            if (user !== null) {
              const dataClient = {
                id: user.id,
                userclientfk: user.id,
              };
              Model.client.create(dataClient).then((client) => {
                if (client !== null) {
                  const accessToken = createAccessToken({ id: user.id });
                  const refreshToken = createRefreshToken({ id: user.id });
                  refreshTokens.push(refreshToken);
                  return res.status(200).json({
                    success: true,
                    message: "success create and login ",
                    accessToken: accessToken,
                    refreshToken: refreshToken,
                    passwordor: Password,
                    client: client,
                  });
                }
              });
            }
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
  updatePassword: async (req, res) => {
    try {
      const { newPassword, ActuelPassword } = req.body;
      Model.user
        .findOne({ where: { id: req.params.id }, attributes: ["password"] })
        .then((response) => {
          bcrypt.compare(ActuelPassword, response.password).then((isMatch) => {
            if (!isMatch) {
              return res.status(200).json({
                success: false,
                message: " ActuelPassword not equal to password",
              });
            } else {
              const passwordHash = bcrypt.hashSync(newPassword, 10);
              Model.user
                .update(
                  { password: passwordHash },
                  { where: { id: req.params.id } }
                )
                .then((response) => {
                  if (response != 0) {
                    return res.status(200).json({
                      success: true,
                      message: " update Password done !! ",
                    });
                  } else {
                    return res.status(400).json({
                      success: false,
                      message: " err to update password ",
                    });
                  }
                });
            }
          });
        });
    } catch (err) {
      return res.status(400).json({
        success: false,
        err: err,
      });
    }
  },
  updateIdentite: async (req, res) => {
    try {
      const { Date_de_naissance, telephone, fullname, email } = req.body;
      if (req.files && req.files.length > 0) {
        const filePromises = req.files.map(async (file) => {
          const result = await cloudinary.uploader.upload(file.path);
          return result.secure_url;
        });

        Promise.all(filePromises).then((imageUrls) => {
          const data = {
            Date_de_naissance:
              Date_de_naissance === "0000-00-00" ? null : Date_de_naissance,
            avatar: imageUrls[0],
            telephone: telephone,
            fullname: fullname,
            email: email,
          };

          Model.user
            .update(data, { where: { id: req.params.id } })
            .then((response) => {
              if (response[0] !== 0) {
                return res.status(200).json({
                  success: true,
                  message: "Update identity successful!",
                });
              } else {
                return res.status(400).json({
                  success: false,
                  message: "Error updating identity",
                });
              }
            });
        });
      } else {
        const data = {
          Date_de_naissance:
            Date_de_naissance === "0000-00-00" ? null : Date_de_naissance,
          telephone: telephone,
          fullname: fullname,
          email: email,
        };

        Model.user
          .update(data, { where: { id: req.params.id } })
          .then((response) => {
            if (response[0] !== 0) {
              return res.status(200).json({
                success: true,
                message: "Update identity successful!",
              });
            } else {
              return res.status(400).json({
                success: false,
                message: "Error updating identity",
              });
            }
          });
      }
    } catch (err) {
      return res.status(400).json({
        success: false,
        error: err,
      });
    }
  },

  addPoint: async (req, res) => {
    try {
      Model.user.findByPk(req.params.id).then((user) => {
        if (user) {
          const updatedPoint = user.point + req.body.point;
          Model.user
            .update({ point: updatedPoint }, { where: { id: req.params.id } })
            .then((response) => {
              if (response !== 0) {
                return res.status(200).json({
                  success: true,
                  message: "update point done !!",
                });
              } else {
                return res.status(400).json({
                  success: false,
                  message: " error de update point",
                });
              }
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
  bloque: async (req, res) => {
    try {
      Model.user
        .update({ etatCompte: "bloque" }, { where: { id: req.params.id } })
        .then((response) => {
          if (response !== 0) {
            return res.status(200).json({
              success: true,
              message: "blocage done !!!",
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

  findAlluser: async (req, res) => {
    const { sortBy, sortOrder, page, pageSize } = req.query;
    const offset = (page - 1) * pageSize;
    const order = [[sortBy, sortOrder === "desc" ? "DESC" : "ASC"]];
    try {
      const usercount = await Model.user.count({});
      Model.user
        .findAll({
          limit: +pageSize,
          offset: offset,
          order: order,
          attributes: [
            "id",
            "fullname",
            "email",
            "avatar",
            "role",
            "telephone",
            "createdAt",
            "etatCompte",
          ],
        })
        .then((response) => {
          try {
            if (response !== null) {
              const totalPages = Math.ceil(usercount / pageSize);
              return res.status(200).json({
                success: true,
                users: response,
                totalPages: totalPages,
              });
            } else {
              return res.status(200).json({
                success: true,
                users: [],
              });
            }
          } catch (err) {
            return res.status(400).json({
              success: false,
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
      Model.user
        .destroy({
          where: {
            id: req.params.id,
          },
        })
        .then((response) => {
          if (response !== 0) {
            return res.status(200).json({
              success: true,
              message: "user deleted",
            });
          } else {
            return res.status(400).json({
              success: false,
              message: "error to delete user",
            });
          }
        });
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: err,
      });
    }
  },
};
module.exports = userController;
