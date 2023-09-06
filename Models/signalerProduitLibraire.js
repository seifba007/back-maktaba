module.exports = (db, DataTypes) => {
    return  db.define('signalerproduitlibraire',{
      id: { type: DataTypes.INTEGER,autoIncrement: true,primaryKey: true },
      fullnameUser : {type : DataTypes.STRING},
      email : {type : DataTypes.STRING},
      message : {type : DataTypes.STRING},
      image : {type : DataTypes.STRING},
      createdAt:{type : DataTypes.DATEONLY}
    });
}