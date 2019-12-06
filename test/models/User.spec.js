const {
    sequelize,
    dataTypes,
    checkModelName,
    checkPropertyExists
} = require('sequelize-test-helpers');
const UserModel = require('../../src/models/User');
describe('src/models/User', () => {
    const Model = UserModel(sequelize, dataTypes);
    const instance = new Model();
    checkModelName(Model)('User');
    context('properties', () => {
        ['tName', 'rating'].forEach(checkPropertyExists(instance))
    })
});