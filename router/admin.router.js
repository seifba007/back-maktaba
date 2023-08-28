const express = require("express");
const adminController = require("../Controllers/adminController");
const upload = require("../middleware/upload");
const {
  AuthorizationUser,
  AuthorizationAdmin,
} = require("../middleware/auth/auth");
const router = express.Router();
router.post("/add", AuthorizationUser, AuthorizationAdmin, adminController.add);
router.get("/allusersrole", adminController.findAllusersrole);
router.get("/allcategories", adminController.findAllcategories);
router.get("/allproduits", adminController.findAllproduits);
router.delete(
  "/deletecategory",
  AuthorizationUser,
  AuthorizationAdmin,
  adminController.deletecategory
);

router.post(
  "/addcategory",
  AuthorizationUser,
  AuthorizationAdmin,
  upload.array("image", 1),
  adminController.addcategory
);

router.delete(
  "/deletesuggestion",
  AuthorizationUser,
  AuthorizationAdmin,
  adminController.deletesuggestion
);

router.get(
  "/getallavisuser/nombre_total_etoiles/:id",
  adminController.findAllavis
);
router.get("/getavgavisuser/moyenne_avis/:id", adminController.findavgavis);
router.get("/top10product", adminController.gettop10prod);
router.get(
  "/nometablissement",
  adminController.findusernameetabllis
);
router.get(
  "/filtercommande",
  adminController.findCommandefiltre
);

router.get(
  "/produitrech",

  adminController.findproduitbyname
);

router.get(
  "/founisseurrech",

  adminController.findfournissbyname
);

router.get("/allavis", adminController.getAllAvis);
module.exports = router;
