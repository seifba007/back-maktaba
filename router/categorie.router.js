const express = require("express");
const router = express.Router();
const categorieController = require("../Controllers/categorie.controller");
const { AuthorizationAdmin } = require("../middleware/auth/auth");
router.post("/add", AuthorizationAdmin, categorieController.add);
router.get("/findCategorie", categorieController.find);
router.put(
  "/updateCategorie/:id",
  AuthorizationAdmin,
  categorieController.update
);

router.delete(
  "/deleteCategorie/:id",
  AuthorizationAdmin,
  categorieController.delete
);
router.get(
  "/NbproduitlibBycategorie/:id",
  categorieController.NbfindProduitLibByCategorie
);
module.exports = router;
