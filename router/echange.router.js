const express = require("express");
const router = express.Router();
const { AuthorizationUser } = require("../middleware/auth/auth");

const echangeController = require("../Controllers/echange.controller");

router.post("/addEchange",AuthorizationUser, echangeController.AddEchange);

router.put(
    "/accepterEchange/:id",
    AuthorizationUser,
    echangeController.Accepter
);

  router.put(
    "/annulerEchange/:id",
    AuthorizationUser,
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
    AuthorizationUser,
    echangeController.deleteEchange
  );
module.exports = router;