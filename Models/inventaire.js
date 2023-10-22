module.exports = (db, DataTypes) => {
    return  db.define('inventaire', {
      id: { type: DataTypes.INTEGER,autoIncrement: true,primaryKey: true },
     
    });
}