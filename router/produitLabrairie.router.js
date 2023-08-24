const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const ProduitLabrairieController = require("../Controllers/produitLabrairie.controller");
const { AuthorizationClient } = require("../middleware/auth/auth");
router.post(
  "/add",
  AuthorizationClient,
  upload.array("image", 3),
  ProduitLabrairieController.add_produit_with_import_image
);
router.post(
  "/addProdCataloge",
  AuthorizationClient,
  ProduitLabrairieController.add
);
router.put(
  "/update/:id",
  AuthorizationClient,
  upload.array("image", 3),
  ProduitLabrairieController.update
);
router.delete(
  "/delete",
  AuthorizationClient,
  ProduitLabrairieController.delete
);
router.get("/findAll", AuthorizationClient, ProduitLabrairieController.findAll);
router.get(
  "/findBylabrairie/:id",
  AuthorizationClient,
  ProduitLabrairieController.findAllProduitByLabrairie
);
router.get(
  "/findOneProduit/:id",
  AuthorizationClient,
  ProduitLabrairieController.findOneProduit
);
router.get(
  "/findProduitsBycategorie/:categorieId",
  AuthorizationClient,
  ProduitLabrairieController.findProduitsBycategorie
);
router.get(
  "/ListeDeProduitslibrairie/:id",
  AuthorizationClient,
  ProduitLabrairieController.Liste_de_produits_librairie
);
router.get(
  "/produit_mieux_notes/:id",
  AuthorizationClient,
  ProduitLabrairieController.produit_mieux_notes
);
module.exports = router;
