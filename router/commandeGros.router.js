const express = require("express");
const commandeEnGrosController = require("../Controllers/commandeEnGros.controller");
const router = express.Router()
router.post("/add", commandeEnGrosController.add) 
router.get("/findAll/:id",commandeEnGrosController.findcommandeByLabriarie)
router.get("/findAllLivraison/:id", commandeEnGrosController.findAllLivraison);
module.exports = router ;