module.exports = (db, DataTypes) => {
    return  db.define('imagecatalogefournisseur',{
      id: { type: DataTypes.INTEGER,autoIncrement: true,primaryKey: true },
      name_Image : {type : DataTypes.STRING},
    });
}