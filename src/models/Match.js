const model = (sequelize, DataTypes) => {
    const Match = sequelize.define('Match', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        winner: { // Winner of the match's username
            type: DataTypes.STRING
        },
        winnerID: { // Winner of the match's ID
            type: DataTypes.INTEGER
        },
        w_r: { // Winner of the match's rating post match
            type: DataTypes.INTEGER
        },
        w_rc: { // Winner of the match's rating change
            type: DataTypes.INTEGER
        },
        loser: { // Loser of the match's username
            type: DataTypes.STRING
        },
        loserID: { // Loser of the match's ID
            type: DataTypes.INTEGER
        },
        l_r: {  // Loser of the match's rating post match
            type: DataTypes.INTEGER
        },
        l_rc: { // Loser of the match's rating change
            type: DataTypes.INTEGER
        },
        stream: { // Stream the match was on
            type: DataTypes.STRING
        }
    });

    Match.associate = function(models) {
        models.Match.belongsTo(models.User, {
            foreignKey: 'winnerID',
            constraints: false,
            as: 'winnerUser'
        });

        models.Match.belongsTo(models.User, {
            foreignKey: 'loserID',
            constraints: false,
            as: 'loserUser'
        });
    };
    return Match
};
module.exports = model;