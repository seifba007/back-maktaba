const express = require("express");
const signalerProduitlibraireController = require("../Controllers/signalerProduitlibraire.controller");
const router = express.Router();
const upload = require("../middleware/upload");
const { AuthorizationUser } = require("../middleware/auth/auth");
router.post(
  "/add",
  AuthorizationUser,
  upload.array("image", 1),
  signalerProduitlibraireController.add
);
module.exports = router;
