module.exports = (db, DataTypes) => {
    return  db.define('enterprise', {
      id: { type: DataTypes.INTEGER,autoIncrement: true,primaryKey: true },
      adresse :{type : DataTypes.STRING },
      telephone : {type : DataTypes.INTEGER},
      nameenterprise:{type: DataTypes.STRING},
      facebook : {type : DataTypes.STRING},
      instagram : {type : DataTypes.STRING},
      imageStore :{type : DataTypes.STRING },
      emailLib :{type :DataTypes.STRING}
    });
}