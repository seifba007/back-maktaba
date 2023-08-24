const express = require("express");
const router = express.Router();
const SousCategorieController = require("../Controllers/sousCategorieController");
const { AuthorizationUser } = require("../middleware/auth/auth");
router.post("/add", AuthorizationUser, SousCategorieController.add);
router.get("/findAll", AuthorizationUser, SousCategorieController.find);
router.put(
  "/updateSousCategorie/:id",
  AuthorizationUser,
  SousCategorieController.update
);
router.delete(
  "/deleteSousCategorie/:id",
  AuthorizationUser,
  SousCategorieController.delete
);
router.get(
  "/findBycategorie/:id",
  AuthorizationUser,
  SousCategorieController.findByCategorie
);
module.exports = router;
