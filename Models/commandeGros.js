module.exports = (db, DataTypes) => {
    return  db.define('commandeengro',{
      id: { type: DataTypes.INTEGER,autoIncrement: true,primaryKey: true },
      total_ttc : {type : DataTypes.FLOAT , allowNull: false},
      etatlabrairie:{type : DataTypes.STRING , allowNull: false},
      etatfournisseur:{type : DataTypes.STRING , allowNull: false},
      createdAt:{type : DataTypes.DATEONLY},
      Adresse :{type: DataTypes.INTEGER},
      Mode_liv :{type : DataTypes.STRING},
      Mode_pay :{type : DataTypes.STRING},
      date_acceptation:{type:DataTypes.DATEONLY},
      Date_rejetée:{type:DataTypes.DATEONLY},
      Date_préparée:{type:DataTypes.DATEONLY},
    });
}