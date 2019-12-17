import {stub} from "sinon";

import { expect } from'chai';
import sinon from "sinon";
import chai from 'chai';
import sinonChai from 'sinon-chai';
chai.use(sinonChai);
import proxyquire from 'proxyquire'
import { makeMockModels} from 'sequelize-test-helpers';
import 'babel-polyfill'

const mockModels = makeMockModels({ User: { findOne: sinon.stub(), create: sinon.stub() } });
const database = proxyquire('../src/utils/database', {
    '../models': mockModels
});
const starting_rating = Number(process.env.DEFAULT_RATING);
describe('add user', () =>{

    const fakeUser = {};
    const tName = 'Testy';
    const resetStubs = () => {
        mockModels.User.findOne.resetHistory();
        mockModels.User.create.resetHistory();
    };

    let result;
    context('user does not exist', () => {
        before(async () => {
            mockModels.User.findOne.resolves(undefined);
            result = await database.addUser(tName)
        });
        after(resetStubs);
        it('called User.findOne', () => {
            expect(mockModels.User.findOne).to.have.been.called
        });
        it("added to DB", () => {
            expect(mockModels.User.create).to.have.been.calledWith({
                tName: tName,
                rating: starting_rating
                }
            )
        });
        it('returned null', () => {
            expect(result).to.be.undefined
        })
    });
    context('user does exist', () => {
        before(async () => {
            mockModels.User.findOne.resolves(fakeUser);
            result = await database.addUser(tName)
        });
        after(resetStubs);
        it('called User.findOne', () => {
            expect(mockModels.User.findOne).to.have.been.called
        });
        it("not added to DB", () => {
            expect(mockModels.User.create).not.to.have.been.called
        });
        it('returned null', () => {
            expect(result).to.be.equal(fakeUser)
        })
    });
});


describe('rating', () =>{

    const tName = 'Testy';
    const fakeUser = {
        tName : 'Testy',
        rating : starting_rating };
    const resetStubs = () => {
        mockModels.User.findOne.resetHistory();
    };
    let result;
    context('user does not exist', () => {
        before(async () => {
            mockModels.User.findOne.resolves(undefined);
            result = await database.rating(tName);
        });
        after(resetStubs);
        it('called User.findOne', () => {
            expect(mockModels.User.findOne).to.have.been.called
        });
        it('returned null', () => {
            expect(result).to.be.null
        })
    });
    context('user exists', () => {
        before(async () => {
            mockModels.User.findOne.resolves(fakeUser);
            result = await database.rating(tName);
        });
        after(resetStubs);
        it('called User.findOne', () => {
            expect(mockModels.User.findOne).to.have.been.called
        });
        it('returned the rating', () => {
            expect(result).to.be.equal(starting_rating)
        })
    })
});

describe('update user', () =>{

    const fakeUser = { update: sinon.stub() };
    const tName = 'Testy';
    const endRating =  starting_rating + 100;
    const resetStubs = () => {
        mockModels.User.findOne.resetHistory();
        fakeUser.update.resetHistory()
    };
    let result;
    context('user does not exist', () => {
        before(async () => {
            mockModels.User.findOne.resolves(undefined);
            result = await database.updateUser(tName, endRating)
        });
        after(resetStubs);
        it('called User.findOne', () => {
            expect(mockModels.User.findOne).to.have.been.called
        });
        it("didn't call user.update", () => {
            expect(fakeUser.update).not.to.have.been.called
        });
        it('returned null', () => {
            expect(result).to.be.null
        })
    });
    context('user exists', () => {
        before(async () => {
            fakeUser.update.resolves(fakeUser);
            mockModels.User.findOne.resolves(fakeUser);
            result = await database.updateUser(tName, endRating)
        });
        after(resetStubs);
        it('called User.findOne', () => {
            expect(mockModels.User.findOne).to.have.been.called
        });
        it('called user.update', () => {
            expect(fakeUser.update).to.have.been.calledWith(
                {'rating': endRating})
        });
        it('returned the user', () => {
            expect(result).to.deep.equal(fakeUser)
        })
    })
});