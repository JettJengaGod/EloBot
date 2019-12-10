import { assert } from 'chai';

import models from '../../src/models';
import { addUser, rating, rating_add, updateUser} from "../../src/utils/database";
import truncate from '../../scripts/truncate';

const dotenv = require('dotenv');
dotenv.config();


describe('User DB Functions', () => {
    let addeduser;
    const username = 'Testy';
    const starting_rating = Number(process.env.DEFAULT_RATING);
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
        let r = await rating_add(username);
        const count = await models.User.count();
        assert.equal(count, 1);
        assert.equal(r, starting_rating)

    });

    it('should add user if no user is found', async () => {
        let r = await rating_add('new_user');
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