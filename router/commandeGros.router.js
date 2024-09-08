const express = require("express");
const commandeEnGrosController = require("../Controllers/commandeEnGros.controller");
const router = express.Router()
const { AuthorizationUser } = require("../middleware/auth/auth");
router.post("/add", AuthorizationUser,commandeEnGrosController.addcommandegros) 
router.get("/findAll/:id",commandeEnGrosController.findcommandeByLabriarie)

module.exports = router ;