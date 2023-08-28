const Model = require("../Models/index")
const bcrypt = require("bcrypt");
const sendMail = require("../config/Noemailer.config");
const { response } = require("express");
const partenaireController = {
    addpartenaire : async (req, res)=>{
        try{
            const { email, fullname} = req.body;
                const characters =
                  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
                let Password = "";
                for (let i = 0; i < 25; i++) {
                  Password +=
                    characters[Math.floor(Math.random() * characters.length)];
                }
                const passwordHash = bcrypt.hashSync(Password, 10);
                const datauser = {
                  email: email,
                  fullname:fullname,
                  password: passwordHash,
                  email_verifie: "verifie",
                  role: "partenaire",
                  etatCompte:"active",
                };
                Model.user.create(datauser).then((user) => {
                  if (user !== null) {
                    const datapartenaire = {
                      id : user.id,
                      userId : user.id
                    }
                    Model.partenaire.create(datapartenaire).then((partenaire)=>{
                      if(partenaire!==null){
                        sendMail.acceptationDemendePartenariat(email,Password)
                        return res.status(200).json({
                            success: true,
                            message: "success create partenaire",
                          });
                        }
                    })
                  }
                });  
        }catch(err){
            return res.status(400).json({
                success:false,
                error: err
            })
        }
        
    },
    findPartnaire : async (req, res)=>{
      try{
          Model.partenaire.findAll({include : [{model:Model.user}]}).then((response)=>{
              if(response!==null){
                return res.status(200).json({
                  success:true , 
                  partainer : response
                })
              }else{
                res.status(400).json({
                  success : false , 
                  message : "zero partainer"
                })
              }
          })
      }catch(err){
        return res.status(400).json({
          success:false,
          error: err
      })
      }
    },

    findOnePartnaire: async (req, res) => {
      try {
        Model.user
          .findOne({
            where: { id: req.params.id },
            attributes: { exclude: ["password", "createdAt", "updatedAt","email_verifie","role"] },
            include: [
              {
                model: Model.partenaire,
                attributes: ["id","image","nameetablissement","email","address","telephone","createdAt","updatedAt","Facebook","Instagram"],
                include: [
                  {
                    model: Model.adresses,
                    attributes: {
                      exclude: ["partenaireId ","createdAt", "updatedAt"],
                    },
                  },
                ],
              },
            ],
            
          })
          .then((response) => {
            if (response !== null) {
              return res.status(200).json({
                success: true,
                partenaire: response,
              });
            } else {
              return res.status(200).json({
                success: false,
                message: "client introuvable",
              });
            }
          });
      } catch (err) {
        return res.status(400).json({
          success: false,
          err: err,
        });
      }
    },
    updateProfile: async (req, res) => {
      const {nameetablissement,telephone,facebook,instagram,email,address}=req.body
      try {
        const data = {
          nameetablissement :nameetablissement,
          address:address,
          ville:null,
          telephone : telephone,
          Facebook : facebook , 
          Instagram : instagram,
          email:email
        }

        Model.partenaire.update(data,{where:{id:req.params.id}}).then((response)=>{
          console.log(response)
          if(response!==0){
            return res.status(200).json({
              success :true , 
              message : "update success"
            })
          }else{
            return res.status(400).json({
              success : false , 
              message: "error to update "
            })
          }
        })
      } catch (err) {
        return res.status(200).json({
          success: false,
          error: "err",
        });
      }
    },
    updateProfileimge: async (req, res) => {

      try {
        if(req.files.length!==0){
          req.body["image"] = req.files[0].filename;
        }else{
          req.body["image"]==null
        }
        const {image}=req.body
        const data = {
          image: image,
        }

        Model.partenaire.update(data,{where:{id:req.params.id}}).then((response)=>{
          console.log(response)
          if(response!==0){
            return res.status(200).json({
              success :true , 
              message : "update  image success"
            })
          }else{
            return res.status(200).json({
              success : false , 
              message: "error to update "
            })
          }
        })
      } catch (err) {
        return res.status(400).json({
          success: false,
          error: "err",
        });
      }
    },
}
module.exports=partenaireController