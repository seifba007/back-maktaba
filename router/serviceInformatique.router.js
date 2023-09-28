const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");

const serviceInformatiqueController = require("../Controllers/serviceInformatique.controller");
const { AuthorizationUser } = require("../middleware/auth/auth");

router.post("/addServiceInfo", AuthorizationUser,upload.array("Fichier",1), serviceInformatiqueController.addServiceInfo);
router.get(
    "/findServiceInfobyuser/:id",AuthorizationUser,
    serviceInformatiqueController.findServiceByuser
  );

  router.get(
    "/findServiceInfobylibrairie/:id",AuthorizationUser,
    serviceInformatiqueController.findServiceByLibrairie
  );

  router.get(
    "/findAllServiceInfo",AuthorizationUser,
    serviceInformatiqueController.findAllServices
  );

  router.delete(
    "/deleteServiceInfo",
    serviceInformatiqueController.deleteServiceInfo
  );
module.exports = router;