const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");

const donController = require("../Controllers/don.controller");

router.post("/addDon", upload.array("Fichier",10), donController.addDon);
router.put(
    "/accepterDon/:id",
    donController.Accepter
  );

  router.put(
    "/annulerDon/:id",
    donController.Annuler
  );

  router.get(
    "/findAllDon",
    donController.findAllDon
  );

  router.delete(
    "/deleteDon",
    donController.deleteDon
  );
module.exports = router;