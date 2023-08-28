const express = require("express");
const router = express.Router() ;
const produitFavorieController = require("../Controllers/produitFavorie.controller");
const { AuthorizationClient } = require("../middleware/auth/auth");
router.post("/add",produitFavorieController.add)
router.delete("/delete/:id/:userId",produitFavorieController.delete)
router.get("/findAllbyclient/:userId",produitFavorieController.findAllByclient)
module.exports=router