const express = require("express");
const avisproduitfournisseur = require("../Controllers/avisProduitfournisseur.controller");
const router = express.Router();
const { AuthorizationUser } = require("../middleware/auth/auth");
router.post("/add",  avisproduitfournisseur.add);
router.put(
  "/update/:id",
  AuthorizationUser,
  avisproduitfournisseur.update
);
router.delete(
  "/delete/:id",
  //AuthorizationUser,
  avisproduitfournisseur.delete
);
router.get(
  "/findAllbyclient/:clientavisprodfourfk",
  avisproduitfournisseur.getAllAvisByClient
);
router.get(
  "/getAllAvisByproduit/:prodfouravisfk",
  avisproduitfournisseur.getAllAvisByproduit
);
router.get(
  "/avislib/:id",
  avisproduitfournisseur.getAllavisBylibriarie
);
router.get(
  "/findAllbyPartnier/:partavisprodfourfk",
  avisproduitfournisseur.getAllAvisByPartnier
);

router.get(
  "/getAvisByArticle",
  avisproduitfournisseur.getAvisByArticle
);

router.get(
  "/getTopAvisProduits",
  avisproduitfournisseur.getTopAvisProduit
);
module.exports = router;
