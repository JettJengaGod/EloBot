import {Command, CommandList} from "../src/utils/commands.js";
const sinon = require('sinon');
const chai = require('chai');
const sinonChai = require('sinon-chai');

chai.use(sinonChai);
import 'babel-polyfill'
import truncate from "../scripts/truncate";
import {addUser, updateUser} from "../src/utils/database";
import models from "../src/models";
const dotenv = require('dotenv');
dotenv.config();

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

    it('All coms respond', async ()=> {
        for (let com in CommandList) {
            let client = {
                say: function (target, msg) {}
            };
            const target = "";
            let mock = sinon.mock(client);
            mock.expects("say").once();
            await CommandList[com].handle([], target, client, 'usr');

            mock.verify();
            mock.restore();
            mock = sinon.mock(client);
        }
    });

    it('All coms have help', async ()=> {
        for (let com in CommandList) {
            let client = {
                say: function (target, msg) {}
            };
            const target = "";
            let mock = sinon.mock(client);
            mock.expects("say").once().withExactArgs(target, CommandList[com].help);
            await CommandList['help'].handle([com], target, client, 'usr');

            mock.verify();
            mock.restore();
            mock = sinon.mock(client);
        }
    })

});

describe('rating default commands', async() =>{
    let client = {
        say: function (target, msg) {}
    };
    let mockC = sinon.mock(client);
    const command = 'rating';
    const name = 'not_here';
    const name2 = 'alsonot';

    beforeEach(async () => {
        await truncate();
        mockC.restore();
        mockC = sinon.mock(client);
    });
    it('Responds with default message when user is not found', async() =>{
        const args = [];
        mockC.expects("say").once().withExactArgs('',
            `${name} does not have a rating, play a match to get a rating` );
        await CommandList[command].handle(args, '', client , name);
        mockC.verify();
    });
    it('Responds with default message when args user is not found', async() =>{
        const args = [name2];
        mockC.expects("say").once().withExactArgs('',
            `${name2} does not have a rating, play a match to get a rating` );
        await CommandList[command].handle(args, '', client , name);
        mockC.verify();
    });
    it('Responds with error message when there are too many args', async() =>{
        const args = [name, name2, name];
        mockC.expects("say").once().withExactArgs('',
            `rating expects either '!rating' to find your rating or '!rating @username' to find another's rating` );
        await CommandList[command].handle(args, '', client , name);
        mockC.verify();
    });

});

describe('rating actual responses', async() =>{
    let client = {
        say: function (target, msg) {}
    };
    let mockC;
    const command = 'rating';
    const usr = 'Testy';
    const usr2 = 'McTestface';
    const changed_r = Number(process.env.DEFAULT_RATING)+100;
    beforeEach(async () => {
        await truncate();
        await addUser(usr);
        await addUser(usr2);
        await updateUser(usr, changed_r);
        mockC = sinon.mock(client);
    });
    it('Responds with users rating with no params', async() =>{
        const args = [];

        mockC.expects("say").once().withExactArgs('',
            `${usr}'s rating is ${changed_r}` );
        await CommandList[command].handle(args, '', client , usr);
        mockC.verify();
    });
    it('Responds with param rating with 1 param', async() =>{
        const args = [usr2];

        mockC.expects("say").once().withExactArgs('',
            `${usr2}'s rating is ${process.env.DEFAULT_RATING}` );
        await CommandList[command].handle(args, '', client , usr);
        mockC.verify();
    });

});

describe('rank default commands', async() =>{
    let client = {
        say: function (target, msg) {}
    };
    let mockC = sinon.mock(client);
    const command = 'rank';
    const name = 'not_here';
    const name2 = 'alsonot';

    beforeEach(async () => {
        await truncate();
        mockC.restore();
        mockC = sinon.mock(client);
    });
    it('Responds with default message when user is not found', async() =>{
        const args = [];
        mockC.expects("say").once().withExactArgs('',
            `${name} does not have a rank, play a match to get a rank` );
        await CommandList[command].handle(args, '', client , name);
        mockC.verify();
    });
    it('Responds with default message when args user is not found', async() =>{
        const args = [name2];
        mockC.expects("say").once().withExactArgs('',
            `${name2} does not have a rank, play a match to get a rank` );
        await CommandList[command].handle(args, '', client , name);
        mockC.verify();
    });
    it('Responds with error message when there are too many args', async() =>{
        const args = [name, name2, name];
        mockC.expects("say").once().withExactArgs('',
            `rank expects either '!rank' to find your rank or '!rank @username' to find another's rank` );
        await CommandList[command].handle(args, '', client , name);
        mockC.verify();
    });

});

describe('rank actual responses', async() =>{
    let client = {
        say: function (target, msg) {}
    };
    let mockC;
    const command = 'rank';
    const usr = 'Testy';
    const usr2 = 'McTestface';
    const changed_r = Number(process.env.DEFAULT_RATING)+100;
    beforeEach(async () => {
        await truncate();
        await addUser(usr);
        await addUser(usr2);
        await updateUser(usr, changed_r);
        mockC = sinon.mock(client);
    });
    it('Responds with users rating with no params', async() =>{
        const args = [];

        mockC.expects("say").once().withExactArgs('',
            `${usr}'s rank is 1(${changed_r})` );
        await CommandList[command].handle(args, '', client , usr);
        mockC.verify();
    });
    it('Responds with param rating with 1 param', async() =>{
        const args = [usr2];

        mockC.expects("say").once().withExactArgs('',
            `${usr2}'s rank is 2(${process.env.DEFAULT_RATING})` );
        await CommandList[command].handle(args, '', client , usr);
        mockC.verify();
    });

});

