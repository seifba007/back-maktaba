
const cloudinary = require('cloudinary').v2;

  cloudinary.config({
    cloud_name: "doytw80zj",
    api_key: "848962413565555",
    api_secret: "EtCRjIHeEJ_OeXaeeGNFB_Fj6T4",
  });

module.exports = cloudinary;