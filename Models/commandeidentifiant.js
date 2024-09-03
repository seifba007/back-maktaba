module.exports = (db, DataTypes) => {
    return  db.define('commandeidentifiant',{
      id: { type: DataTypes.INTEGER,autoIncrement: true,primaryKey: true },
      Nom:{type : DataTypes.STRING},
      prenom: {type : DataTypes.STRING},
      identifiant : {type : DataTypes.STRING},
      telephone: {type : DataTypes.INTEGER},
      etatClient:{type : DataTypes.STRING },
      createdAt:{type : DataTypes.DATEONLY},
      Adresse :{type: DataTypes.STRING},
      Description : {type : DataTypes.STRING},
    });
}