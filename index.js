const express = require('express')
const bodyParser = require('body-parser')
const passport = require("passport");
const session = require("express-session");
const app = express()
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});
const db = require('./config/database') ;
require('dotenv').config()
const port = process.env.PORT 
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use('/uploads',express.static("uploads"))
require('./security/passport')(passport)
/** les router */
const userRouter= require("./router/user.router")
const clientRouter = require ("./router/client.router")
const codePromoRouter = require ("./router/codePromo.router")
const bonAchatRouter = require("./router/bonAchat.router")
const labrairieRouter = require("./router/labriarie.router")
const partenaireRouter = require("./router/partenaire.router")
const fournisseurRouter = require("./router/fournisseur.router")
const categorieRouter = require ("./router/categorie.router")
const produitLabrairieRouter = require ("./router/produitLabrairie.router")
const commandeEnGrosRouter = require("./router/commandeGros.router")
const commandeEnDetail = require("./router/commandeDetail.router")
const serviceInformatiqueRouter = require("./router/serviceInformatique.router")
const DonRouter = require("./router/don.router")
const EchangeRouter = require("./router/echange.router")
const OffreRouter = require("./router/offre.router")
const codeClient = require("./router/codeClient.router")
const avisProduitlibraire = require ("./router/avisProduitlibraire.router")
const signalerProduitlibraire = require ("./router/signalerProduitlibraire.router")
const adresses = require("./router/adresses.router")
const produitFavorie= require("./router/produitFavorie.router")
const adminRouter=require("./router/admin.router")
const BecomePartner = require ("./router/becomePartner.router")
const Cataloge=require("./router/cataloge.router")
const sousCategorie = require("./router/sousCategorie.router")
const suggestionProduit = require("./router/suggestionProduit.router");
const echange = require('./Models/echange');
app.use("/user",userRouter)
app.use("/client",clientRouter)
app.use("/codePromo",codePromoRouter)
app.use("/bonAchat",bonAchatRouter)
app.use("/labrairie",labrairieRouter)
app.use("/partenaire",partenaireRouter)
app.use("/fournisseur",fournisseurRouter)
app.use("/categorie",categorieRouter)
app.use("/produitLabrairie",produitLabrairieRouter)
app.use("/commandeDetail",commandeEnDetail)
app.use("/commandeengros",commandeEnGrosRouter)
app.use("/serviceInformatique",serviceInformatiqueRouter)
app.use("/don",DonRouter)
app.use("/echange",EchangeRouter)
app.use("/offre",OffreRouter)
app.use("/codeClient",codeClient)
app.use("/avisProduitlibraire",avisProduitlibraire)
app.use("/signalerProduitlibraire",signalerProduitlibraire)
app.use("/adresses",adresses)
app.use("/produitFavorie",produitFavorie)
app.use("/admin",adminRouter)
app.use("/BecomePartner",BecomePartner)
app.use("/cataloge",Cataloge)
app.use("/sousCategorie",sousCategorie)
app.use("/suggestionProduit",suggestionProduit)
/** end  */
/** connection avec DB */
/** end  */
/** connection avec DB */



async function connectToDatabase() {
  console.log("Trying to connect via sequelize");
  await db.sync();
  await db.authenticate();
  console.log("=> Created a new connection.");
}
connectToDatabase();
app.listen(port, () => console.log(`server running on port ${port}`)) 