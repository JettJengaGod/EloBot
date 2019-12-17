import {Command, CommandList} from "../src/utils/commands.js";
const sinon = require('sinon');
const chai = require('chai');
const sinonChai = require('sinon-chai');
chai.use(sinonChai);
const { expect } = require('chai');
import 'babel-polyfill'
import truncate from "../scripts/truncate";
import {addUser, updateUser} from "../src/utils/database";
import models from "../src/models";
import Koth from '../src/utils/koth'
const dotenv = require('dotenv');
dotenv.config();

let client = {
    say: function (target, msg) {}
};
let mockC = sinon.mock(client);

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
        const target = "";
        mockC = sinon.mock(client);
        mockC.expects("say").once().withExactArgs(target, default_say );

        com.handle([], target, client);

        mockC.verify()

    });
});

describe('Command List Tests', function () {

    it('Has base com', function () {
        let com = CommandList.base;
        const expected_resp = 'Works';
        const target = "";
        mockC = sinon.mock(client);
        mockC.expects("say").once().withExactArgs(target, expected_resp );

        com.handle([], target, client);

        mockC.verify()
    });

    it('All coms respond', async ()=> {
        for (let com in CommandList) {
            const target = "";
            mockC = sinon.mock(client);
            mockC.expects("say").once();
            await CommandList[com].handle([], target, client, 'usr');

            mockC.verify();
            mockC.restore();
        }
    });

    it('All coms have help', async ()=> {
        for (let com in CommandList) {
            let client = {
                say: function (target, msg) {}
            };
            const target = "";
            mockC = sinon.mock(client);
            mockC.expects("say").once().withExactArgs(target, CommandList[com].help);
            await CommandList['help'].handle([com], target, client, 'usr');

            mockC.verify();
            mockC.restore();
        }
    })

});

