const express = require("express");
const passport = require("passport");
const router = express.Router();
const upload = require("../middleware/upload");
const { ROLES, inRole } = require("../security/Rolemiddleware");
const labriarieController = require("../Controllers/labriarie.controller");
const { AuthorizationUser } = require("../middleware/auth/auth");
router.post("/add", AuthorizationUser, labriarieController.addlabrairie);
router.get("/findProfile/:id", labriarieController.findProfile);
router.put(
  "/updateProfile/:id",
  AuthorizationUser,
  upload.array("image", 1),
  labriarieController.updateProfile
);
router.get("/findalllibrarie", labriarieController.findAlllibrarie);
module.exports = router;
