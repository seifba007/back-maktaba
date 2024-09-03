module.exports = (db, DataTypes) => {
    return  db.define('don',{
      id: { type: DataTypes.INTEGER,autoIncrement: true,primaryKey: true },
      fullname: {type : DataTypes.STRING},
      telephone: {type : DataTypes.INTEGER},
      email: {type : DataTypes.STRING},
      category : {type : DataTypes.STRING},
      nbrelement:{type : DataTypes.INTEGER},
      disponibilite: {type : DataTypes.STRING},
      Etatelement:  {type : DataTypes.STRING},
      Description : {type : DataTypes.STRING},   
      Etatdon : {type : DataTypes.STRING}, 
    });
}