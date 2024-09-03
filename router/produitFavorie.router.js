const express = require("express");
const router = express.Router() ;
const produitFavorieController = require("../Controllers/produitFavorie.controller");
const { AuthorizationUser } = require("../middleware/auth/auth");
router.post("/add",AuthorizationUser , produitFavorieController.add)
router.delete("/delete/:id/:userprodfavfk", AuthorizationUser,produitFavorieController.delete)
router.get("/findAllbyclient/:userprodfavfk",produitFavorieController.findAllByclient)
module.exports=router