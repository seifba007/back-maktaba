const express = require("express");
const router = express.Router() ;
const produitFavorieController = require("../Controllers/produitFavorie.controller");
const { AuthorizationClient } = require("../middleware/auth/auth");
router.post("/add",produitFavorieController.add)
router.delete("/delete/:id/:userprodfavfk",produitFavorieController.delete)
router.get("/findAllbyclient/:userprodfavfk",produitFavorieController.findAllByclient)
module.exports=router