module.exports = (db, DataTypes) => {
    return  db.define('imageDon',{
      id: { type: DataTypes.INTEGER,autoIncrement: true,primaryKey: true },
      Image : {type : DataTypes.STRING},
    });
}