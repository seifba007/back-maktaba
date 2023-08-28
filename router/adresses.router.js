const express = require("express");
const adressesController = require("../Controllers/adresses.controller");
const { AuthorizationUser } = require("../middleware/auth/auth");
const router = express.Router();
router.post("/add", AuthorizationUser, adressesController.add);
router.post("/addbypartnier", adressesController.addbypartnier);
router.put(
  "/update/:id/:clientId",
  AuthorizationUser,
  adressesController.update
);
router.delete(
  "/delete/:id/:clientId",
  AuthorizationUser,
  adressesController.delete
);
module.exports = router;
