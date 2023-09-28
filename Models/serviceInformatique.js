module.exports = (db, DataTypes) => {
    return  db.define('serviceInformatique',{
      id: { type: DataTypes.INTEGER,autoIncrement: true,primaryKey: true },
      fullname: {type : DataTypes.STRING},
      telephone: {type : DataTypes.INTEGER},
      email: {type : DataTypes.STRING},
      Type_service : {type : DataTypes.STRING},
      Fichier : {type : DataTypes.STRING},
      Description : {type : DataTypes.STRING},      
    });
}