const express = require("express") ; 
const router = express.Router()
const commandeDetailController = require ("../Controllers/commandeEnDetail.controller");
const { AuthorizationUser } = require("../middleware/auth/auth");
router.post("/add",AuthorizationUser,commandeDetailController.add);
router.get("/findcommandebyuser/:id",AuthorizationUser,commandeDetailController.findCommandeByuser)
router.get("/findOneCommande/:id",AuthorizationUser,commandeDetailController.findOneCommande)
router.get("/findCommandeBylibrairie/:labrairieId",AuthorizationUser,commandeDetailController.findCommandeBylibrairie)
router.put("/Accepter/:id",AuthorizationUser,commandeDetailController.Accepter)
router.put("/Annuler/:id",AuthorizationUser,commandeDetailController.Annuler)
router.put("/livre/:id",AuthorizationUser,commandeDetailController.livre)
router.post("/addArticle",AuthorizationUser,commandeDetailController.addArticle)
router.delete("/deleteArticle/:produitlabrairieId/:commandeEnDetailId",AuthorizationUser,commandeDetailController.deleteArticle)
router.get("/nb_commande_par_jour/:id",AuthorizationUser,commandeDetailController.nb_commande_par_jour)
router.get("/produit_plus_vendus/:id",AuthorizationUser,commandeDetailController.produit_plus_vendus)
router.get("/nb_commande/:id",AuthorizationUser,commandeDetailController.nb_commande)
router.get("/allcommande",AuthorizationUser,commandeDetailController.findAllcommande)
router.get("/nb_article/:idcmd",AuthorizationUser,commandeDetailController.findNumberArtInCmd)
router.get("/commande30days",AuthorizationUser,commandeDetailController.findcommande30day)
router.get("/same-day",AuthorizationUser,commandeDetailController.findnbrcmdindate)
router.get("/findCommandeByall",AuthorizationUser,commandeDetailController.findCommandeByall)
router.get("/findCommandeByadmindetail/:id",AuthorizationUser,commandeDetailController.findCommandeByadmindetail)
module.exports = router;