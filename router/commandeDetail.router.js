const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");

const commandeDetailController = require("../Controllers/commandeEnDetail.controller");
const { AuthorizationUser } = require("../middleware/auth/auth");
router.post("/add", AuthorizationUser, commandeDetailController.add);

router.post("/addcommandespecial", upload.array("Fichier",1), commandeDetailController.addcommandespecial);

router.get(
  "/findcommandebyuser/:id",
  commandeDetailController.findCommandeByuser
);

router.get(
  "/findspeccommandebyuser/:id",
  commandeDetailController.findSpecCommandeByuser
);
router.get("/findOneCommande/:id", commandeDetailController.findOneCommande);
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
router.put("/Annuler/:id", AuthorizationUser, commandeDetailController.Annuler);
router.put("/AnnulerCommandeSpecial/:id", AuthorizationUser, commandeDetailController.Annulercommandespecial);
router.put("/livre/:id", AuthorizationUser, commandeDetailController.livre);
router.put("/livreCommandeSpecial/:id", AuthorizationUser, commandeDetailController.livreCommandeSpecial);
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
