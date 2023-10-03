const express = require("express");
const router = express.Router();

const offreController = require("../Controllers/offre.controller");

router.post("/addOffre",  offreController.AddOffre);
router.get(
    "/findAllOffres",
    offreController.findAllOffre
  );

  router.get(
    "/findOffresbyechange/:id",
    offreController.findOffrebyechange
  );

  router.get(
    "/findOffresbylibrarie/:id",
    offreController.findOffrebylibrarire
  );

module.exports = router;