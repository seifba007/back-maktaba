module.exports = (db, DataTypes) => {
    return  db.define('history_codepromo',{
      id: { type: DataTypes.INTEGER,autoIncrement: true,primaryKey: true },
      createdAt:{type : DataTypes.DATEONLY},
    });
}