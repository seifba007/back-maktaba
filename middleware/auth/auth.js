
const jwt = require("jsonwebtoken");
const Model = require("../../Models/index");

const AuthorizationUser = async (req, res, next) => {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ")[1];
    jwt.verify(bearer, process.env.TOKEN_ACCESS_SECRET, async (err, user) => {
      if (err) return res.status(403).json({ msg: "Not Authorized" });

      req.user = user;

      try {
        const userAuth = await Model.user.findOne({ where: { id: user.user.id } });

        if (!userAuth || userAuth.etatCompte === "bloque") {
          return res.status(403).json({ msg: "Not Authorized" });
        }

        // If everything is fine, proceed to the next middleware
        next();
      } catch (error) {
        return res.status(500).json({ msg: "Internal Server Error" });
      }
    });
  } else {
    return res.status(401).json({ msg: "Access Denied" });
  }
};


const AuthorizationAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ msg: 'No token provided' });
    }
    jwt.verify(token, process.env.TOKEN_ACCESS_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(403).json({ msg: 'Token is not valid' });
      }
      const userId = decoded.user.id; // Assuming token contains user ID in 'id' field
      if (!userId) {
        return res.status(401).json({ msg: 'User ID is missing in token' });
      }
      const user = await Model.user.findOne({ where: { id: userId } });
      if (!user) {
        return res.status(401).json({ msg: 'User not found' });
      }
      // Attach user to request object
      req.user = user;
      // Check if the user is an admin
      if (user.role !== 'Admin') {
        return res.status(403).json({ msg: 'Admin resources access denied' });
      }
      next();
    });
  } catch (error) {
    return res.status(500).json({ msg: 'Internal server error', error: error.message });
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