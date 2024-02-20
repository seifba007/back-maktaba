const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const CatalogeFournisseurController = require("../Controllers/catalogefournisseurController.controller");
const { AuthorizationUser } = require("../middleware/auth/auth");
router.post(
  "/add",
  upload.array("image", 4),
  CatalogeFournisseurController.add
);
router.get("/findAll", CatalogeFournisseurController.findAll);
router.get("/findOne/:id", CatalogeFournisseurController.findOne);
router.delete("/delete/:id", AuthorizationUser, CatalogeFournisseurController.delete);
router.put(
  "/changeVisibilite/:id",
  AuthorizationUser,
  CatalogeFournisseurController.changeVisibilite
);
router.put(
  "/update/:id",
  upload.array("image", 4),
  CatalogeFournisseurController.update
);

router.get("/findAllCatalogue", CatalogeFournisseurController.findAllCatalogue);

module.exports = router;
