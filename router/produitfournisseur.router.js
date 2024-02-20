const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const produitfounisseurcontroller = require("../Controllers/produitFournisseur.controller");
const {AuthorizationUser } = require("../middleware/auth/auth");
router.post(
  "/add",
  upload.array("image", 3),
  produitfounisseurcontroller.add_produit
);

router.put(
  "/update/:id",
  upload.array("image", 3),
  produitfounisseurcontroller.update
);
router.delete(
  "/delete",
  produitfounisseurcontroller.delete
);
router.get("/findAll", produitfounisseurcontroller.findAll);
router.get("/findByfournisseur/:id",produitfounisseurcontroller.findAllProduitByfournisseur);
router.get("/findOneProduit/:id", produitfounisseurcontroller.findoneproduit);
router.get(
  "/findProduitsBycategorie/:categprodfoufk",
  produitfounisseurcontroller.findProduitsBycategorie
);


router.get(
  "/produit_mieux_notes/:id",
  produitfounisseurcontroller.produit_mieux_notes
);
router.get("/produit_mieux/:id",produitfounisseurcontroller.produit_mieux);

router.get("/produitfiltrage", produitfounisseurcontroller.produitfiltreage);

module.exports = router;
