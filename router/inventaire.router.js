const express = require("express");
const router = express.Router();
const InventaireController = require("../Controllers/inventaire.Controller");
const { AuthorizationUser } = require("../middleware/auth/auth");
router.post(
  "/add",
  InventaireController.add
);
//router.get("/findAll", CatalogeController.findAll);

module.exports = router;
