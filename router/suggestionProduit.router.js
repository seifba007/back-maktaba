const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const suggestionProduitController = require("../Controllers/suggestionProduit.Controller");
const { AuthorizationUser } = require("../middleware/auth/auth");
router.post(
  "/add",
  upload.array("image", 3),
  suggestionProduitController.add
);
router.get("/findAll", suggestionProduitController.find);
router.put("/accepter/:id", suggestionProduitController.AccepterSuggestion);
router.delete("/deletesuggestion", suggestionProduitController.deletesuggestion);
module.exports = router;
