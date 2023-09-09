const express = require("express");
const avisProduitlibraireController = require("../Controllers/avisProduitlibraire.controller");
const router = express.Router();
const { AuthorizationUser } = require("../middleware/auth/auth");
router.post("/add", AuthorizationUser, avisProduitlibraireController.add);
router.put(
  "/update/:id",
  AuthorizationUser,
  avisProduitlibraireController.update
);
router.delete(
  "/delete/:id",
  AuthorizationUser,
  avisProduitlibraireController.delete
);
router.get(
  "/findAllbyclient/:clientavisprodfk",
  avisProduitlibraireController.getAllAvisByClient
);
router.get(
  "/getAllAvisByproduit/:prodavisproduitsfk",
  avisProduitlibraireController.getAllAvisByproduit
);
router.get(
  "/avislib/:id",
  avisProduitlibraireController.getAllavisBylibriarie
);
router.get(
  "/findAllbyPartnier/:partavisprodfk",
  avisProduitlibraireController.getAllAvisByPartnier
);

router.get(
  "/getAvisByArticle",
  avisProduitlibraireController.getAvisByArticle
);

router.get(
  "/getTopAvisProduits",
  avisProduitlibraireController.getTopAvisProduit
);
module.exports = router;
