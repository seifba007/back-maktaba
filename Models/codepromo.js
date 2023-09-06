module.exports = (db, DataTypes) => {
    return  db.define('codepromo',{
      id: { type: DataTypes.INTEGER,autoIncrement: true,primaryKey: true },
      code : {type : DataTypes.STRING , allowNull: false},
      userName: {type : DataTypes.STRING , allowNull: false},
      pourcentage : {type : DataTypes.INTEGER , allowNull: false},
      createdAt:{type : DataTypes.DATEONLY}
    });
}