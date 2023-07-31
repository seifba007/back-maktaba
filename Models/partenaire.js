module.exports = (db, DataTypes) => {
    return  db.define('partenaire',{
      id: { type: DataTypes.INTEGER,primaryKey: true },
      nameetablissement : {type : DataTypes.STRING },
      address : {type : DataTypes.STRING },
      ville :{type : DataTypes.STRING},
      telephone : {type : DataTypes.INTEGER},
      Facebook : {type : DataTypes.STRING },
      Instagram : {type : DataTypes.STRING },
      image :{type : DataTypes.STRING },
      email :{type :DataTypes.STRING}
    });
}