const express = require("express");
const router = express.Router();
const commandeDetailController = require("../Controllers/commandeEnDetail.controller");
const { AuthorizationUser } = require("../middleware/auth/auth");
router.post("/add", AuthorizationUser, commandeDetailController.add);
router.get(
  "/findcommandebyuser/:id",
  commandeDetailController.findCommandeByuser
);
router.get("/findOneCommande/:id", commandeDetailController.findOneCommande);
router.get(
  "/findCommandeBylibrairie/:labrairieId",
  commandeDetailController.findCommandeBylibrairie
);
router.put(
  "/Accepter/:id",
  AuthorizationUser,
  commandeDetailController.Accepter
);
router.put("/Annuler/:id", AuthorizationUser, commandeDetailController.Annuler);
router.put("/livre/:id", AuthorizationUser, commandeDetailController.livre);
router.post(
  "/addArticle",
  AuthorizationUser,
  commandeDetailController.addArticle
);
router.delete(
  "/deleteArticle/:produitlabrairieId/:commandeEnDetailId",
  AuthorizationUser,
  commandeDetailController.deleteArticle
);
router.get(
  "/nb_commande_par_jour/:id",
  commandeDetailController.nb_commande_par_jour
);
router.get(
  "/produit_plus_vendus/:id",
  commandeDetailController.produit_plus_vendus
);
router.get("/nb_commande/:id", commandeDetailController.nb_commande);
router.get("/allcommande", commandeDetailController.findAllcommande);
router.get("/nb_article/:idcmd", commandeDetailController.findNumberArtInCmd);
router.get("/commande30days", commandeDetailController.findcommande30day);
router.get("/same-day", commandeDetailController.findnbrcmdindate);
router.get("/findCommandeByall", commandeDetailController.findCommandeByall);
router.get(
  "/findCommandeByadmindetail/:id",
  commandeDetailController.findCommandeByadmindetail
);
router.get("/findCommandebyart", commandeDetailController.findCommabyart);
module.exports = router;
