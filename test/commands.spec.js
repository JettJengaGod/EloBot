import {Command, CommandList} from "../src/utils/commands.js";
import sinon from "sinon";
import chai from 'chai';
import sinonChai from 'sinon-chai';
chai.use(sinonChai);
import { expect } from'chai';
import truncate from "../scripts/truncate";
import {addUser, updateUser} from "../src/utils/database";
import Koth from '../src/utils/koth'
import dotenv from 'dotenv';
import {ModCommandList} from "../src/utils/modCommands";
dotenv.config();
const starting_rating = Number(process.env.DEFAULT_RATING);
const target = "Test";
describe('Command class tests', function (){
    it('can be created', function () {
        let test_com = 'test';
        let com = new Command(test_com,'');
        expect(com.com).to.equal(test_com);
    });

    it('can be created', function () {
        let test_com = 'test';
        const help = 'Help test';
        let com = new Command(test_com,help);
        expect(com.helpPrompt()).to.equal(help);
    });

    it('has working handler', async ()=> {
        let test_com = 'test';
        const help = 'Help test';
        let com = new Command(test_com,help);
        const default_say = 'This command isn\'t properly setup';
        const resp = await com.handle([], target, "");
        expect(default_say).to.equal(resp);

    });
});

describe('Command List and help Tests', function () {

    it('Has base com',  async ()=> {
        let com = CommandList.base;
        const expected_resp = 'Works';
        let resp = await com.handle([], target);
        expect(expected_resp).to.equal(resp);
    });

    // it('All coms respond', async ()=> {
    //     for (let com in CommandList) {
    //         const resp = await CommandList[com].handle([], target, 'usr');
    //         expect(resp);
    //     }
    // });

    it('All coms have help', async ()=> {
        for (let com in CommandList) {
            let resp = await CommandList['help'].handle([com], target, 'usr');

            expect( CommandList[com].help).to.equal(resp);
        }
    });

    it('All mod coms have help', async ()=> {
        for (let com in ModCommandList) {
            if (com in CommandList)
                continue;
            let resp = await CommandList['help'].handle([com], target, 'usr');

            expect( ModCommandList[com].help).to.equal(resp);
        }
    });

    it('Help responds on invalid command', async ()=> {
        const gibberish = "gibberish"
        const expected = `Command: ${gibberish} not recognized.`;
        const resp = await CommandList['help'].handle([gibberish], target, 'usr');
        expect(resp).to.equal(expected);
    });

    it('Help responds on extra arguments', async ()=> {
        const gibberish = "gibberish"
        const expected = `use '!help' or '!help commandname' to get help.`;
        const resp = await CommandList['help'].handle([gibberish, gibberish, gibberish], target, 'usr');
        expect(resp).to.equal(expected);
    });

    it('Help responds on no arguments', async ()=> {
        const expected = `use '!help command' to get help on a specific command or visit https://pastebin.com/MN7KQ3mH to find out more.`;
        const resp = await CommandList['help'].handle([],target, 'usr');
        expect(resp).to.equal(expected);
    });

});

describe('rating default commands', async() =>{
    const command = 'rating';
    const name = 'not_here';
    const name2 = 'alsonot';

    beforeEach(async () => {
        await truncate();
    });
    it('Responds with default message when user is not found', async() =>{
        const args = [];
        const expected = 
            `${name} does not have a rating, play a match to get a rating` ;
        const resp = await CommandList[command].handle(args, target, name);
        expect(resp).to.equal(expected);
    });
    it('Responds with default message when args user is not found', async() =>{
        const args = [name2];
        const expected = 
            `${name2} does not have a rating, play a match to get a rating`;
        const resp = await CommandList[command].handle(args, target, name);
        expect(resp).to.equal(expected);
    });
    it('Responds with error message when there are too many args', async() =>{
        const args = [name, name2, name];
        const expected = 
            `rating expects either '!rating' to find your rating or '!rating @username' to find another's rating` ;
        const resp = await CommandList[command].handle(args, target, name);
        expect(resp).to.equal(expected);
    });

});

