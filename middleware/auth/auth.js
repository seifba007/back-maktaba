/*roniceyemeli
@build by https://www.linkedin.com/in/roniceyemeli/
*/
const jwt = require("jsonwebtoken");
const Model = require("../../Models/index");

const AuthorizationUser = (req, res, next) => {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ")[1];

    //we decode the user passwword and verify if it fit with the one stored in th database
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
    // get user info by id
    const user = await Model.user.findOne({ where: { id: req.user.id } });
    console.log(user);
    if (user.role !== "Admin")
      return res.status(400).json({ msg: "Admin ressources access denied" });
    next();
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

module.exports = {
  AuthorizationUser,
  AuthorizationAdmin,
};
