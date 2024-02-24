module.exports = (db, DataTypes) => {
    return  db.define('avisproduitfournisseur',{
      id: { type: DataTypes.INTEGER,autoIncrement: true,primaryKey: true },
      nbStart : {type : DataTypes.INTEGER},
      commenter:{type : DataTypes.STRING},
      createdAt:{type : DataTypes.DATEONLY}
    });
}