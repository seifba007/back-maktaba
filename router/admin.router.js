const express  = require ("express") ; 
const adminController = require ("../Controllers/adminController") ; 
const router = express.Router();
router.post("/add",adminController.add)
router.get("/allusersrole",adminController.findAllusersrole)
router.get("/allcategories",adminController.findAllcategories)
router.get("/allproduits",adminController.findAllproduits)
router.delete("/deletecategory",adminController.deletecategory)
router.post("/addcategory",adminController.addcategory)
router.delete("/deletesuggestion",adminController.deletesuggestion)
router.get("/getallavisuser/nombre_total_etoiles/:id",adminController.findAllavis)
router.get("/getavgavisuser/moyenne_avis/:id",adminController.findavgavis)
router.get("/top10product",adminController.gettop10prod)
router.get("/nometablissement",adminController.findusernameetabllis)
module.exports = router;