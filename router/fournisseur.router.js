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
router.put("/acceptercommande/:id",fournisseurController.Accepter);
router.put("/livrercommande/:id",fournisseurController.livrecommande);
router.put("/annulercommande/:id",fournisseurController.annulercommande);
router.get("/findOneCommande/:id",fournisseurController.findOneCommande)

router.get("/findtopproduct/:id", fournisseurController.findTopProducts);
router.get("/gettoprevprod/:id", fournisseurController.getToprevProd);
router.get("/findallcommandebystate/:id", fournisseurController.findAllcommandebyetat);
router.get("/findCommandeinday/:id", fournisseurController.findCommandeinday);
router.get("/findLatestCommandes/:id", fournisseurController.findLatestCommandes);
module.exports = router;
