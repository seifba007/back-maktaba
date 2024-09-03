module.exports = (db, DataTypes) => {
    return  db.define('produitechange',{
      id: { type: DataTypes.INTEGER,autoIncrement: true,primaryKey: true },
      Name : {type : DataTypes.STRING}, 
      Qte : {type : DataTypes.STRING}, 
    });
}