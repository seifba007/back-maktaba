const express = require("express");
const BecomePartnerController = require("../Controllers/becomePartner.Controller");
const router = express.Router();
const upload = require("../middleware/upload");
const {
  AuthorizationUser,
  AuthorizationClient,
  AuthorizationAdmin,
} = require("../middleware/auth/auth");
router.post(
  "/add",
  AuthorizationUser,
  upload.array("file", 1),
  BecomePartnerController.add
);
router.get("/findAll", BecomePartnerController.findAll);
router.post(
  "/accepter/:id",
  //AuthorizationUser,
  AuthorizationAdmin,
  BecomePartnerController.accepte
);
router.put(
  "/Annuler/:id",
  AuthorizationUser,
  AuthorizationAdmin,
  BecomePartnerController.Annuler
);
module.exports = router;
