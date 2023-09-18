const nodemailer = require("nodemailer");
const user = "maktba.tn01@gmail.com"; //
const pass = "duvwkiciangtpdem";  

const transport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: user,
    pass: pass,
  },
});
module.exports.sendEmailVerification = (email, link) => {
  transport
    .sendMail({
      from: 000,
      to: email,
      subject: "Vérification Email Maktaba.tn",
      html: `
      <head>
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <style type="text/css">
        .ExternalClass {width:100%;}
          .ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div {
          line-height: 100%;
          }
          body {-webkit-text-size-adjust:none; -ms-text-size-adjust:none;}
          body {margin:0; padding:0;}
          table td {border-collapse:collapse;}
          @media (max-width: 480px) {
          div, p, a, li, td { -webkit-text-size-adjust:none; }
          *[class~=m_hide] {display:none !important}
          *[class~=m_w53] {width:53px !important}
          *[class~=m_w135] {width:135px !important}
          *[class~=m_w156] {width:156px !important}
          *[class~=m_w248] {width:248px !important;max-width:248px !important}
          *[class~=m_w280] {width:280px !important;max-width:280px !important}
          *[class~=m_w320] {width:320px !important;max-width:320px !important}
          *[class~=m_mw280] {max-width:280px !important}
          *[class~=m_mw320] {max-width:320px !important}
          *[class~=m_min_w53] {min-width:53px !important}
          *[class~=m_min_w280] {min-width:280px !important}
          *[class~=m_hauto] {height:auto !important}
          *[class~=m_h30] {height:30px !important}
          *[class~=m_h40] {height:40px !important}
          *[class~=m_h210] {height:210px !important;}
          *[class~=m_wh34] {width:34px !important; height:34px !important}
          *[class~=m_wh40] {width:40px !important; height:40px !important}
          *[class~=m_wh59] {width:59px !important; height:59px !important}
          *[class~=m_wh64] {width:64px !important; height:64px !important}
          *[class~=m_wh67] {width:67px !important; height:67px !important}
          *[class~=m_wh75] {width:75px !important; height:75px !important}
          *[class~=m_wh84] {width:84px !important; height:84px !important}
          *[class~=m_wh90] {width:90px !important; height:90px !important}
          *[class~=m_wh92] {width:92px !important; height:92px !important}
          *[class~=m_wh93] {width:93px !important; height:93px !important}
          *[class~=m_wh109] {width:109px !important; height:109px !important}
          *[class~=m_w100p] {width:100% !important;}
          *[class~=m_plr0] {padding-left:0 !important;padding-right:0 !important}
          *[class~=m_pt0] {padding-top:0px !important}
          *[class~=m_pt8] {padding-top:8px !important}
          *[class~=m_pt10] {padding-top:10px !important}
          *[class~=m_pt16] {padding-top:16px !important}
          *[class~=m_pt20] {padding-top:20px !important}
          *[class~=m_pt28] {padding-top:28px !important}
          *[class~=m_pt30] {padding-top:30px !important}
          *[class~=m_pt40] {padding-top:40px !important}
          *[class~=m_pb0] {padding-bottom:0px !important}
          *[class~=m_pb2] {padding-bottom:2px !important}
          *[class~=m_pb8] {padding-bottom:8px !important}
          *[class~=m_pb10] {padding-bottom:10px !important}
          *[class~=m_pb12] {padding-bottom:12px !important}
          *[class~=m_pb16] {padding-bottom:16px !important}
          *[class~=m_pb20] {padding-bottom:20px !important}
          *[class~=m_pb25] {padding-bottom:25px !important}
          *[class~=m_pb29] {padding-bottom:29px !important}
          *[class~=m_pb30] {padding-bottom:30px !important}
          *[class~=m_pb32] {padding-bottom:32px !important}
          *[class~=m_pb35] {padding-bottom:35px !important}
          *[class~=m_pb37] {padding-bottom:37px !important}
          *[class~=m_pb39] {padding-bottom:39px !important}
          *[class~=m_pb40] {padding-bottom:40px !important}
          *[class~=m_pr0] {padding-right:0px !important}
          *[class~=m_pr2] {padding-right:2px !important}
          *[class~=m_pr4] {padding-right:4px !important}
          *[class~=m_pr8] {padding-right:8px !important}
          *[class~=m_pr10] {padding-right:10px !important}
          *[class~=m_pr16] {padding-right:16px !important}
          *[class~=m_pr20] {padding-right:20px !important}
          *[class~=m_pr22] {padding-right:22px !important}
          *[class~=m_pl0] {padding-left:0px !important}
          *[class~=m_pl5] {padding-left:5px !important}
          *[class~=m_pl10] {padding-left:10px !important}
          *[class~=m_pl16] {padding-left:16px !important}
          *[class~=m_pl20] {padding-left:20px !important}
          *[class~=m_h3] {font-size:20px !important;line-height:24px !important}
          *[class~=m_fs11] {font-size:11px !important}
          *[class~=m_fs12] {font-size:12px !important}
          *[class~=m_fs14] {font-size:14px !important}
          *[class~=m_fs16] {font-size:16px !important}
          *[class~=m_fs18] {font-size:18px !important}
          *[class~=m_fs20] {font-size:20px !important}
          *[class~=m_fs21] {font-size:21px !important}
          *[class~=m_fs24] {font-size:24px !important}
          *[class~=m_fs30] {font-size:30px !important}
          *[class~=m_fs36] {font-size:36px !important}
          *[class~=m_fs41] {font-size:41px !important}
          *[class~=m_fs48] {font-size:48px !important}
          *[class~=m_lh20] {line-height:20px !important}
          *[class~=m_lh22] {line-height:22px !important}
          *[class~=m_lh40] {line-height:40px !important}
          *[class~=m_lh46] {line-height:46px !important}
          *[class~=m_lh52] {line-height:52px !important}
          *[class~=m_fs40] {font-size:40px !important}
          *[class~=m_overflow135] {max-width:135px !important;overflow:hidden !important;text-overflow:ellipsis}
          *[class~=m_overflow156] {max-width:156px !important;overflow:hidden !important;text-overflow:ellipsis}
          *[class~=m_overflow190] {max-width:190px !important;overflow:hidden !important;text-overflow:ellipsis}
          *[class~=m_overflow200] {max-width:200px !important;overflow:hidden !important;text-overflow:ellipsis}
          *[class~=m_overflow240] {max-width:240px !important;overflow:hidden !important;text-overflow:ellipsis}
          *[class~=m_overflow280] {max-width:280px !important;overflow:hidden !important;text-overflow:ellipsis}
          *[class~=m_hoverflow280] {max-height:280px !important;overflow:hidden !important;text-overflow:ellipsis}
          *[class~=m_b0] {border:none !important}
          *[class~=m_br0] {border-radius:0 0 0 0 !important}
          *[class~=m_br_l5] {border-radius:5px 0 0 5px !important}
          *[class~=m_br_r5] {border-radius:0 5px 5px 0 !important}
          *[class~=m_bg_white] {background-color:#ffffff !important}
          }
      </style>
    </head>
    
    <body>
      <table class="m_bg_white" width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color:#f7f7f7">
        <tr>
          <td class="m_w320 m_pt0" width="580" align="center" style="padding-top:20px">
            <table class="m_w320 m_b0" height="40" width="580" align="center" border="0" cellpadding="0" cellspacing="0" style="background-color:#ffffff">
              <tr>
                <td class="m_w280 m_pl20 m_pr20 m_pt20" width="580" align="left" style="padding:30px 30px 50px 30px">
                  <table width="100%" border="0" cellpadding="0" cellspacing="0">
                    <tr>
                      <td class="m_h40" align="left" valign="bottom" height="50">
                        <a href=
                          title="Maktaba Verification Email">
                          <img src="https://res.cloudinary.com/doytw80zj/image/upload/v1693747797/Fichier_8_15_chy0ep.png" alt="Description de l'image" width="100" height="70" style="filter: grayscale(0%);">                        </a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
      <table class="m_bg_white" width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color:#f7f7f7;">
        <tr>
          <td width="580" align="center" style="">
            <table class="m_w320" width="580" align="center" border="0" cellpadding="0" cellspacing="0" style="background-color:#ffffff">
              <tr>
                <td width="580" align="center" style="padding-bottom:50px">
                  <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color:#ffffff">
                    <tr>
                      <td class="m_w280 m_pl20 m_pr20" width="580" align="center" style="padding:0 30px 0 30px;background-color:#ffffff">
                        <table width="100%" border="0" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                          <tr>
                            <td class="m_pb25" align="left" valign="bottom" style="padding:0 0 35px 0">
                              <table class="m_w280" width="400">
                                <tr>
                                  <td class="m_overflow280 " style="font-size:30px; line-height:36px;padding:0 0 0 0;font-family:helvetica neue,helvetica,arial,sans-serif;font-weight:bold;color:#444444;max-width:510px;overflow:hidden;text-overflow:ellipsis">Before we <span style="color:#e9b949;">get started...</span>
    
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td class="m_w280 m_pl20 m_pr20" width="580" align="center" style="padding:0 30px 0 30px;background-color:#ffffff">
                        <table width="100%" border="0" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                          <tr>
                            <td class="m_h3 " align="left" valign="bottom" style="padding:0 0 40px 0;font-family:helvetica neue,helvetica,arial,sans-serif;font-size:18px;line-height:26px;color:#444444">Please take a second to make sure we’ve got your email right</td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td class="m_w280 m_pl20 m_pr20" width="580" align="center" style="padding:0 30px 0 30px;background-color:#ffffff">
                        <table width="100%" border="0" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                          <tr>
                            <td class="m_plr0" align="center" style="padding:0 35px 0 35px">
                              <a href=${link}
                                style="text-decoration:none;display:block">
                                <table width="100%" border="0" cellpadding="0" cellspacing="0">
                                  <tr>
                                    <td align="center" style="padding:14px 20px 14px 20px;background-color:#e9b949;border-radius:4px">
                                      <a class="m_overflow280" href=${link}
                                        style="font-family:helvetica neue,helvetica,arial,sans-serif;font-weight:bold;font-size:18px;line-height:22px;color:#ffffff;text-decoration:none;display:block;text-align:center;;max-width:400px;overflow:hidden;text-overflow:ellipsis">Confirm your email</a>
                                    </td>
                                  </tr>
                                </table>
                                  <tr>
                            <td class="m_h3 " align="left" valign="bottom" style="padding:40px 0 20px 0;font-family:helvetica neue,helvetica,arial,sans-serif;font-size:18px;line-height:26px;color:#444444">Or copy and paste this link into your browser: [${link}]
    </td>
                          </tr>
                                 <tr>
                            <td class="m_h3 " align="left" valign="bottom" style="padding:40px 0 20px 0;font-family:helvetica neue,helvetica,arial,sans-serif;font-size:18px;line-height:26px;color:#444444"> Maktaba Team
    </td>
                          </tr>
                              </a>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
      <table class="m_bg_white" width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color:#f7f7f7;">
        <tr>
          <td align="center">
            <table class="m_w320" width="580" align="center" border="0" cellpadding="0" cellspacing="0" style="background-color:#f7f7f7">
              <tr> 
                
                <td class="m_w280 m_pl20 m_pr20" align="center" style="padding:30px 30px 30px 30px">
                  <table width="100%" border="0" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                   
                    <tr>
                      <td align="left" valign="bottom" style="font-family:helvetica neue,helvetica,arial,sans-serif;font-size:24px;line-height:28px;font-weight:bold;color:#a7a7a7">[Slogon here]</td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td class="m_w280 m_pl20 m_pr20" align="center" style="padding:0 30px 30px 30px">
                  <table width="100%" border="0" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                    <tr>
                      <td>
                        <table border="0" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                          <tr>
                            <td align="left" style="font-family:helvetica neue,helvetica,arial,sans-serif;font-size:12px;line-height:22px;color:#444444">
                              <a href="#" style="color:#444444;text-decoration:none;pointer-events:none;">Borj Louzir Ariana, Tunis, Tunisia</a>
                            </td>
                            <td align="left" style="padding:0 4px 0 4px;font-family:sans-serif;font-size:18px;color:#444444">&middot;</td>
                            <td align="left" style="font-family:helvetica neue,helvetica,arial,sans-serif;font-size:12px;line-height:22px;color:#444444">
                              <a href="#" style="color:#444444;text-decoration:none;pointer-events:none;">Ariana</a>
                            </td>
                          </tr>
                        </table>
                        <table border="0" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                          <tr>
                            <td align="left" style="font-family:helvetica neue,helvetica,arial,sans-serif;font-size:12px;line-height:22px;color:#444444">
                              <a href="mailto:contact@Maktaba.tn"
                                style="color:#444444;text-decoration:underline;" title="Send us an email">maktaba.tn@gmail.com</a>
                            </td>
                            <td align="left" style="padding:0 4px 0 4px;font-family:sans-serif;font-size:18px;color:#444444">&middot;</td>
                            <td align="left" style="font-family:helvetica neue,helvetica,arial,sans-serif;font-size:12px;line-height:22px;color:#444444">
                              <a href="tel:+21600000000"
                                style="color:#444444;text-decoration:underline">+216 52 769 348</a>
                            </td>
                          </tr>
                        </table>
                        <table border="0" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                          <tr>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
      
      <div style="display:none; white-space:nowrap; font:15px courier; line-height:0;">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</div>
    
    </body>
    
    </html>
    `,
    })
    .catch((err) => console.log(err));
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
      subject: " acceptation demende  de partenariat ",
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
      <p> votre email deja exist verifie votre demende </p>

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