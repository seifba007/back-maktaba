const express = require("express");
const router = express.Router();

const echangeController = require("../Controllers/echange.controller");

router.post("/addEchange", echangeController.AddEchange);

router.put(
    "/accepterEchange/:id",
    echangeController.Accepter
);

  router.put(
    "/annulerEchange/:id",
    echangeController.Annuler
  );

  router.get(
    "/findAllEchange",
    echangeController.findAllEchange
  );
  router.get(
    "/findEchangelaibrairie/:id",
    echangeController.findEchangeLibrarire
  );

  router.get(
    "/findEchangeclient/:id",
    echangeController.findEchangeClient
  );
  router.delete(
    "/deleteEchange",
    echangeController.deleteEchange
  );
module.exports = router;