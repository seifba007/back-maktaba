const express = require("express") ; 
const passport = require("passport");
const router = express.Router() ; 
const upload = require ("../middleware/upload")
const {ROLES,inRole} = require("../security/Rolemiddleware");
const partenaireController = require ("../Controllers/partenaire.controller");
router.post("/add",partenaireController.addpartenaire);
router.get("/findAll",partenaireController.findPartnaire)
router.get("/findOnePartnaire/:id",partenaireController.findOnePartnaire)
router.put("/updateProfile/:id",partenaireController.updateProfile)
router.put("/updateProfileimge/:id",upload.array("image",1),partenaireController.updateProfileimge)
module.exports = router