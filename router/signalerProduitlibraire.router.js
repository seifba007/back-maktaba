const express = require("express");
const signalerProduitlibraireController = require("../Controllers/signalerProduitlibraire.controller");
const router = express.Router();
const upload = require("../middleware/upload");
const { AuthorizationClient } = require("../middleware/auth/auth");
router.post(
  "/add",
  AuthorizationClient,
  upload.array("image", 1),
  signalerProduitlibraireController.add
);
module.exports = router;
