const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");

const serviceInformatiqueController = require("../Controllers/serviceInformatique.controller");
const { AuthorizationUser } = require("../middleware/auth/auth");

router.post("/addServiceInfo", upload.array("Fichier",1), serviceInformatiqueController.addServiceInfo);
router.put(
    "/accepterServiceInfo/:id",
    serviceInformatiqueController.Accepter
  );

  router.put(
    "/annulerServiceInfo/:id",
    serviceInformatiqueController.Annuler
  );

  router.get(
    "/findAllServiceInfo",
    serviceInformatiqueController.findAllServices
  );

  router.delete(
    "/deleteServiceInfo",
    serviceInformatiqueController.deleteServiceInfo
  );
module.exports = router;