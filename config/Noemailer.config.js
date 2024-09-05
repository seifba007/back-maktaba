const nodemailer = require("nodemailer");

const user = "maktba.tn01@gmail.com";
const pass = "duvwkiciangtpdem";

const transport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: user,
    pass: pass,
  },
});

module.exports.sendEmailVerification = (email, link) => {
  const mailOptions = {
    from: user, // Should be a valid email address
    to: email,
    subject: "Vérification Email Maktaba.tn",
    html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <style>
        /* Add your styles here */
      </style>
    </head>
    <body>
      <table style="width: 100%; background-color: #f7f7f7;" cellpadding="0" cellspacing="0">
        <tr>
          <td align="center">
            <table style="width: 580px; background-color: #ffffff;" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding: 30px;">
                  <img src="https://res.cloudinary.com/doytw80zj/image/upload/v1693747797/Fichier_8_15_chy0ep.png" alt="Maktaba Logo" width="100" height="70">
                </td>
              </tr>
              <tr>
                <td style="padding: 30px; text-align: center;">
                  <h1 style="font-size: 30px; color: #444444;">Before we <span style="color: #e9b949;">get started...</span></h1>
                  <p style="font-size: 18px; color: #444444;">Please take a second to make sure we’ve got your email right</p>
                  <a href="${link}" style="display: inline-block; padding: 14px 20px; background-color: #e9b949; color: #ffffff; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 18px;">Confirm your email</a>
                  <p style="font-size: 18px; color: #444444; margin-top: 20px;">Or copy and paste this link into your browser: <a href="${link}">${link}</a></p>
                  <p style="font-size: 18px; color: #444444;">Maktaba Team</p>
                </td>
              </tr>
              <tr>
                <td style="padding: 30px; text-align: center; background-color: #f7f7f7;">
                  <p style="font-size: 24px; color: #a7a7a7;">[Slogan here]</p>
                  <p style="font-size: 12px; color: #444444;">Borj Louzir Ariana, Tunis, Tunisia | Ariana</p>
                  <p style="font-size: 12px; color: #444444;">Email: <a href="mailto:maktaba.tn@gmail.com">maktaba.tn@gmail.com</a> | Phone: <a href="tel:+21652769348">+216 52 769 348</a></p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
    `,
  };

  transport
    .sendMail(mailOptions)
    .then(() => console.log("Verification email sent successfully!"))
    .catch((err) => console.log("Error sending email:", err));
};

module.exports.sendEmailToForgetPassword = (email , link )=>{
  transport
  .sendMail({
    from: 000,
    to: email,
    subject: " Forget password Maktba.tn  ",
    html: `
    <div>
    <h1> forget password </h1>
    <a href="${link}"> click to  forget your password </a>
    </div>`,
  })
  .catch((err) => console.log(err));
};
module.exports.sendContactEmail = (email,sujet,message, name)=>{
    transport
    .sendMail({
      sender : email,
      to : "maktba.tn01@gmail.com",
      subject : `message from  ${name} : ${sujet} ${email}`,
      text : message
    }).catch((err)=>console.log(err))
}
module.exports.acceptationDemendePartenariat = (email,password) => {
  transport
    .sendMail({
      from: 000,
      to: email,
      subject: " acceptation demande  de partenariat ",
      html: `
      <div>
      <h1> bienvenue chez maktba.tn </h1>
      <p> votre  username :${email}<br/> password : ${password}</p>

        </div>`,
    })
    .catch((err) => console.log(err));
};
module.exports.DemendePartenariatRejected = (email) => {
  transport
    .sendMail({
      from: 000,
      to: email,
      subject: " une demande de partenariat refuse ",
      html: `
      <div>
      <h1> bienvenue chez maktba.tn </h1>
      <p> votre email deja exist verifie votre demande </p>

        </div>`,
    })
    .catch((err) => console.log(err));
};
module.exports.sendSignaleProduitEmail = (email,message,productname)=>{
  transport
  .sendMail({
    sender : email,
    to : "maktba.tn01@gmail.com",
    subject : `Nouveau signalement de produit  ${productname}  par l'utilisateur: ${email}`,
    text : `Le produit ${productname} a été signalé pour la raison suivante : ${message}`
  }).catch((err)=>console.log(err))
}
module.exports.sendAccepterService = (email,servicename)=>{
  transport
  .sendMail({
    sender : "maktba.tn01@gmail.com",
    to : email,
    subject : `Acceptation de votre Service`,
    html : `Votre Service <strong> ${servicename} </strong> a été acceptée.`
  }).catch((err)=>console.log(err))
}
module.exports.sendAnnulerService = (email,servicename)=>{
  transport
  .sendMail({
    sender : "maktba.tn01@gmail.com",
    to : email,
    subject : `Annulation de votre Service`,
    html : `Votre Service <strong> ${servicename} </strong> a été annulée.`
  }).catch((err)=>console.log(err))
}
module.exports.sendAccepterDon = (email,description)=>{
  transport
  .sendMail({
    sender : "maktba.tn01@gmail.com",
    to : email,
    subject : `Acceptation de votre Don`,
    html : `Votre Don <strong>${description}</strong> a été acceptée.`
  }).catch((err)=>console.log(err))
}
module.exports.sendAnnulerDon = (email,description)=>{
  transport
  .sendMail({
    sender : "maktba.tn01@gmail.com",
    to : email,
    subject : `Annulation de votre Don`,
    html : `<p>Votre Don <strong>${description}</strong> a été annulé.</p>`
  }).catch((err)=>console.log(err))
}

module.exports.sendSuggestionProduitEmail = (email, Description, Titre) => {
  transport
    .sendMail({
      sender: "maktba.tn01@gmail.com",
      to: email,
      subject: `Suggestion acceptée`,
      html: `
        <p>Votre suggestion de produit <strong><em>${Titre}</em></strong> est acceptée.</p>
        <p>Description: ${Description}</p>
        <p>Merci.</p>
      `,
    })
    .catch((err) => console.log(err));
};

module.exports.sendSuggestionProduitFournisseurEmail = (email, Description, Titre) => {
  transport
    .sendMail({
      sender: "maktba.tn01@gmail.com",
      to: email,
      subject: `Suggestion acceptée`,
      html: `
        <p>Votre suggestion de produit <strong><em>${Titre}</em></strong> est acceptée.</p>
        <p>Description: ${Description}</p>
        <p>Merci.</p>
      `,
    })
    .catch((err) => console.log(err));
};

