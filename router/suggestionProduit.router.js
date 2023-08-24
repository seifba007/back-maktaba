const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const suggestionProduitController = require("../Controllers/suggestionProduit.Controller");
const { AuthorizationUser } = require("../middleware/auth/auth");
router.post(
  "/add",
  AuthorizationUser,
  upload.array("image", 3),
  suggestionProduitController.add
);
router.get("/findAll", AuthorizationUser, suggestionProduitController.find);
module.exports = router;
