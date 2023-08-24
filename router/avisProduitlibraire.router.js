const express = require ("express") ;
const avisProduitlibraireController =  require ("../Controllers/avisProduitlibraire.controller") 
const router = express.Router();
const { AuthorizationUser } = require("../middleware/auth/auth");
router.post("/add",AuthorizationUser ,avisProduitlibraireController.add)
router.put("/update/:id",AuthorizationUser,avisProduitlibraireController.update)
router.delete("/delete/:id",AuthorizationUser,avisProduitlibraireController.delete)
router.get("/findAllbyclient/:clientId",AuthorizationUser,avisProduitlibraireController.getAllAvisByClient)
router.get("/getAllAvisByproduit/:produitlabrairieId",AuthorizationUser,avisProduitlibraireController.getAllAvisByproduit)
router.get("/avislib/:id",AuthorizationUser,avisProduitlibraireController.getAllavisBylibriarie)
router.get("/findAllbyPartnier/:partenaireId",AuthorizationUser,avisProduitlibraireController.getAllAvisByPartnier)

module.exports = router;

