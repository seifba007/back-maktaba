const express = require("express") ; 
const passport = require("passport");
const router = express.Router() ;
const {ROLES,inRole} = require("../security/Rolemiddleware");
const clientController = require ("../Controllers/client.controller");
const { AuthorizationUser } = require("../middleware/auth/auth");
router.get("/findOne/:id",AuthorizationUser,clientController.findOneClient)
module.exports = router