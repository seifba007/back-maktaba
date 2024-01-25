const express = require("express");
const passport = require("passport");
const router = express.Router();
const { AuthorizationUser, AuthorizationFournisseur } = require("../middleware/auth/auth");
const upload = require("../middleware/upload");
const { ROLES, inRole } = require("../security/Rolemiddleware");
const fournisseurController = require("../Controllers/fournisseur.controller");
router.post("/add", AuthorizationUser, fournisseurController.addfournisseur);
router.get(
  "/allfournisseurs",

  fournisseurController.findAllfournisseur
);
router.get(
  "/findOneFournisseur/:id",

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


router.get(
  "/findAllCommandes/:id",
  fournisseurController.findAllCommandes
);

router.get("/findAllLivraison/:id", fournisseurController.findAllLivraison);
router.put("/livrercommande/:id",fournisseurController.livrecommande);
router.put("/annulercommande/:id",fournisseurController.annulercommande)

module.exports = router;
