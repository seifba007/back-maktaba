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
  "/findAllbyclient/:clientId",
  avisProduitlibraireController.getAllAvisByClient
);
router.get(
  "/getAllAvisByproduit/:produitlabrairieId",
  avisProduitlibraireController.getAllAvisByproduit
);
router.get(
  "/avislib/:id",
  avisProduitlibraireController.getAllavisBylibriarie
);
router.get(
  "/findAllbyPartnier/:partenaireId",
  avisProduitlibraireController.getAllAvisByPartnier
);

router.get(
  "/getAvisByArticle",
  avisProduitlibraireController.getAvisByArticle
);

router.get(
  "/getTopAvisProduit",
  avisProduitlibraireController.getTopAvisProduit
);
module.exports = router;
