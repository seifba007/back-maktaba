module.exports = (db, DataTypes) => {
    return  db.define('categorie',{
      id: { type: DataTypes.INTEGER,autoIncrement: true,primaryKey: true },
      name:{type : DataTypes.STRING , allowNull: false},
      Description:{type : DataTypes.STRING},
      image:{type : DataTypes.STRING},
    });
}