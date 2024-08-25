module.exports = (db, DataTypes) => {
    return  db.define('codepromo',{
      id: { type: DataTypes.INTEGER,autoIncrement: true,primaryKey: true },
      code : {type : DataTypes.STRING , allowNull: false},
      etat: {type : DataTypes.STRING , allowNull: false},
      createdAt:{type : DataTypes.DATEONLY}
    });
}