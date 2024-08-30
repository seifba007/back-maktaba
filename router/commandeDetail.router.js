const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");

const commandeDetailController = require("../Controllers/commandeEnDetail.controller");
const { AuthorizationUser } = require("../middleware/auth/auth");
router.post("/add", commandeDetailController.add);
router.post("/calculecommande", commandeDetailController.calculecommande);
router.post("/addcommandeinviter", commandeDetailController.addcommandeinviter);
router.post("/addcommandespecial",AuthorizationUser, upload.array("Fichier",1), commandeDetailController.addcommandespecial);
router.post("/addcommandespecialinviter", upload.array("Fichier",1), commandeDetailController.addcommandespecialinviter);
router.get(
  "/findcommandebyuser/:id",
  commandeDetailController.findCommandeByuser
);

router.get(
  "/findCommandeByidentifiant",
  commandeDetailController.findCommandeByidentifiant
);

router.get(
  "/findSpecCommandeBycodepromo",
  commandeDetailController.findSpecCommandeBycodepromo
);

router.get(
  "/findspeccommandebyuser/:id",
  commandeDetailController.findSpecCommandeByuser
);

router.get(
  "/findCommandeident",
  commandeDetailController.findCommandeident
);
router.get(
  "/findCommandespecident",
  commandeDetailController.findCommandespecident
);
router.get("/findOneCommande/:id", commandeDetailController.findOneCommande);
router.get("/findOneSpecidentCommande/:id", commandeDetailController.findOneSpecidentCommande);
router.get("/findOneCommandeident/:id", commandeDetailController.findOneCommandeident);
router.get("/findOneSpecCommande/:id", commandeDetailController.findOneSpecCommande);
router.get(
  "/findCommandeBylibrairie/:id",
  commandeDetailController.findCommandeBylibrairie
);
router.get(
  "/findLivraisonBylibrairie/:id",
  commandeDetailController.findLivraisonBylibrairie
);


router.get(
  "/findSpecCommandeBylibrairie/:id",
  commandeDetailController.findSpecCommandeBylibrairie
);
router.put(
  "/Accepter/:id",
  AuthorizationUser,
  commandeDetailController.Accepter
);
router.put(
  "/AccepterCommandeSpecial/:id",
  AuthorizationUser,
  commandeDetailController.AccepterCommandeSpecial
);
router.put(
  "/AccepterCommandeidentifiant/:id",
  commandeDetailController.AccepterCommandeidentifiant
);
router.put(
  "/AccepterCommandespecidentifiant/:id",
  commandeDetailController.AccepterCommandespecidentifiant
);
router.put("/Annuler/:id", AuthorizationUser, commandeDetailController.Annuler);
router.put("/AnnulerCommandeSpecial/:id", AuthorizationUser, commandeDetailController.Annulercommandespecial);
router.put("/AnnulercommandeIdentifiant/:id", commandeDetailController.AnnulercommandeIdentifiant);
router.put("/AnnulercommandespecIdentifiant/:id", commandeDetailController.AnnulercommandespecIdentifiant);
router.put("/livre/:id", AuthorizationUser, commandeDetailController.livre);
router.put("/livreCommandeSpecial/:id", AuthorizationUser, commandeDetailController.livreCommandeSpecial);
router.put("/livreCommandeIdentifiant/:id", commandeDetailController.livreCommandeIdentifiant);
router.put("/livreCommandespecIdentifiant/:id", commandeDetailController.livreCommandespecIdentifiant);
router.post(
  "/addArticle",
  AuthorizationUser,
  commandeDetailController.addArticle
);
router.delete(
  "/deleteArticle/:produitlabrcomdetfk/:comdetprodlabrfk",
  AuthorizationUser,
  commandeDetailController.deleteArticle
);

router.delete(
  "/deletecommandespecsial",
  commandeDetailController.deleteCommandeSpec
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
router.get("/findCommandefiltrage", commandeDetailController.commandefiltrage);

router.get(
  "/findCommandebyartandid/:id",
  commandeDetailController.findCommabyartandid
);

module.exports = router;
