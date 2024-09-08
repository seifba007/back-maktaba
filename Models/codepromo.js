module.exports = (db, DataTypes) => {
  return db.define('codepromo', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    code: { type: DataTypes.STRING, allowNull: false },
    etat: { type: DataTypes.STRING, allowNull: false, defaultValue: 'Actif' },
    usedBy: { type: DataTypes.INTEGER, allowNull: true }, 
    createdAt: { type: DataTypes.DATEONLY },
    updatedAt: { type: DataTypes.DATEONLY }  
  });
};

