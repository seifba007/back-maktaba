const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const suggestionProduitFournisseurController = require("../Controllers/suggestionProduitFournisseur.Controller");
const { AuthorizationUser } = require("../middleware/auth/auth");
router.post(
  "/add",
  upload.array("image", 3),
  suggestionProduitFournisseurController.add
);
router.get("/findAll", suggestionProduitFournisseurController.find);
router.put("/accepter/:id", suggestionProduitFournisseurController.AccepterSuggestion);
router.delete("/deletesuggestion", suggestionProduitFournisseurController.deletesuggestion);
module.exports = router;