describe('rating actual responses', async() =>{
    const command = 'rating';
    const usr = 'testy';
    const usr2 = 'mctestface';
    const changed_r = Number(process.env.DEFAULT_RATING)+100;
    beforeEach(async () => {
        await truncate();
        await addUser(usr, target);
        await addUser(usr2, target);
        await updateUser(usr, changed_r, target);
    });
    it('Responds with users rating with no params', async() =>{
        const args = [];

        const expected = 
            `${usr}'s rating is ${changed_r}`;
        const resp = await CommandList[command].handle(args, target, usr);
        expect(resp).to.equal(expected);
    });
    it('Responds with param rating with 1 param', async() =>{
        const args = [usr2];

        const expected = 
            `${usr2}'s rating is ${process.env.DEFAULT_RATING}`;
        const resp = await CommandList[command].handle(args, target, usr);
        expect(resp).to.equal(expected);
    });

});

describe('rank default commands', async() =>{
    const command = 'rank';
    const name = 'not_here';
    const name2 = 'alsonot';

    beforeEach(async () => {
        await truncate();
    });
    it('Responds with default message when user is not found', async() =>{
        const args = [];
        const expected = 
            `${name} does not have a rank, play a match to get a rank`;
        const resp = await CommandList[command].handle(args, target, name);
        expect(resp).to.equal(expected);
    });
    it('Responds with default message when args user is not found', async() =>{
        const args = [name2];
        const expected = 
            `${name2} does not have a rank, play a match to get a rank`;
        const resp = await CommandList[command].handle(args, target, name);
        expect(resp).to.equal(expected);
    });
    it('Responds with error message when there are too many args', async() =>{
        const args = [name, name2, name];
        const expected = 
            `rank expects either '!rank' to find your rank or '!rank @username' to find another's rank`;
        const resp = await CommandList[command].handle(args, target, name);
        expect(resp).to.equal(expected);
    });

});

describe('rank actual responses', async() =>{
    const command = 'rank';
    const usr = 'testy';
    const usr2 = 'mctestface';
    const changed_r = Number(process.env.DEFAULT_RATING)+100;
    beforeEach(async () => {
        await truncate();
        await addUser(usr, target);
        await addUser(usr2, target);
        await updateUser(usr, changed_r, target);
    });
    it('Responds with users rating with no params', async() =>{
        const args = [];

        const expected = 
            `${usr}'s rank is 1/2 (${changed_r})`;
        const resp = await CommandList[command].handle(args, target, usr);
        expect(resp).to.equal(expected);
    });
    it('Responds with param rating with 1 param', async() =>{
        const args = [usr2];

        const expected = 
            `${usr2}'s rank is 2/2 (${process.env.DEFAULT_RATING})`;
        const resp = await CommandList[command].handle(args, target, usr);
        expect(resp).to.equal(expected);
    });

});

describe('top actual responses', async() =>{
    const command = 'top';
    const usr = 'testy';
    const usr2 = 'mctestface';
    const usr3 = 'shawn';
    const usr4 = 'douglas';
    const usr5 = 'nardesh';
    const changed_r = Number(process.env.DEFAULT_RATING)+100;
    beforeEach(async () => {
        await truncate();
    });
    it('Responds with no users in db', async() =>{

        const expected = `The Top 5 is`;
        const resp = await CommandList[command].handle([], target, usr);
        expect(resp).to.equal(expected);
    });
    it('Responds with 1 user in db', async() =>{
        await addUser(usr, target);

        const expected = `The Top 5 is: 1. ${usr}(${starting_rating})`;
        const resp = await CommandList[command].handle([], target, usr);
        expect(resp).to.equal(expected);
    });

    it('Responds with 5 users in db', async() =>{
        await addUser(usr, target);
        await updateUser(usr, starting_rating+5, target);
        await addUser(usr2, target);
        await updateUser(usr2, starting_rating+4, target);
        await addUser(usr3, target);
        await updateUser(usr3, starting_rating+3, target);
        await addUser(usr4, target);
        await updateUser(usr4, starting_rating+2, target);
        await addUser(usr5, target);

        const expected = `The Top 5 is: 1. ${usr}(${starting_rating+5}), 2. ${usr2}(${starting_rating+4}), 3. ${usr3}(${starting_rating+3}), 4. ${usr4}(${starting_rating+2}), 5. ${usr5}(${starting_rating})`;
        const resp = await CommandList[command].handle([], target, usr);
        expect(resp).to.equal(expected);
    });

    it('Responds with more than 5 users in db', async() =>{
        await addUser(usr, target);
        await updateUser(usr, starting_rating+5, target);
        await addUser(usr2, target);
        await updateUser(usr2, starting_rating+4, target);
        await addUser(usr3, target);
        await updateUser(usr3, starting_rating+3, target);
        await addUser(usr4, target);
        await updateUser(usr4, starting_rating+2, target);
        await addUser(usr5, target);
        await updateUser(usr5, starting_rating+1, target);
        await addUser('bilbo', target);

        const expected = `The Top 5 is: 1. ${usr}(${starting_rating+5}), 2. ${usr2}(${starting_rating+4}), 3. ${usr3}(${starting_rating+3}), 4. ${usr4}(${starting_rating+2}), 5. ${usr5}(${starting_rating+1})`;
        const resp = await CommandList[command].handle([], target, usr);
        expect(resp).to.equal(expected);
    });

});

