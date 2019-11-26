
const sinon = require("sinon");

const expect = require('chai').expect;
const bot = require('../bot_rewrite');

describe('DB Setup', function (){
    it('calls sync', function () {
        let sequelize = bot.models.sequelize;
        const syncStub = sinon.stub(sequelize, 'sync');
        expect(syncStub.calledOnce).to.be.true
    })
    
});