
const jwt = require("jsonwebtoken");
const Model = require("../../Models/index");

const AuthorizationUser = (req, res, next) => {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ")[1];
    jwt.verify(bearer, process.env.TOKEN_ACCESS_SECRET, async (err, user) => {
      if (err) return res.status(404).json({ msg: "Not Authorized" });
      req.user = user;
      const userAuth = await Model.user.findOne({ where: { id: user.id } });
      if (userAuth.etatCompte === "bloque")
        return res.status(404).json({ msg: "Not Authorized" });
    });

    next();
  } else {

    return res.status(402).json({ msg: "Access Denied" });
  }
};

const AuthorizationAdmin = async (req, res, next) => {
  try {
    const user = await Model.user.findOne({ where: { id: req.user.id } });
    if (user.role !== "Admin")
      return res.status(400).json({ msg: "Admin ressources access denied" });
    next();
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

const AuthorizationClient = async (req, res, next) => {
  try {
    const user = await Model.user.findOne({ where: { id: req.user.id } });

    if (user.role !== "client")
      return res.status(400).json({ msg: "Access Denied - Must be a Client to become a Partner" });
    next();
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

const AuthorizationFournisseur = async (req, res, next) => {
  try {
    const user = await Model.user.findOne({ where: { id: req.user.id } });

    if (user.role !== "fournisseur")
      return res.status(400).json({ msg: "Access Denied - Must be a Client to become a Partner" });
    next();
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

module.exports = {
  AuthorizationUser,
  AuthorizationAdmin,
  AuthorizationClient,AuthorizationFournisseur
};