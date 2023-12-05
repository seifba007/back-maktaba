const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const ProduitLabrairieController = require("../Controllers/produitLabrairie.controller");
const {AuthorizationUser } = require("../middleware/auth/auth");
router.post(
  "/add",
  AuthorizationUser,
  upload.array("image", 3),
  ProduitLabrairieController.add_produit
);

router.put(
  "/update/:id",
  AuthorizationUser,
  upload.array("image", 3),
  ProduitLabrairieController.update
);
router.delete(
  "/delete",
  ProduitLabrairieController.delete
);
router.get("/findAll", ProduitLabrairieController.findAll);
router.get(
  "/findBylabrairie/:id",
  ProduitLabrairieController.findAllProduitByLabrairie
);
router.get("/findOneProduit/:id", ProduitLabrairieController.findoneproduit);
router.get(
  "/findProduitsBycategorie/:categprodlabfk",
  ProduitLabrairieController.findProduitsBycategorie
);


router.get(
  "/produit_mieux_notes/:id",
  ProduitLabrairieController.produit_mieux_notes
);
router.get("/produit_mieux/:id",ProduitLabrairieController.produit_mieux);

router.get("/produitfiltrage", ProduitLabrairieController.produitfiltreage);

module.exports = router;
