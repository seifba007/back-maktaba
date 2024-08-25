const express = require("express");
const router = express.Router();

const offreController = require("../Controllers/offre.controller");
const { AuthorizationUser } = require("../middleware/auth/auth");

router.post("/addOffre",AuthorizationUser, offreController.AddOffre);
router.get("/findAllOffres", offreController.findAllOffre);

router.get("/findOffresbyechange/:id", offreController.findOffrebyechange);

router.get("/findOffresbylibrarie/:id", offreController.findOffrebylibrarire);
router.get("/findoneOffre/:id", offreController.findoneOffre);

router.put("/accepterOffre/:id", AuthorizationUser,offreController.Accepter);
router.put("/changestate/:id", AuthorizationUser,offreController.Changestate);
router.get("/findAllOffresaccepter/:id", offreController.findAllOffreAccepter);

module.exports = router;
