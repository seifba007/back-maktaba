const express = require("express");
const router = express.Router();
const codeClientController = require("../Controllers/codeClient.controller");
const { AuthorizationUser } = require("../middleware/auth/auth");
router.post("/add", AuthorizationUser, codeClientController.add);
router.delete("/delete", AuthorizationUser, codeClientController.delete);
router.get("/findCode", codeClientController.findcode);
module.exports = router;
