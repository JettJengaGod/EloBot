const model = (sequelize, DataTypes) => {
    const Stream = sequelize.define('Stream', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            stream: {
                type: DataTypes.STRING
            }
        });
    return Stream

};

module.exports = model;