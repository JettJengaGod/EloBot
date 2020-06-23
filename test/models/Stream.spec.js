const {
    sequelize,
    dataTypes,
    checkModelName,
    checkPropertyExists
} = require('sequelize-test-helpers');
const StreamModel = require('../../src/models/Stream');
describe('src/models/stream', () => {
    const Model = StreamModel(sequelize, dataTypes);
    const instance = new Model();
    checkModelName(Model)('Stream');
    context('properties', () => {
        ['stream'].forEach(checkPropertyExists(instance))
    })
});