describe('list command', async() =>{
    const command = 'list';
    const user = 'testy';
    const user2 = 'mctestface';
    const user3 = 'besty';
    const user4 = 'mcbestface';
    const args = [];
    beforeEach(async () => {
        Koth.hill(target).clear()
    });
    it('responds properly when there are no users in the list', async()=>{
        const expected =
            `No users in the list, use '!challenge' to join the list.`;
        const resp = await CommandList[command].handle(args, target, user);
        expect(resp).to.equal(expected);
    });

    it('responds properly when only the king is in the queue', async()=>{
        Koth.hill(target).add(user);
        const expected =
            `King: ${user} ~~~~ Challengers: There are no challengers, use '!challenge' to join the list. You are at position 0.`;
        const resp = await CommandList[command].handle(args, target, user);
        expect(resp).to.equal(expected);
    });

    it('responds properly when king plus 1 are in the queue', async()=>{
        Koth.hill(target).add(user);
        Koth.hill(target).add(user2);
        const expected =
            `King: ${user} ~~~~ Challengers: ${user2} You are at position 0.`;
        const resp = await CommandList[command].handle(args, target, user);
        expect(resp).to.equal(expected);
    });

    it('responds properly when king plus 3 are in the queue', async()=>{
        Koth.hill(target).add(user);
        Koth.hill(target).add(user2);
        Koth.hill(target).add(user3);
        Koth.hill(target).add(user4);
        const expected =
            `King: ${user} ~~~~ Challengers: ${user2}, ${user3}, ${user4} You are at position 2.`;
        const resp = await CommandList[command].handle(args, target, user3);
        expect(resp).to.equal(expected);
    });
});

describe('challenge command', async() =>{
    const command = 'challenge';
    const user = 'testy';
    const args = [];
    beforeEach(async () => {
        Koth.hill(target).clear()
    });
   it('adds the user to queue when user is not in queue', async ()=>{
       const expected =
           `${user} has been added to the queue at position 0.`;
       const resp = await CommandList[command].handle(args, target, user);
       expect(resp).to.equal(expected);
       expect(Koth.hill(target).get(user)).to.equal(0)
   });
    it('does not add the user to queue when it is in already', async ()=>{
        Koth.hill(target).add(user);
        const expected =
            `${user} is already in the queue at position 0.`;
        const resp = await CommandList[command].handle(args, target, user);
        expect(resp).to.equal(expected);
        expect(Koth.hill(target).get()[0]).to.equal(user);
        expect(Koth.hill(target).get().length).to.equal(1)
    });
    it('does not add the user to queue when the list is closed', async ()=>{
        Koth.hill(target).close();
        const expected =
            `The list is currently closed.`;
        const resp = await CommandList[command].handle(args, target, user);
        expect(resp).to.equal(expected);
        expect(Koth.hill(target).get(user)).to.equal(-1);
        expect(Koth.hill(target).get().length).to.equal(0);
        Koth.hill(target).openList();
    })

});

describe('dropspot command', async() =>{
    const command = 'dropspot';
    const user = 'testy';
    const user2 = 'mctestyface';
    const args = [];
    beforeEach(async () => {
        Koth.hill(target).clear()
    });
    it('drops the user from queue when user is in queue', async ()=>{
        Koth.hill(target).add(user);
        const expected =
            `${user} has left the queue.`;
        const resp = await CommandList[command].handle(args, target, user);
        expect(resp).to.equal(expected);
        expect(Koth.hill(target).get(user)).to.equal(-1)
    });
    it('does not drop user when it is not in queue', async ()=>{
        Koth.hill(target).add(user2);
        const expected =
            `Cannot drop ${user} as they are not in queue.`;
        const resp = await CommandList[command].handle(args, target, user);
        expect(resp).to.equal(expected);
        expect(Koth.hill(target).get().length).to.equal(1)
    })

});

