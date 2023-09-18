module.exports = (db, DataTypes) => {
    return  db.define('commandespecial',{
      id: { type: DataTypes.INTEGER,autoIncrement: true,primaryKey: true },
      etatClient:{type : DataTypes.STRING },
      createdAt:{type : DataTypes.DATEONLY},
      Adresse :{type: DataTypes.INTEGER},
      Description : {type : DataTypes.STRING},
      Fichier : {type : DataTypes.STRING},
      email: {type : DataTypes.STRING},
      telephone: {type : DataTypes.INTEGER},
      Nom:{type : DataTypes.STRING},
    });
}