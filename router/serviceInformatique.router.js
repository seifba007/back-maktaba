const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");

const serviceInformatiqueController = require("../Controllers/serviceInformatique.controller");
const { AuthorizationUser } = require("../middleware/auth/auth");

router.post("/addServiceInfo",AuthorizationUser, upload.array("Fichier",1), serviceInformatiqueController.addServiceInfo);
router.put(
    "/accepterServiceInfo/:id",
    AuthorizationUser,
    serviceInformatiqueController.Accepter
  );

  router.put(
    "/annulerServiceInfo/:id",
    AuthorizationUser,
    serviceInformatiqueController.Annuler
  );

  router.get(
    "/findAllServiceInfo",
    serviceInformatiqueController.findAllServices
  );

  router.delete(
    "/deleteServiceInfo",
    AuthorizationUser,
    serviceInformatiqueController.deleteServiceInfo
  );
module.exports = router;