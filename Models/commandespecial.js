module.exports = (db, DataTypes) => {
    return  db.define('commandespecial',{
      id: { type: DataTypes.INTEGER,autoIncrement: true,primaryKey: true },
      total_ttc : {type : DataTypes.FLOAT },
      etatClient:{type : DataTypes.STRING },
      etatVender:{type : DataTypes.STRING },
      createdAt:{type : DataTypes.DATEONLY},
      data_acceptation:{type:DataTypes.DATEONLY},
      Data_rejetée:{type:DataTypes.DATEONLY},
      Date_préparée:{type:DataTypes.DATEONLY},
      Adresse :{type: DataTypes.INTEGER},
      Mode_liv :{type : DataTypes.STRING},
      Mode_pay :{type : DataTypes.STRING},
      Fichier : {type : DataTypes.STRING},
    });
}