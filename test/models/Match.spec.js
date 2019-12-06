const {
    sequelize,
    dataTypes,
    checkModelName,
    checkPropertyExists
} = require('sequelize-test-helpers');
const MatchModel = require('../../src/models/Match');
describe('src/models/Match', () => {
    const Model = MatchModel(sequelize, dataTypes);
    const instance = new Model();
    checkModelName(Model)('Match');
    context('properties', () => {
        ['winner', 'w_r', 'w_rc', 'loser', 'l_r', 'l_rc'].forEach(checkPropertyExists(instance))
    })
});