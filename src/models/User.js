let name ='User';
if(process.env.DB_URL){
    name += process.env.NODE_ENV;
}
const model = (sequelize, DataTypes) => {
    const User = sequelize.define(name, {
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