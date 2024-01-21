const Sequelize = require("sequelize");
const db = require("../config/database");
const userModel = require("./user");
const clientModel = require("./client");
const fournisseurModel = require("./fournisseur");
const partenaireModel = require("./partenaire");
const labrairieModel = require("./labriarie");
const codePromoModel = require("./codepromo");
const bonAchatModel = require("./bonAchat");
const categorieModel = require("./categorie");
const produitlabrairieModel = require("./produitLabriarie");
const commandeEnGrosModel = require("./commandeGros");
const ProduitCommandeEnGrosModel = require("./ProduitCommandeEnGros");
const ProduitCommandeEnDetailModel = require("./ProduitCommandeEnDetail");
const commandeEnDetailModel = require("./CommandeDetail");
const commandeSpecialModel = require("./commandespecial");
const codeClientModel = require("./codeClient");
const avisProduitlibraireModel = require("./avisProduitlibraire");
const signalerProduitlibraireModel = require("./signalerProduitLibraire");
const adressesModel = require("./adresses");
const imageProduitLibrairieModel = require("./imageProduitLibrairie");
const imageCatalogeModel = require("./imageCataloge");
const produitFavorieModel = require("./produitFavorie");
const BecomePartnerModel = require("./BecomePartner");
const adminModel = require("./admin");
const catalogeModel = require("./cataloge");
const suggestionProduitModel = require("./suggestionProduit");
const SouscategorieModel = require("./sousCategorie");
const serviceInformatiqueModel = require("./serviceInformatique");
const donModel = require("./don");
const imageDonModel = require("./imagedon");
const echangeModel = require("./echange");
const offreModel = require("./offre");
const produitaechangeModel = require("./produitaechange");
const produitechangeModel = require("./produitechange");
const inventaireModel = require("./inventaire");
const user = userModel(db, Sequelize);
const client = clientModel(db, Sequelize);
const fournisseur = fournisseurModel(db, Sequelize);
const labrairie = labrairieModel(db, Sequelize);
const partenaire = partenaireModel(db, Sequelize);
const codePromo = codePromoModel(db, Sequelize);
const bonAchat = bonAchatModel(db, Sequelize);
const categorie = categorieModel(db, Sequelize);
const produitlabrairie = produitlabrairieModel(db, Sequelize);
const serviceInformatique = serviceInformatiqueModel(db, Sequelize);
const don = donModel(db, Sequelize);
const imageDon = imageDonModel(db, Sequelize);
const commandeEnGros = commandeEnGrosModel(db, Sequelize);
const ProduitCommandeEnGros = ProduitCommandeEnGrosModel(db, Sequelize);
const commandeEnDetail = commandeEnDetailModel(db, Sequelize);
const commandeSpecial = commandeSpecialModel(db, Sequelize);
const ProduitCommandeEnDetail = ProduitCommandeEnDetailModel(db, Sequelize);
const codeClient = codeClientModel(db, Sequelize);
const avisProduitlibraire = avisProduitlibraireModel(db, Sequelize);
const signalerProduitlibraire = signalerProduitlibraireModel(db, Sequelize);
const adresses = adressesModel(db, Sequelize);
const imageProduitLibrairie = imageProduitLibrairieModel(db, Sequelize);
const imageCataloge = imageCatalogeModel(db, Sequelize);
const produitFavorie = produitFavorieModel(db, Sequelize);
const admin = adminModel(db, Sequelize);
const BecomePartner = BecomePartnerModel(db, Sequelize);
const cataloge = catalogeModel(db, Sequelize);
const suggestionProduit = suggestionProduitModel(db, Sequelize);
const Souscategorie = SouscategorieModel(db, Sequelize);
const echange = echangeModel(db, Sequelize);
const offre = offreModel(db, Sequelize);
const produitaechange = produitaechangeModel(db, Sequelize);
const produitechange = produitechangeModel(db, Sequelize);
const inventaire = inventaireModel(db, Sequelize);
// define relationships
user.hasOne(client, {
  foreignKey: "userclientfk",
  constraints: false,
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
client.belongsTo(user, {
  foreignKey: "userclientfk",
  constraints: false,
});
user.hasOne(fournisseur, {
  foreignKey: "userfourfk",
  constraints: false,
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

fournisseur.belongsTo(user, {
  foreignKey: "userfourfk",
  constraints: false,
});

user.hasOne(labrairie, {
  foreignKey: "userlabfk",
  constraints: false,
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
labrairie.belongsTo(user, {
  foreignKey: "userlabfk",
  constraints: false,
});
user.hasOne(partenaire, {
  foreignKey: "userparfk",
  constraints: false,
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
partenaire.belongsTo(user, {
  foreignKey: "userparfk",
  constraints: false,
});

user.hasOne(admin, {
  foreignKey: "useradminfk",
  constraints: false,
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
admin.belongsTo(user, {
  foreignKey: "useradminfk",
  constraints: false,
});

admin.hasMany(cataloge, {
  foreignKey: "admincatalogefk",
  constraints: false,
});

cataloge.belongsTo(admin, {
  foreignKey: "admincatalogefk",
  constraints: false,
});
labrairie.hasMany(codePromo, {
  foreignKey: "labcodeprfk", 
  constraints: false, 
});
codePromo.belongsTo(labrairie, {
  foreignKey: "labcodeprfk",
  constraints: false,
});
partenaire.hasMany(codePromo, {
  foreignKey: "partcodeprfk",
  constraints: false,
});
codePromo.belongsTo(partenaire, {
  foreignKey: "partcodeprfk",
  constraints: false,
});

fournisseur.hasMany(codePromo, {
  foreignKey: "fourcodeprfk",
  constraints: false,
});

codePromo.belongsTo(fournisseur, {
  foreignKey: "fourcodeprfk",
  constraints: false,
});

client.belongsToMany(codePromo, {
  through: codeClient,
  foreignKey: "clientId", 
  otherKey: "codePromoId", 
  constraints: false,
});

codePromo.belongsToMany(client, {
  through: codeClient,
  foreignKey: "codePromoId",
  otherKey: "clientId", 
  constraints: false,
});

user.hasMany(bonAchat, {
  foreignKey: "userbonachafk",
  constraints: false,
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});


bonAchat.belongsTo(user, {
  foreignKey: "userbonachafk",
  constraints: false,
});

partenaire.hasMany(bonAchat, {
  foreignKey: "partbonachafk",
  constraints: false,
});

bonAchat.belongsTo(partenaire, {
  foreignKey: "partbonachafk",
  constraints: false,
});

fournisseur.hasMany(bonAchat, {
  foreignKey: "fourbonachafk",
  constraints: false,
});

bonAchat.belongsTo(fournisseur, {
  foreignKey: "fourbonachafk",
  constraints: false,
});

labrairie.hasMany(bonAchat, {
  foreignKey: "labbonachafk",
  constraints: false,
});

bonAchat.belongsTo(labrairie, {
  foreignKey: "labbonachafk",
  constraints: false,
});

fournisseur.hasMany(produitlabrairie, {
  foreignKey: "fourprodlabfk",
  constraints: false,
});

produitlabrairie.belongsTo(fournisseur, {
  foreignKey: "fourprodlabfk",
  constraints: false,
});

categorie.hasMany(produitlabrairie, {
  foreignKey: "categprodlabfk",
  constraints: false,
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

produitlabrairie.belongsTo(categorie, {
  foreignKey: "categprodlabfk",
  constraints: false,
});

labrairie.hasMany(produitlabrairie, {
  foreignKey: "labrprodfk",
  constraints: false,
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

produitlabrairie.belongsTo(labrairie, {
  foreignKey: "labrprodfk",
  constraints: false,
});

labrairie.hasMany(commandeEnGros, {
  foreignKey: "labrcomgrofk",
  constraints: false,
});

commandeEnGros.belongsTo(labrairie, {
  foreignKey: "labrcomgrofk",
  constraints: false,
});

fournisseur.hasMany(commandeEnGros, {
  foreignKey: "fourcomgrofk",
  constraints: false,
});

commandeEnGros.belongsTo(fournisseur, {
  foreignKey: "fourcomgrofk",
  constraints: false,
});

user.hasMany(commandeEnDetail, {
  foreignKey: "usercommdetfk",
  constraints: false,
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

commandeEnDetail.belongsTo(user, {
  foreignKey: "usercommdetfk",
  constraints: false,
});


labrairie.hasMany(commandeEnDetail, {
  foreignKey: "labrcomdetfk",
  constraints: false,
});

commandeEnDetail.belongsTo(labrairie, {
  foreignKey: "labrcomdetfk",
  constraints: false,
});

produitlabrairie.belongsToMany(commandeEnDetail, {
  through: ProduitCommandeEnDetail,
  foreignKey: 'prodlaibrcommdetfk', 
  otherKey: 'comdetprodlabrfk', 
  constraints: false,
});

commandeEnDetail.belongsToMany(produitlabrairie, {
  through: ProduitCommandeEnDetail,
  foreignKey: 'comdetprodlabrfk', 
  otherKey: 'prodlaibrcommdetfk', 
  constraints: false,
});



produitlabrairie.belongsToMany(commandeEnGros, {
  through: ProduitCommandeEnGros,
  foreignKey: 'prodlaibrcommgrosfk', 
  otherKey: 'comgrosprodlabrfk', 
  constraints: false,
});

commandeEnGros.belongsToMany(produitlabrairie, {
  through: ProduitCommandeEnGros,
  foreignKey: 'comgrosprodlabrfk', 
  otherKey: 'prodlaibrcommgrosfk', 
  constraints: false,
});

user.hasMany(commandeSpecial, {
  foreignKey: "usercommdespectfk",
  constraints: false,
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

commandeSpecial.belongsTo(user, {
  foreignKey: "usercommdespectfk",
  constraints: false,
});

labrairie.hasMany(commandeSpecial, {
  foreignKey: "labrcomdespectfk",
  constraints: false,
});

commandeSpecial.belongsTo(labrairie, {
  foreignKey: "labrcomdespectfk",
  constraints: false,
});

client.hasMany(avisProduitlibraire, {
  foreignKey: "clientavisprodfk",
  constraints: false,
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

avisProduitlibraire.belongsTo(client, {
  foreignKey: "clientavisprodfk",
  constraints: false,
});
partenaire.hasMany(avisProduitlibraire, {
  foreignKey: "partavisprodfk",
  constraints: false,
});
avisProduitlibraire.belongsTo(partenaire, {
  foreignKey: "partavisprodfk",
  constraints: false,
});
fournisseur.hasMany(avisProduitlibraire, {
  foreignKey: "fournavisprodfk",
  constraints: false,
});
avisProduitlibraire.belongsTo(fournisseur, {
  foreignKey: "fournavisprodfk",
  constraints: false,
});

produitlabrairie.hasMany(avisProduitlibraire, {
  foreignKey: "prodavisproduitsfk",
  constraints: false,
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
avisProduitlibraire.belongsTo(produitlabrairie, {
  foreignKey: "prodavisproduitsfk",
  constraints: false,
});

produitlabrairie.hasMany(signalerProduitlibraire, {
  foreignKey: "prodsignalerfk",
  constraints: false,
});
signalerProduitlibraire.belongsTo(produitlabrairie, {
  foreignKey: "prodsignalerfk",
  constraints: false,
});
client.hasMany(adresses, {
  foreignKey: "clientaddressfk",
  constraints: false,
});
adresses.belongsTo(client, {
  foreignKey: "clientaddressfk",
  constraints: false,
});
partenaire.hasMany(adresses, {
  foreignKey: "partenaireaddressfk",
  constraints: false,
});
adresses.belongsTo(partenaire, {
  foreignKey: "partenaireaddressfk",
  constraints: false,
});
fournisseur.hasMany(adresses, {
  foreignKey: "fournisseuraddressfk",
  constraints: false,
});
adresses.belongsTo(fournisseur, {
  foreignKey: "fournisseuraddressfk",
  constraints: false,
});
produitlabrairie.hasMany(imageProduitLibrairie, {
  foreignKey: "imageprodfk",
  constraints: false,
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
imageProduitLibrairie.belongsTo(produitlabrairie, {
  foreignKey: "imageprodfk",
  constraints: false,
});
cataloge.hasMany(imageCataloge, {
  foreignKey: "imagecatalogefk",
  constraints: false,
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
imageCataloge.belongsTo(cataloge, {
  foreignKey: "imagecatalogefk",
  constraints: false,
});
categorie.hasMany(cataloge, {
  foreignKey: "categoriecatalogefk",
  constraints: false,
});
cataloge.belongsTo(categorie, {
  foreignKey: "categoriecatalogefk",
  constraints: false,
});
user.hasMany(produitFavorie, {
  foreignKey: "userprodfavfk",
  constraints: false,
});
produitFavorie.belongsTo(user, {
  foreignKey: "userprodfavfk",
  constraints: false,
});
partenaire.hasMany(produitFavorie, {
  foreignKey: "partprodfavfk",
  constraints: false,
});
produitFavorie.belongsTo(partenaire, {
  foreignKey: "partprodfavfk",
  constraints: false,
});

produitlabrairie.hasMany(produitFavorie, {
  foreignKey: "prodprodfavfk",
  constraints: false,
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
produitFavorie.belongsTo(produitlabrairie, {
  foreignKey: "prodprodfavfk",
  constraints: false,
});
admin.hasMany(BecomePartner, {
  foreignKey: "adminpartfk",
  constraints: false,
});
BecomePartner.belongsTo(admin, {
  foreignKey: "adminpartfk",
  constraints: false,
});
user.hasMany(suggestionProduit, {
  foreignKey: "usersuggeprodfk",
  constraints: false,
});
suggestionProduit.belongsTo(user, {
  foreignKey: "usersuggeprodfk",
  constraints: false,
});
categorie.hasMany(Souscategorie, {
  foreignKey: "catagsouscatafk",
  constraints: false,
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Souscategorie.belongsTo(categorie, {
  foreignKey: "catagsouscatafk",
  constraints: false,
});
Souscategorie.hasMany(suggestionProduit, {
  foreignKey: "soussuggestfk",
  constraints: false,
});
suggestionProduit.belongsTo(Souscategorie, {
  foreignKey: "soussuggestfk",
  constraints: false,
});
categorie.hasMany(suggestionProduit, {
  foreignKey: "categoriesuggestfk",
  constraints: false,
});
suggestionProduit.belongsTo(categorie, {
  foreignKey: "categoriesuggestfk",
  constraints: false,
});
Souscategorie.hasMany(produitlabrairie, {
  foreignKey: "souscatprodfk",
  constraints: false,
});
produitlabrairie.belongsTo(Souscategorie, {
  foreignKey: "souscatprodfk",
  constraints: false,
});
Souscategorie.hasMany(cataloge, {
  foreignKey: "souscatalogefk",
  constraints: false,
});
cataloge.belongsTo(Souscategorie, {
  foreignKey: "souscatalogefk",
  constraints: false,
});

admin.hasMany(serviceInformatique, {
  foreignKey: "adminservInfofk",
  constraints: false,
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

serviceInformatique.belongsTo(admin, {
  foreignKey: "adminservInfofk",
  constraints: false,
});

don.hasMany(imageDon, {
  foreignKey: "imagedonfk",
  constraints: false,
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
imageDon.belongsTo(don, {
  foreignKey: "imagedonfk",
  constraints: false,
});

admin.hasMany(don, {
  foreignKey: "admindonfk",
  constraints: false,
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

don.belongsTo(admin, {
  foreignKey: "admindonfk",
  constraints: false,
});

echange.hasMany(offre, {
  foreignKey: "echangeofffk",
  constraints: false,
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

offre.belongsTo(echange, {
  foreignKey: "echangeofffk",
  constraints: false,
});

echange.hasMany(produitaechange, {
  foreignKey: "echangeprodaechk",
  constraints: false,
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

produitaechange.belongsTo(echange, {
  foreignKey: "echangeprodaechk",
  constraints: false,
});

echange.hasMany(produitechange, {
  foreignKey: "echangeprodechk",
  constraints: false,
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

produitechange.belongsTo(echange, {
  foreignKey: "echangeprodechk",
  constraints: false,
});

offre.hasMany(produitaechange, {
  foreignKey: "offreprodaechk",
  constraints: false,
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

produitaechange.belongsTo(offre, {
  foreignKey: "offreprodaechk",
  constraints: false,
});

offre.hasMany(produitechange, {
  foreignKey: "offreprodechk",
  constraints: false,
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

produitechange.belongsTo(offre, {
  foreignKey: "offreprodechk",
  constraints: false,
});


labrairie.hasMany(echange, {
  foreignKey: "labechfk",
  constraints: false,
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

echange.belongsTo(labrairie, {
  foreignKey: "labechfk",
  constraints: false,
});



labrairie.hasMany(offre, {
  foreignKey: "labofffk",
  constraints: false,
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

offre.belongsTo(labrairie, {
  foreignKey: "labofffk",
  constraints: false,
});

client.hasMany(echange, {
  foreignKey: "clientechfk",
  constraints: false,
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

echange.belongsTo(client, {
  foreignKey: "clientechfk",
  constraints: false,
});


labrairie.hasMany(inventaire, {
  foreignKey: "labinvfk",
  constraints: false,
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

inventaire.belongsTo(labrairie, {
  foreignKey: "labinvfk",
  constraints: false,
});


produitlabrairie.hasMany(inventaire, {
  foreignKey: "prodlabinvfk",
  constraints: false,
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

inventaire.belongsTo(produitlabrairie, {
  foreignKey: "prodlabinvfk",
  constraints: false,
});

module.exports = {
  user,
  client,
  labrairie,
  fournisseur,
  partenaire,
  codePromo,
  bonAchat,
  categorie,
  produitlabrairie,
  serviceInformatique,
  don,
  imageDon,
  commandeEnGros,
  echange,
  offre,
  produitaechange,
  produitechange,
  ProduitCommandeEnGros,
  commandeEnDetail,
  commandeSpecial,
  ProduitCommandeEnDetail,
  codeClient,
  avisProduitlibraire,
  signalerProduitlibraire,
  adresses,
  imageProduitLibrairie,
  produitFavorie,
  admin,
  BecomePartner,
  cataloge,
  imageCataloge,
  suggestionProduit,
  Souscategorie,
  inventaire
};
