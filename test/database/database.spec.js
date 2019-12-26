import { assert } from 'chai';
import models, {User, Match} from '../../src/models';
import {addUser, rating, ratingAdd, updateUser, rank, addMatch, topRank, undoLastMatch} from "../../src/utils/database";
import truncate from '../../scripts/truncate';

const dotenv = require('dotenv');
dotenv.config();
const starting_rating = Number(process.env.DEFAULT_RATING);
User.sync();
Match.sync();
describe('User DB Functions', () => {
    let addeduser;
    const username = 'Testy';
        beforeEach(async () => {
        await truncate();
        await addUser(username);
        addeduser = await models.User.findOne({where: { tName : username}});
    });

    it('should add a user', async () => {

        const count = await models.User.count();
        assert.equal(count, 1);
        assert.equal(addeduser.rating, starting_rating);
    });

    it('should return the proper rating', async () => {
        let r = await rating(username);
        assert.equal(r, starting_rating);
    });

    it('should return null when no user is found', async () => {
        let r = await rating('bad user');
        assert.equal(r, null);
    });

    it('should return rating if user is found', async () => {
        let r = await ratingAdd(username);
        const count = await models.User.count();
        assert.equal(count, 1);
        assert.equal(r, starting_rating)

    });

    it('should add user if no user is found', async () => {
        let r = await ratingAdd('new_user');
        const count = await models.User.count();
        assert.equal(count, 2);
        assert.equal(r, starting_rating)
    });

    it('should update users rating if user is found', async () => {
        await updateUser(username, starting_rating+10);
        let r = await rating(username);
        console.log(starting_rating);
        assert.equal(r, starting_rating+10);
    });

});


describe('Rank Db functions', () => {
    const user1 = 'Testy';
    const user2 = 'McTestFace';
    const user3 = 'Besty';
    const user4 = 'McBestFace';
    const nothere = 'nothere';
    let u1,u2,u3,u4;
    beforeEach(async () => {
        await truncate();
        await addUser(user1);
        await addUser(user2);
        await addUser(user3);
        await addUser(user4);
        await updateUser(user1, starting_rating+400);
        await updateUser(user2, starting_rating+300);
        await updateUser(user3, starting_rating+200);
        await updateUser(user4, starting_rating-100);
        u1 = await User.findOne({ where: { tName: user1 } });
        u2 = await User.findOne({ where: { tName: user2 } });
        u3 = await User.findOne({ where: { tName: user3 } });
        u4 = await User.findOne({ where: { tName: user4 } });
    });

    it('returns null when a user is not found', async() =>{
        let res = await rank(nothere);
        assert.equal(res[0], null);
        assert.equal(res[1], 4)
    });

    it('returns 1 when the top user is sent in', async() =>{
        let res = await rank(user1);
        assert.deepEqual(res, [1, 4])
    });

    it('returns 2 when the top user is sent in', async() =>{
        let res = await rank(user4);
        assert.deepEqual(res, [4, 4])
    });

    it('returns the list when asked for more than total', async() =>{
        let res = await topRank(5);
        assert.deepEqual(res, [u1, u2, u3, u4])
    });
    it('returns the list when asked for more than total', async() =>{
        let res = await topRank(2);

        assert.deepEqual(res, [u1, u2])
    })
});

describe('Undo tests', () => {
    const winner = 'testy';
    const loser = 'mctestface';
    const win_c = 14;
    const lose_c = 14;
    beforeEach(async () => {
        await truncate();
        await addUser(winner);
        await addUser(loser);
        await addMatch(winner, loser, starting_rating+win_c, starting_rating-lose_c, win_c, lose_c);

        await updateUser(winner, starting_rating+win_c);
        await updateUser(loser, starting_rating-lose_c);
    });
    it(`Deletes the most recent match`, async() =>{
        await undoLastMatch();
        const count = await models.Match.count();
        assert.equal(count, 0);
    });
    it(`Deletes only most recent match`, async() =>{
        await addMatch(winner, loser, starting_rating+win_c*2, starting_rating-lose_c*2, win_c, lose_c);
        await undoLastMatch();
        const count = await models.Match.count();
        assert.equal(count, 1);
    });
    it(`Updates the users to proper ratings`, async() =>{
        await undoLastMatch();
        const win_r = await rating(winner);

        const lose_r = await rating(loser);
        assert.equal(starting_rating, win_r);
        assert.equal(starting_rating, lose_r);
    });
    it(`Deletes two matches in a row`, async() =>{
        await addMatch(winner, loser, starting_rating+win_c*2, starting_rating-lose_c*2, win_c, lose_c);

        await updateUser(winner, starting_rating+win_c*2);
        await updateUser(loser, starting_rating-lose_c*2);
        await undoLastMatch();
        let count = await models.Match.count();
        assert.equal(count, 1);
        let win_r = await rating(winner);
        let lose_r = await rating(loser);
        assert.equal(starting_rating+win_c, win_r);
        assert.equal(starting_rating-win_c, lose_r);
        await undoLastMatch();
        count = await models.Match.count();
        assert.equal(count, 0);
        win_r = await rating(winner);
        lose_r = await rating(loser);
        assert.equal(starting_rating, win_r);
        assert.equal(starting_rating, lose_r);
    });
    it(`Deletes two matches in a row swapping winners`, async() =>{
        await addMatch(loser, winner, starting_rating, starting_rating, win_c, lose_c);

        await updateUser(winner, starting_rating);
        await updateUser(loser, starting_rating);
        await undoLastMatch();
        let count = await models.Match.count();
        assert.equal(count, 1);
        let win_r = await rating(winner);
        let lose_r = await rating(loser);
        assert.equal(starting_rating+win_c, win_r);
        assert.equal(starting_rating-win_c, lose_r);
        await undoLastMatch();
        count = await models.Match.count();
        assert.equal(count, 0);
        win_r = await rating(winner);
        lose_r = await rating(loser);
        assert.equal(starting_rating, win_r);
        assert.equal(starting_rating, lose_r);
    });
});