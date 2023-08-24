const bonAchatController = require("../Controllers/bonAchat.controller");
const express = require("express");
const { AuthorizationUser } = require("../middleware/auth/auth");
const router = express.Router();
router.post("/add", AuthorizationUser, bonAchatController.add);
router.put("/update/:id", AuthorizationUser, bonAchatController.update);
router.get("/findAll", AuthorizationUser, bonAchatController.findAll);
router.get("/findOne/:id", AuthorizationUser, bonAchatController.findOne);
router.get("/findByuser/:id", AuthorizationUser, bonAchatController.findByuser);
router.get(
  "/findBypartenaire/:id",
  AuthorizationUser,
  bonAchatController.findBypartenaire
);
router.delete("/delete/:id", AuthorizationUser, bonAchatController.delete);
module.exports = router;
