const express = require("express");
const adminController = require("../Controllers/adminController");
const upload = require("../middleware/upload");
const {
  AuthorizationUser,
  AuthorizationAdmin,
} = require("../middleware/auth/auth");
const router = express.Router();
router.post("/add", AuthorizationUser, AuthorizationAdmin, adminController.add);
router.get(
  "/allusersrole",
  AuthorizationUser,
  AuthorizationAdmin,
  adminController.findAllusersrole
);
router.get(
  "/allcategories",
  AuthorizationUser,
  AuthorizationAdmin,
  adminController.findAllcategories
);
router.get(
  "/allproduits",
  AuthorizationUser,
  AuthorizationAdmin,
  adminController.findAllproduits
);
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
  AuthorizationUser,
  AuthorizationAdmin,
  adminController.findAllavis
);
router.get(
  "/getavgavisuser/moyenne_avis/:id",
  AuthorizationUser,
  AuthorizationAdmin,
  adminController.findavgavis
);
router.get(
  "/top10product",
  AuthorizationUser,
  AuthorizationAdmin,
  adminController.gettop10prod
);
router.get(
  "/nometablissement",
  AuthorizationUser,
  AuthorizationAdmin,
  adminController.findusernameetabllis
);
router.get(
  "/filtercommande",
  AuthorizationUser,
  AuthorizationAdmin,
  adminController.findCommandefiltre
);

router.get(
  "/allavis",
  AuthorizationUser,
  adminController.getAllAvis
);
module.exports = router;
