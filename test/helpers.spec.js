import {atHandle, handle_command} from "../src/utils/helpers";

const sinon = require("sinon");

const expect = require('chai').expect;
let help = require('../src/utils/helpers');
import * as Bot from '../src/bot_rewrite';
const chai = require('chai');
const sinonChai = require('sinon-chai');
chai.use(sinonChai);
import models from '../src/models';
import { addUser, rating, ratingAdd, updateUser} from "../src/utils/database";
import truncate from '../scripts/truncate';

const dotenv = require('dotenv');
dotenv.config();

describe('At handler', function (){
    it('removes @', function () {
        let testin = '@test';
        const res = 'test';
        let testout = help.atHandle(testin);
        expect(res === testout)
    })
});


describe('handles commands', function () {
    let client = {
        say: function (target, msg) {}
    };
    const mockC = sinon.mock(client);
    it('Base commmand works', async() =>{
        const command = 'base';
        const args = [];
        mockC.expects("say").once().withExactArgs('', 'Works' );
        await handle_command(command, args, '', client, false, '');
        mockC.verify();
    })
});


describe('handles rank', function () {
    let client = {
        say: function (target, msg) {}
    };
    let mockC;
    const command = 'rating';
    const usr = 'Testy';
    const usr2 = 'McTestFace';
    let u1,u2;
    const changed_r = Number(process.env.DEFAULT_RATING)+100;
    beforeEach(async () => {
        await truncate();
        await addUser(atHandle(usr));
        await updateUser(atHandle(usr), changed_r);
        u1 = await models.User.findOne({where: { tName : usr}});
        mockC = sinon.mock(client);
    });
    it('!rating ', async() =>{
        const args = [];
        mockC.expects("say").once().withExactArgs('',
            `${atHandle(usr)}'s rating is ${changed_r}`);
        await handle_command(command, args, '', client, false, usr);
        mockC.verify();
    });
    it('!rating @username', async() =>{
        const args = ['@'+usr2];
        mockC.expects("say").once().withExactArgs('',
            `${atHandle(usr2)} does not have a rating, play a match to get a rating`);
        await handle_command(command, args, '', client, false, usr);
        mockC.verify();
    })
});