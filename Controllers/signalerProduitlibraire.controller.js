const Model = require ("../Models/index")
const sendMail = require("../config/Noemailer.config");
const signalerProduitlibraireController = {
    
    add : async (req, res)=>{
        try{
            let filesignal = "";
            let productname = ""
            req.files.forEach(async (file) => {
                filesignal = file.path
              });
        
            const {fullnameUser,email,message,prodsignalerfk} = req.body
            const data = {
                fullnameUser : fullnameUser , 
                email : email , 
                message : message , 
                image : filesignal , 
                prodsignalerfk : prodsignalerfk
            }
            const produit = await Model.produitlabrairie.findAll({
                where:{
                    id: prodsignalerfk
                }
            })
            productname = produit[0].dataValues.titre
            Model.signalerProduitlibraire.create(data).then((response) => {
                if(response !== null){
                    sendMail.sendSignaleProduitEmail(email,message,productname)
                    return res.status(200).json({
                        success : true , 
                        message : " signalerProduitlibraire Done !!! "
                    })
                }else{
                    return res.status(400).json({
                        success : false , 
                        message : "  err to add  signale " , 
                  
                    })
                }
            })
        }catch(err){
            return res.status(400).json({
                success: false,
                error: err,
            });
        }
    }
}
module.exports = signalerProduitlibraireController