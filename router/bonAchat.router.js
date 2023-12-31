const bonAchatController = require("../Controllers/bonAchat.controller");
const express = require("express");
const { AuthorizationUser } = require("../middleware/auth/auth");
const router = express.Router();
router.post("/add", AuthorizationUser, bonAchatController.add);
router.put("/update/:id", AuthorizationUser, bonAchatController.update);
router.get("/findAll", bonAchatController.findAll);
router.get("/findOne/:id", bonAchatController.findOne);
router.get("/findByuser/:id", bonAchatController.findByuser);
router.get("/findBypartenaire/:id", bonAchatController.findBypartenaire);
router.delete("/delete/:id", AuthorizationUser, bonAchatController.delete);
module.exports = router;
