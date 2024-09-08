module.exports = (db, DataTypes) => {
    return  db.define('produitfavorie',{
      id: { type: DataTypes.INTEGER,autoIncrement: true,primaryKey: true },
    });
}