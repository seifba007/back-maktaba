module.exports = (db, DataTypes) => {
    return  db.define('bonachat',{
      id: { type: DataTypes.INTEGER,autoIncrement: true,primaryKey: true },
      solde : {type : DataTypes.FLOAT , allowNull: false},
      nbpoint : {type : DataTypes.INTEGER },
      etat:{type : DataTypes.STRING , allowNull: false},
      code :{type : DataTypes.STRING},
      createdAt:{type : DataTypes.DATEONLY}
    });
}