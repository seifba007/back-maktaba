module.exports = (db, DataTypes) => {
    return  db.define('fournisseur',{
      id: { type: DataTypes.INTEGER,autoIncrement: true,primaryKey: true },
      nameetablissement : {type : DataTypes.STRING },
      address : {type : DataTypes.STRING},
      ville :{type : DataTypes.STRING},
      telephone : {type : DataTypes.INTEGER},
      avatar :{type : DataTypes.STRING },
      email :{type :DataTypes.STRING},
      Facebook : {type : DataTypes.STRING },
      Instagram : {type : DataTypes.STRING },
      email :{type :DataTypes.STRING}
    });
  }