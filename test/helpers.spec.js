import {atHandle, handle_bot, handle_command, parseChal, parseKingandChal} from "../src/utils/helpers";

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
//
// describe('Parse chal', function () {
//     it('parses chal out of properly formatted str', function () {
//         const msg = 'The King falls! @skylexifox is the new King! @zynders is the next challenger. Please let @t5ace know that you are ready.';
//         const ret = parseChal(msg);
//         expect(ret === 'zynders')
//     });
//     it('returns default chal out of properly formatted str', function () {
//         const msg = 'The King falls! @skylexifox is the new King!';
//         const ret = parseChal(msg);
//         expect(ret === 'default c')
//     })
// });
//
// describe('Parse king and chal', function () {
//     const name1 = 'Testy';
//     const name2 = 'McTestface';
//     it('parses neither out of empty list', function () {
//         const msg = 'The KotH line is empty.';
//         parseKingandChal(msg);
//         expect(stub).to.have.been.calledWith();
//     });
//     it('parses king with no challengers', function () {
//         const msg = `King: @${name1}. Challengers: There are no challengers at the moment.`;
//         parseKingandChal(msg);
//         expect(stub).to.have.been.calledWith(name1);
//     });
//     it('parses king and chal with 1 chal', function () {
//         const msg = `King: @${name1}. Challengers: ${name2}`;
//         parseKingandChal(msg);
//         expect(stub).to.have.been.calledWith(name1, name2);
//     });
//     it('parses king and chal with 2 chal', function () {
//         const msg = `King: @${name1}. Challengers: ${name2},name`;
//         parseKingandChal(msg);
//         expect(stub).to.have.been.calledWith(name1, name2);
//     });
//     it('parses king and chal with many chal', function () {
//         const msg = `King: @${name1}. Challengers: ${name2},name,f,a,lots,here,sevral`;
//         parseKingandChal(msg);
//         expect(stub).to.have.been.calledWith(name1, name2);
//     });
// });
//
// describe('Bot handle match', function () {
//
//     let u1,u2,u3;
//     let client = {
//         say: function (target, msg) {}
//     };
//     const starting_rating = Number(process.env.DEFAULT_RATING);
//     const mockC = sinon.mock(client);
//     const name1 = 'Testy';
//     const name2 = 'McTestface';
//     const name3 = 'Third';
//     const name4 = 'McThirdface';
//     const king_pre = ': The King';
//     const king_w = king_pre+' wins! @irrelevent is victorious and remains King! ';
//     const king_l = king_pre+' falls! @irrelevent is the new King!';
//     const king_post = ` @${name3} is the next challenger. Please let @t5ace know that you are ready.`
//     beforeEach(async () => {
//         await truncate();
//         await addUser(name1);
//         await addUser(name2);
//         u1 = await models.User.findOne({where: { tName : name1}});
//         u2 = await models.User.findOne({where: { tName : name2}});
//     });
//     it('two existing users king wins no challenger properly updates ratings', async() =>{
//         let msg = king_w;
//         await handle_bot(msg, '', client, name1, name2);
//         let u1r = await rating(name1);
//         let u2r = await rating(name2);
//         expect(stub).to.have.been.calledWith(
//             name1, 'default c'
//         );
//         expect(u1r > u2r)
//     });
//
//     it('two existing users king loses no challenger properly updates ratings', async() =>{
//         let msg = king_l;
//
//         await handle_bot(msg, '', client, name1, name2);
//         let u1r = await rating(name1);
//         let u2r = await rating(name2);
//         expect(stub).to.have.been.calledWith(
//             name2, 'default c'
//         );
//         expect(u2r > u1r)
//     });
//
//     it('two existing users king wins yes challenger properly updates ratings', async() =>{
//         let msg = king_w + king_post;
//         await handle_bot(msg, '', client, name1, name2);
//         let u1r = await rating(name1);
//         let u2r = await rating(name2);
//         expect(stub).to.have.been.calledWith(
//             name1, name3
//         );
//         expect(u1r > u2r)
//     });
//
//     it('two existing users king loses yes challenger properly updates ratings', async() =>{
//         let msg = king_l + king_post ;
//
//         await handle_bot(msg, '', client, name1, name2);
//         let u1r = await rating(name1);
//         let u2r = await rating(name2);
//         expect(stub).to.have.been.calledWith(
//             name2, name3
//         );
//         expect(u2r > u1r)
//     });
//
//     it('one existing user king wins no challenger properly updates ratings', async() =>{
//         let msg = king_w;
//         await handle_bot(msg, '', client, name1, name3);
//         let u1r = await rating(name1);
//         let u3r = await rating(name3);
//         expect(stub).to.have.been.calledWith(
//             name1, 'default c'
//         );
//         expect(u1r > u3r)
//     });
//
//     it('one existing user king loses no challenger properly updates ratings', async() =>{
//         let msg = king_l;
//         await handle_bot(msg, '', client, name1, name3);
//         let u1r = await rating(name1);
//         let u3r = await rating(name3);
//         expect(stub).to.have.been.calledWith(
//             name1, 'default c'
//         );
//         expect(u3r > u1r)
//     });
//
//     it('no existing user king loses no challenger properly updates ratings', async() =>{
//         let msg = king_l;
//         await handle_bot(msg, '', client, name4, name3);
//         let u4r = await rating(name1);
//         let u3r = await rating(name3);
//         expect(stub).to.have.been.calledWith(
//             name1, 'default c'
//         );
//         expect(u3r > u4r)
//     });
// });


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