module.exports = (db, DataTypes) => {
    return  db.define('imagecataloge',{
      id: { type: DataTypes.INTEGER,autoIncrement: true,primaryKey: true },
      name_Image : {type : DataTypes.STRING},
    });
}