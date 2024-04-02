const express = require("express");
const router = express.Router();

const offreController = require("../Controllers/offre.controller");

router.post("/addOffre", offreController.AddOffre);
router.get("/findAllOffres", offreController.findAllOffre);

router.get("/findOffresbyechange/:id", offreController.findOffrebyechange);

router.get("/findOffresbylibrarie/:id", offreController.findOffrebylibrarire);

router.put("/accepterOffre/:id", offreController.Accepter);

router.get("/findAllOffresaccepter/:id", offreController.findAllOffreAccepter);

module.exports = router;
