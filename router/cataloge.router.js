const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const CatalogeController = require("../Controllers/catalogeController");
const { AuthorizationUser } = require("../middleware/auth/auth");
router.post("/add", AuthorizationUser, upload.array("image",3),CatalogeController.add)
router.get("/findAll", CatalogeController.findAll);
router.get("/findOne/:id", CatalogeController.findOne);
router.delete("/delete/:id", AuthorizationUser, CatalogeController.delete);
router.put(
  "/changeVisibilite/:id",
  AuthorizationUser,
  CatalogeController.changeVisibilite
);
router.put(
  "/update/:id",
  AuthorizationUser,
  upload.array("image", 3),
  CatalogeController.update
);
module.exports = router;
