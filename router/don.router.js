const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const { AuthorizationUser } = require("../middleware/auth/auth");

const donController = require("../Controllers/don.controller");

router.post("/addDon",AuthorizationUser, upload.array("Fichier",10), donController.addDon);
router.put(
    "/accepterDon/:id",
    AuthorizationUser,
    donController.Accepter
  );

  router.put(
    "/annulerDon/:id",
    AuthorizationUser,
    donController.Annuler
  );

  router.get(
    "/findAllDon",
    donController.findAllDon
  );

  router.delete(
    "/deleteDon",
    AuthorizationUser,
    donController.deleteDon
  );
module.exports = router;