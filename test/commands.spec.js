import {Command, CommandList} from "../src/utils/commands.js";
const sinon = require('sinon');
const chai = require('chai');
const sinonChai = require('sinon-chai');

describe('Command class tests', function (){
    it('can be created', function () {
        let test_com = 'test';
        let com = new Command(test_com,'');
        chai.expect(com.com === test_com);
    });

    it('can be created', function () {
        let test_com = 'test';
        const help = 'Help test';
        let com = new Command(test_com,help);
        chai.expect(com.helpPrompt() === help);
    });

    it('has working handler', function () {
        let test_com = 'test';
        const help = 'Help test';
        let com = new Command(test_com,help);
        const default_say = 'This command isn\'t properly setup';
        let client = {
            say: function (target, msg) {}
        };
        const target = "";
        const mock = sinon.mock(client);
        mock.expects("say").once().withExactArgs(target, default_say );

        com.handle([], target, client);

        mock.verify()

    });
});

describe('Command List Tests', function () {

    it('Has base com', function () {
        let com = CommandList.base;
        const expected_resp = 'Works';
        let client = {
            say: function (target, msg) {}
        };
        const target = "";
        const mock = sinon.mock(client);
        mock.expects("say").once().withExactArgs(target, expected_resp );

        com.handle([], target, client);

        mock.verify()
    });

    it('All coms respond', function () {
        for (let com in CommandList) {
            let client = {
                say: function (target, msg) {}
            };
            const target = "";
            const mock = sinon.mock(client);
            mock.expects("say").once();

            CommandList[com].handle([], target, client);

            mock.verify()
        }
    })

});