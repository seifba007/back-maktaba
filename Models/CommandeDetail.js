module.exports = (db, DataTypes) => {
    return  db.define('commandeendetail',{
      id: { type: DataTypes.INTEGER,autoIncrement: true,primaryKey: true },
      total_ttc : {type : DataTypes.FLOAT , allowNull: true},
      etatClient:{type : DataTypes.STRING , allowNull: true},
      etatVender:{type : DataTypes.STRING , allowNull: true},
      createdAt:{type : DataTypes.DATEONLY},
      data_acceptation:{type:DataTypes.DATEONLY},
      Data_rejetée:{type:DataTypes.DATEONLY},
      Date_préparée:{type:DataTypes.DATEONLY},
      identifiant:{type : DataTypes.STRING},
      Adresse :{type: DataTypes.INTEGER},
      Mode_liv :{type : DataTypes.STRING},
      Mode_pay :{type : DataTypes.STRING}
    });
}