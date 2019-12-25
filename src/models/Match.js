let name ='Match';
if(process.env.DB_URL){
    name += process.env.NODE_ENV;
}
const model = (sequelize, DataTypes) => {
    const Match = sequelize.define(name, {
        winner: { // Winner of the match's username
            type: DataTypes.STRING
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
        l_r: {  // Loser of the match's rating post match
            type: DataTypes.INTEGER
        },
        l_rc: { // Loser of the match's rating change
            type: DataTypes.INTEGER
        },
    });
    return Match
};
module.exports = model;