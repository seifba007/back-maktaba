module.exports = (db, DataTypes) => {
    return  db.define('admin',{
      id: { type: DataTypes.INTEGER,autoIncrement: true,primaryKey: true },
    });
}