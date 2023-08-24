const express = require("express");
const passport = require("passport");
const router = express.Router();
const { AuthorizationUser } = require("../middleware/auth/auth");
const upload = require("../middleware/upload");
const { ROLES, inRole } = require("../security/Rolemiddleware");
const fournisseurController = require("../Controllers/fournisseur.controller");
router.post("/add", AuthorizationUser, fournisseurController.addfournisseur);
router.get(
  "/allfournisseurs",
  AuthorizationUser,
  fournisseurController.findAllfournisseur
);
router.get(
  "/findOneFournisseur/:id",
  AuthorizationUser,
  fournisseurController.findOneFournisseur
);
router.put(
  "/updateProfile/:id",
  AuthorizationUser,
  fournisseurController.updateProfile
);
router.put(
  "/updateProfileimge/:id",
  AuthorizationUser,
  upload.array("image", 1),
  fournisseurController.updateProfileimge
);
module.exports = router;
