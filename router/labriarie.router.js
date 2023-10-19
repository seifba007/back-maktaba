const express = require("express");
const passport = require("passport");
const router = express.Router();
const upload = require("../middleware/upload");
const { ROLES, inRole } = require("../security/Rolemiddleware");
const labriarieController = require("../Controllers/labriarie.controller");
const { AuthorizationUser } = require("../middleware/auth/auth");
router.post("/add", AuthorizationUser, labriarieController.addlabrairie);
router.get("/findProfile/:id", labriarieController.findProfile);
router.put(
  "/updateProfile/:id",
  AuthorizationUser,
  upload.array("image", 1),
  labriarieController.updateProfile
);
router.get("/findalllibrarie", labriarieController.findAlllibrarie);
router.get("/findtopproduct/:id", labriarieController.findtopproduct);
router.get("/gettop10prod/:id", labriarieController.gettop10prod);
router.get("/findAllcommandebyetat/:id", labriarieController.findAllcommandebyetat);
router.get("/findCommandeinday/:id", labriarieController.findCommandeinday);
router.get("/findLatestCommandes/:id", labriarieController.findLatestCommandes);
router.get("/findAllproducts/:id", labriarieController.findAllproducts);
router.get("/findAllCommands/:id", labriarieController.findAllCommandsByState);
router.get("/findAllLivraison/:id", labriarieController.findAllLivraison);
router.put("/livrercommande/:id", labriarieController.livrecommande);
router.put("/annulercommande/:id", labriarieController.annulercommande);
router.get(
  "/findallproductbyFiltre/:id",
  labriarieController.findAllproduitbyfiltre
);
module.exports = router;
