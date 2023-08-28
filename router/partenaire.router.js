const express = require("express");
const passport = require("passport");
const router = express.Router();
const upload = require("../middleware/upload");
const { ROLES, inRole } = require("../security/Rolemiddleware");
const partenaireController = require("../Controllers/partenaire.controller");
const { AuthorizationUser } = require("../middleware/auth/auth");
router.post("/add", AuthorizationUser, partenaireController.addpartenaire);
router.get("/findAll", partenaireController.findPartnaire);
router.get("/findOnePartnaire/:id", partenaireController.findOnePartnaire);
router.put(
  "/updateProfile/:id",
  AuthorizationUser,
  partenaireController.updateProfile
);
router.put(
  "/updateProfileimge/:id",
  AuthorizationUser,
  upload.array("image", 1),
  partenaireController.updateProfileimge
);
module.exports = router;
