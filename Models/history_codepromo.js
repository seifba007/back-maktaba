      module.exports = (db, DataTypes) => {
        return db.define('history_codepromo', {
          id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
          },
          historypromocodeid: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
              model: 'codePromo', // Assumes the model name for promo codes is 'codePromo'
              key: 'id',
            },
          },
          clienthiscodeprfk: {
            type: DataTypes.INTEGER,
            allowNull: true, 
            references: {
              model: 'users',
              key: 'id',
            },
          },
          usedat: {
            type: DataTypes.DATE,
            allowNull: false,
          },
          parthiscodeprfk: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
              model: 'partenaires', // Assumes the model name for partners is 'partenaires'
              key: 'id',
            },
          },
          totalachat: {
            type: DataTypes.FLOAT,
            allowNull: false,
          },
        }, {
          tableName: 'history_codepromos', // Specify the actual table name
          timestamps: false, // Set to true if you want Sequelize to manage createdAt and updatedAt fields
        });
      };
      