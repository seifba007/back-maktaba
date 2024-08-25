const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const CatalogeController = require("../Controllers/catalogeController");
const { AuthorizationUser,AuthorizationAdmin } = require("../middleware/auth/auth");
router.post(
  
  "/add",
  AuthorizationAdmin,
  upload.array("image", 4),
  CatalogeController.add
);
router.get("/findAll", CatalogeController.findAll);
router.get("/findOne/:id", CatalogeController.findOne);
router.delete("/delete/:id", AuthorizationAdmin, CatalogeController.delete);
router.put(
  "/changeVisibilite/:id",
  AuthorizationAdmin,
  CatalogeController.changeVisibilite
);
router.put(
  "/update/:id",
  AuthorizationAdmin,
  upload.array("image", 4),
  CatalogeController.update
);

router.get("/findAllCatalogue", CatalogeController.findAllCatalogue);

module.exports = router;
