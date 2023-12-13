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
router.get("/findonecategory/:id", adminController.findOnecategory);
router.get("/allproduits", adminController.findAllproduits);

router.delete(
  "/deletecategory",
  AuthorizationUser,
  adminController.deletecategory
);

router.post(
  "/addcategory",
  AuthorizationUser,
  upload.array("image", 1),
  adminController.addcategory
);

router.put(
  "/editcategory/:id",
  AuthorizationUser,
  adminController.editCategory
);

router.put(
  "/updatecategoryimages/:id",
  upload.array("image", 1),
  adminController.updatecategoryimages
);

router.put(
  "/changevisibiliter/:id",
  adminController.changeVisibilite
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
router.get("/findnbravisproduit/:id", adminController.findNbreAvisProduit);
router.get("/findtotalavisproduit/:id", adminController.findTotalAvisProduit);
router.get("/findavismoyeproduit/:id", adminController.findMoyeAvisProduit);
router.get("/findavisproduit/nombre_avis/:id", adminController.findavisproduit);
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
  "/echangerechlab",
  adminController.findAllEchangeLibrarie
);

router.get(
  "/echangerechclient",
  adminController.findAllEchangeClient
);

router.get(
  "/getallusers",
  adminController.findAlluser
);

router.get(
  "/founisseurrech",
  adminController.findfournissbyname
);

router.get("/allavis", adminController.getAllAvis); 

router.get("/findAllCommandes", adminController.findAllCommandes);
router.get("/findCommandes", adminController.findCommandes);
router.get("/findAllLivraison", adminController.findAllLivraison);
router.get("/findLivraison", adminController.findLivraison);
module.exports = router;
