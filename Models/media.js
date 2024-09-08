module.exports = (db, DataTypes) => {
    return  db.define('media',{
      id: { type: DataTypes.INTEGER,autoIncrement: true,primaryKey: true },
      texte : {type : DataTypes.STRING},
      image : {type : DataTypes.STRING},
      description : {type : DataTypes.STRING}, 
      etat: {type : DataTypes.STRING}, 
      police: {type : DataTypes.STRING}, 
      taille: {type : DataTypes.FLOAT}, 
    });
}
