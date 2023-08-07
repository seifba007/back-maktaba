const express  = require ("express") ; 
const adminController = require ("../Controllers/adminController") ; 
const router = express.Router();
router.post("/add",adminController.add)
router.get("/allusersrole",adminController.findAllusersrole)
router.get("/allcategories",adminController.findAllcategories)
module.exports = router;