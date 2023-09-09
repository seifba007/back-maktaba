const express = require("express");
const adressesController = require("../Controllers/adresses.controller");
const { AuthorizationUser } = require("../middleware/auth/auth");
const router = express.Router();
router.post("/add",adressesController.add);
router.post("/addbypartnier", adressesController.addbypartnier);
router.put(
  "/update/:id/:clientaddressfk",
  AuthorizationUser,
  adressesController.update
);
router.delete(
  "/delete/:id/:clientaddressfk",
  AuthorizationUser,
  adressesController.delete
);
module.exports = router;
