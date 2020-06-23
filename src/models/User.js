const model = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        tName: {
            type: DataTypes.STRING,
            unique: true
        },
        rating: {
            type: DataTypes.INTEGER
        },
        stream: {
            type: DataTypes.STRING
        }
    },
    {
        indexes: [
            {
                unique: true,
                fields: ['tName', 'stream']
            }
        ]
    });
    // User.associate = function(models) {
    //     models.User.hasMany(models.Match);
    // };
    return User

};

module.exports = model;