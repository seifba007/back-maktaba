module.exports = (db, DataTypes) => {
  return db.define('imagedons', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    Image: {
      type: DataTypes.STRING,
    },
  }, {
    tableName: 'imagedons',  // Explicitly set the table name to match the database table
    freezeTableName: true,  // Prevent Sequelize from pluralizing the table name
  });
};
