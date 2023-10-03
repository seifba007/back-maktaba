module.exports = (db, DataTypes) => {
    return  db.define('echange',{
      id: { type: DataTypes.INTEGER,autoIncrement: true,primaryKey: true },
      Etat : {type : DataTypes.STRING}, 
    });
}