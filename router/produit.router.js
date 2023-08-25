const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const produitController = require("../Controllers/produit.controller");
const { AuthorizationClient } = require("../middleware/auth/auth");
router.post(
  "/add",
  AuthorizationClient,
  upload.single("image"),
  produitController.add
);
router.put(
  "/update/:id",
  AuthorizationClient,
  upload.single("image"),
  produitController.update
);
router.delete("/delete/:id", AuthorizationClient, produitController.delete);
router.get("/findAll", produitController.findAll);
router.get("/findByFournisseur", produitController.findAllProduitByfournisseur);
module.exports = router;
