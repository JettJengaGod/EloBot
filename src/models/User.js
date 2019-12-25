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
        }
    });
    return User
};
module.exports = model;