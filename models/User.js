const model = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        tName: {
            type: DataTypes.STRING
        },
        rating: {
            type: DataTypes.INTEGER
        }
    });
    return User
};
module.exports = model;