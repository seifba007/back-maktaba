module.exports = (db, DataTypes) => {
    return  db.define('offre',{
      id: { type: DataTypes.INTEGER,autoIncrement: true,primaryKey: true },
      Description : {type : DataTypes.STRING}, 
    });
}