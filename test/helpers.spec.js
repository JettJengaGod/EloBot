const sinon = require("sinon");

const expect = require('chai').expect;
let help = require('../src/utils/helpers');

describe('At handler', function (){
    it('removes @', function () {
        let testin = '@test';
        const res = 'test';
        let testout = help.atHandle(testin);
        expect(res === testout)
    })
});

describe('Command Tester', function () {
    it('handles all commands', function(){

    });

});