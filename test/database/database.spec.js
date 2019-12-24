import { assert } from 'chai';
import models, {User} from '../../src/models';
import {addUser, rating, ratingAdd, updateUser, rank, top, topRank} from "../../src/utils/database";
import truncate from '../../scripts/truncate';

const dotenv = require('dotenv');
dotenv.config();
const starting_rating = Number(process.env.DEFAULT_RATING);

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