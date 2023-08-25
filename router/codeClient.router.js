const express = require("express");
const router = express.Router();
const codeClientController = require("../Controllers/codeClient.controller");
const { AuthorizationClient } = require("../middleware/auth/auth");
router.post("/add", AuthorizationClient, codeClientController.add);
router.delete("/delete", AuthorizationClient, codeClientController.delete);
router.get("/findCode", codeClientController.findcode);
module.exports = router;