describe('spot command', async() =>{
    const command = 'spot';
    const user = 'testy';
    const user2 = 'mctestyface';
    let args = [];
    beforeEach(async () => {
        Koth.hill(target).clear()
    });
    it('responds properly when the user is king', async ()=>{
        Koth.hill(target).add(user);
        const expected =
            `${user} is the king, how do you not know that?`;
        const resp = await CommandList[command].handle(args, target, user);
        expect(resp).to.equal(expected);
        expect(Koth.hill(target).get(user)).to.equal(0)
    });
    it('responds properly when the user is not in queue', async ()=>{
        Koth.hill(target).add(user2);
        const expected =
            `${user} is not in queue`;
        const resp = await CommandList[command].handle(args, target, user);
        expect(resp).to.equal(expected);
    });
    it('responds properly when the user is in normal position in queue', async ()=>{
        Koth.hill(target).add(user2);
        Koth.hill(target).add(user);
        const expected =
            `${user} is 1 in the queue`;
        const resp = await CommandList[command].handle(args, target, user);
        expect(resp).to.equal(expected);
        expect(Koth.hill(target).get(user)).to.equal(1)
    });

});

describe('spot command with parameter user', async() =>{
    const command = 'spot';
    const user = 'testy';
    const user2 = 'mctestyface';
    let args = [user2];
    beforeEach(async () => {
        Koth.hill(target).clear()
    });
    it('responds properly when the user is king', async ()=>{
        Koth.hill(target).add(user2);
        const expected =
            `${user2} is the king, how do you not know that?`;
        const resp = await CommandList[command].handle(args, target, user);
        expect(resp).to.equal(expected);
        expect(Koth.hill(target).get(user2)).to.equal(0)
    });
    it('responds properly when the user is not in queue', async ()=>{
        Koth.hill(target).add(user);
        const expected =
            `${user2} is not in queue`;
        const resp = await CommandList[command].handle(args, target, user);
        expect(resp).to.equal(expected);
    });
    it('responds properly when the user is in normal position in queue', async ()=>{
        Koth.hill(target).add(user);
        Koth.hill(target).add(user2);
        const expected =
            `${user2} is 1 in the queue`;
        const resp = await CommandList[command].handle(args, target, user);
        expect(resp).to.equal(expected);
        expect(Koth.hill(target).get(user2)).to.equal(1)
    });

});

describe('arenaid command', async() =>{
    const command = 'arenaid';
    const aid = 'ARENA1234';
    const args = [];
    beforeEach(async () => {
        Koth.hill(target).clear()
    });
    it('responds with the aid', async ()=>{
        Koth.hill(target).aid = aid;
        const expected =
            `The Arena ID is ${aid}.`;
        const resp = await CommandList[command].handle(args, target, '');
        expect(resp).to.equal(expected);
    });
});

describe('arenaid2 command', async() =>{
    const command = 'arenaid2';
    const aid = 'ARENA1234';
    const args = [];
    beforeEach(async () => {
        Koth.hill(target).clear()
    });
    it('responds with the aid', async ()=>{
        Koth.hill(target).aid2 = aid;
        const expected =
            `The Arena 2 ID is ${aid}.`;
        const resp = await CommandList[command].handle(args, target, '');
        expect(resp).to.equal(expected);
    });
});

describe('arenaid3 command', async() =>{
    const command = 'arenaid3';
    const aid = 'ARENA1234';
    const args = [];
    beforeEach(async () => {
        Koth.hill(target).clear()
    });
    it('responds with the aid', async ()=>{
        Koth.hill(target).aid3 = aid;
        const expected =
            `The Arena 3 ID is ${aid}.`;
        const resp = await CommandList[command].handle(args, target, '');
        expect(resp).to.equal(expected);
    });
});

describe('website command', async() =>{
    const command = 'website';
    const args = [];
    it('responds with the site', async ()=>{
        const expected =
            `The website is https://jettelobot.herokuapp.com/`;
        const resp = await CommandList[command].handle(args, target, '');
        expect(resp).to.equal(expected);
    });
});

describe('king command', async() =>{
    const command = 'king';
    const args = [];
    beforeEach(async () => {
        Koth.hill(target).clear();
        Koth.hill(target).add_char("blah")
    });
    it('responds with one char', async ()=>{
        const expected =
            `The king has used : blah`;
        const resp = await CommandList[command].handle(args, target, '');
        expect(resp).to.equal(expected);
    });
    it('responds with multiple chars', async ()=>{
        Koth.hill(target).add_char("nothing")
        const expected =
            `The king has used : blah, nothing`;
        const resp = await CommandList[command].handle(args, target, '');
        expect(resp).to.equal(expected);
    });
});