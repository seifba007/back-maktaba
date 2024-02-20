module.exports = (db, DataTypes) => {
    return  db.define('catalogefournisseur',{
      id: { type: DataTypes.INTEGER,autoIncrement: true,primaryKey: true },
      titre : {type : DataTypes.STRING , allowNull: false},
      description:{type : DataTypes.STRING , allowNull: false},
      prix :{type : DataTypes.FLOAT},
      etat:{type : DataTypes.STRING ,allowNull: false},
      codebar:{type : DataTypes.STRING ,allowNull: false},
      createdAt:{type : DataTypes.DATEONLY},
    });
}