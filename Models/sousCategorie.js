module.exports = (db, DataTypes) => {
    return  db.define('souscategorie',{
      id: { type: DataTypes.INTEGER,autoIncrement: true,primaryKey: true },
      name:{type : DataTypes.STRING , allowNull: false},
      Description:{type : DataTypes.STRING},
    });
}