module.exports = (db, DataTypes) => {
    return  db.define('produit_c_gro',{
      id: { type: DataTypes.INTEGER,autoIncrement: true,primaryKey: true },
      Qte : {type : DataTypes.INTEGER , allowNull: false},
    });
}