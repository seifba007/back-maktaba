const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const {
    AuthorizationAdmin,
  } = require("../middleware/auth/auth");
const mediaController = require("../Controllers/media.controller");

router.post("/addmedia",AuthorizationAdmin,upload.array("image",1), mediaController.Addmedia);
router.get("/findAllmedia", AuthorizationAdmin,mediaController.findAllmedia);
router.get("/findonemedia/:id", AuthorizationAdmin,mediaController.findonemedia);
router.put("/updatemedia/:id",AuthorizationAdmin,upload.array("image",1), mediaController.update);

module.exports = router;
