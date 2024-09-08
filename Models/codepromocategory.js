module.exports = (db, DataTypes) => {
  return db.define("codepromocategory", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    discountPercentage: { type: DataTypes.FLOAT, allowNull: false },
  });
};