describe('rating default commands', async() =>{
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

describe('list command', async() =>{
    const target = '';
    const command = 'list';
    const user = 'Testy';
    const user2 = 'McTestface';
    const user3 = 'Besty';
    const user4 = 'McBestface';
    const args = [];
    beforeEach(async () => {
        mockC = sinon.mock(client);
        Koth.clear()
    });
    it('responds properly when there is no users in the list', async()=>{
        mockC.expects("say").once().withExactArgs(target,
            `No users in the list, use '!challenge' to join the list`);
        await CommandList[command].handle(args, target, client , user);
        mockC.verify();
    });

    it('responds properly when only the king is in the queue', async()=>{
        Koth.add(user);
        mockC.expects("say").once().withExactArgs(target,
            `King: ${user} Challengers: There are no challengers, use '!challenge' to join the list`);
        await CommandList[command].handle(args, target, client , user);
        mockC.verify();
    });

    it('responds properly when king plus 1 are in the queue', async()=>{
        Koth.add(user);
        Koth.add(user2);
        mockC.expects("say").once().withExactArgs(target,
            `King: ${user} Challengers: ${user2}`);
        await CommandList[command].handle(args, target, client , user);
        mockC.verify();
    });

    it('responds properly when king plus 3 are in the queue', async()=>{
        Koth.add(user);
        Koth.add(user2);
        Koth.add(user3);
        Koth.add(user4);
        mockC.expects("say").once().withExactArgs(target,
            `King: ${user} Challengers: ${user2}, ${user3}, ${user4}`);
        await CommandList[command].handle(args, target, client , user);
        mockC.verify();
    });
});

describe('challenge command', async() =>{
    const target = '';
    const command = 'challenge';
    const user = 'Testy';
    const args = [];
    beforeEach(async () => {
        mockC = sinon.mock(client);
        Koth.clear()
    });
   it('adds the user to queue when user is not in queue', async ()=>{
       mockC.expects("say").once().withExactArgs(target,
           `${user} has been added to the queue`);
       await CommandList[command].handle(args, target, client , user);
       mockC.verify();
       expect(Koth.get(user)).to.equal(0)
   });
    it('does not add the user to queue when it is in already', async ()=>{
        Koth.add(user);
        mockC.expects("say").once().withExactArgs(target,
            `${user} is already in the queue`);
        await CommandList[command].handle(args, target, client , user);
        mockC.verify();
        expect(Koth.get()[0]).to.equal(user);
        expect(Koth.get().length).to.equal(1)
    });
    it('does not add the user to queue when the list is closed', async ()=>{
        Koth.close();
        mockC.expects("say").once().withExactArgs(target,
            `The list is currently closed.`);
        await CommandList[command].handle(args, target, client , user);
        mockC.verify();
        expect(Koth.get(user)).to.equal(-1);
        expect(Koth.get().length).to.equal(0);
        Koth.openList();
    })

});

describe('dropspot command', async() =>{
    const target = '';
    const command = 'dropspot';
    const user = 'Testy';
    const user2 = 'McTestyface';
    const args = [];
    beforeEach(async () => {
        mockC = sinon.mock(client);
        Koth.clear()
    });
    it('drops the user from queue when user is in queue', async ()=>{
        Koth.add(user);
        mockC.expects("say").once().withExactArgs(target,
            `${user} has left the queue`);
        await CommandList[command].handle(args, target, client , user);
        mockC.verify();
        expect(Koth.get(user)).to.equal(-1)
    });
    it('does not drop user when it is not in queue', async ()=>{
        Koth.add(user2);
        mockC.expects("say").once().withExactArgs(target,
            `Cannot drop ${user} as they are not in queue`);
        await CommandList[command].handle(args, target, client , user);
        mockC.verify();
        expect(Koth.get().length).to.equal(1)
    })

});

describe('spot command', async() =>{
    const target = '';
    const command = 'spot';
    const user = 'Testy';
    const user2 = 'McTestyface';
    let args = [];
    beforeEach(async () => {
        mockC = sinon.mock(client);
        Koth.clear()
    });
    it('responds properly when the user is king', async ()=>{
        Koth.add(user);
        mockC.expects("say").once().withExactArgs(target,
            `${user} is the king, how do you not know that?`);
        await CommandList[command].handle(args, target, client , user);
        mockC.verify();
        expect(Koth.get(user)).to.equal(0)
    });
    it('responds properly when the user is not in queue', async ()=>{
        Koth.add(user2);
        mockC.expects("say").once().withExactArgs(target,
            `${user} is not in queue`);
        await CommandList[command].handle(args, target, client , user);
        mockC.verify();
    });
    it('responds properly when the user is in normal position in queue', async ()=>{
        Koth.add(user2);
        Koth.add(user);
        mockC.expects("say").once().withExactArgs(target,
            `${user} is 1 in the queue`);
        await CommandList[command].handle(args, target, client , user);
        mockC.verify();
        expect(Koth.get(user)).to.equal(1)
    });

});

describe('spot command with parameter user', async() =>{
    const target = '';
    const command = 'spot';
    const user = 'Testy';
    const user2 = 'McTestyface';
    let args = [user2];
    beforeEach(async () => {
        mockC = sinon.mock(client);
        Koth.clear()
    });
    it('responds properly when the user is king', async ()=>{
        Koth.add(user2);
        mockC.expects("say").once().withExactArgs(target,
            `${user2} is the king, how do you not know that?`);
        await CommandList[command].handle(args, target, client , user);
        mockC.verify();
        expect(Koth.get(user2)).to.equal(0)
    });
    it('responds properly when the user is not in queue', async ()=>{
        Koth.add(user);
        mockC.expects("say").once().withExactArgs(target,
            `${user2} is not in queue`);
        await CommandList[command].handle(args, target, client , user);
        mockC.verify();
    });
    it('responds properly when the user is in normal position in queue', async ()=>{
        Koth.add(user);
        Koth.add(user2);
        mockC.expects("say").once().withExactArgs(target,
            `${user2} is 1 in the queue`);
        await CommandList[command].handle(args, target, client , user);
        mockC.verify();
        expect(Koth.get(user2)).to.equal(1)
    });

});

describe('arenaid command', async() =>{
    const target = '';
    const command = 'arenaid';
    const aid = 'ARENA1234';
    const args = [];
    beforeEach(async () => {
        mockC = sinon.mock(client);
        Koth.clear()
    });
    it('responds with the aid', async ()=>{
        Koth.aid = aid;
        mockC.expects("say").once().withExactArgs(target,
            `The arena id is ${aid}`);
        await CommandList[command].handle(args, target, client , '');
        mockC.verify();
    });
});

describe('arenaid2 command', async() =>{
    const target = '';
    const command = 'arenaid2';
    const aid = 'ARENA1234';
    const args = [];
    beforeEach(async () => {
        mockC = sinon.mock(client);
        Koth.clear()
    });
    it('responds with the aid', async ()=>{
        Koth.aid2 = aid;
        mockC.expects("say").once().withExactArgs(target,
            `The arena 2 id is ${aid}`);
        await CommandList[command].handle(args, target, client , '');
        mockC.verify();
    });
});

describe('arenaid3 command', async() =>{
    const target = '';
    const command = 'arenaid3';
    const aid = 'ARENA1234';
    const args = [];
    beforeEach(async () => {
        mockC = sinon.mock(client);
        Koth.clear()
    });
    it('responds with the aid', async ()=>{
        Koth.aid3 = aid;
        mockC.expects("say").once().withExactArgs(target,
            `The arena 3 id is ${aid}`);
        await CommandList[command].handle(args, target, client , '');
        mockC.verify();
    });
});