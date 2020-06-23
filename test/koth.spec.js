
import { expect } from'chai';
import Koth from '../src/utils/koth'

const target = "test";
describe('koth functionality', () =>{
    const user = 'Testy';
    const user2 = 'McTestface';
    const user3 = 'Besty';
    context('test clear by itself ', ()=>{
        it('clears properly', ()=>{
            Koth.hill(target).add(user);
            Koth.hill(target).clear();

            let queue = Koth.hill(target).get();
            expect(queue.length).to.equal(0)
        })
    });
    beforeEach(() => {
        Koth.hill(target).clear();
    });

    it('adds to queue', () =>{
        Koth.hill(target).add(user);
        let queue = Koth.hill(target).get();
        expect(queue[0]).to.equal(user)
    });
    it('adds to the end of the queue', () =>{
        Koth.hill(target).add(user);
        Koth.hill(target).add(user2);
        let queue = Koth.hill(target).get();
        expect(queue[1]).to.equal(user2)
    });
    it('gets a user index properly', ()=>{
        Koth.hill(target).add(user);
        expect(Koth.hill(target).get(user)).to.equal(0)
    });
    it('returns -1 when a user is not in queue', ()=>{
        Koth.hill(target).add(user);
        expect(Koth.hill(target).get(user2)).to.equal(-1)
    });
    it('adds at specific index when asked', () =>{
        Koth.hill(target).add(user);
        Koth.hill(target).add(user2);
        Koth.hill(target).add(user3, 1);
        let queue = Koth.hill(target).get();
        expect(queue[1]).to.equal(user3)
    });

    it('adds at the end when index is out of bounds', () =>{
        Koth.hill(target).add(user);
        Koth.hill(target).add(user2);
        Koth.hill(target).add(user3, 10);
        let queue = Koth.hill(target).get();
        expect(queue[2]).to.equal(user3)
    });

    it('thows an error when a user is already in queue', ()=>{
        Koth.hill(target).add(user);
        try{
            Koth.hill(target).add(user);
        }
        catch (e) {
            expect(e === `${user} is already in queue`).to.be.true
        }
    });

    it('thows an error when trying to remove a user not in queue', ()=>{
        Koth.hill(target).add(user);
        try{
            Koth.hill(target).remove(user2);
        }
        catch (e) {
            expect(e).to.equal(`${user2} not in queue`)
        }
    });

    it('removes the a user properly', () =>{
        Koth.hill(target).add(user);
        Koth.hill(target).remove(user);
        let queue = Koth.hill(target).get();
        expect(queue.length).to.equal(0)
    });

    it('wins properly', () =>{
        Koth.hill(target).add(user);
        Koth.hill(target).add(user2);
        Koth.hill(target).win();
        let queue = Koth.hill(target).get();
        expect(queue.length).to.equal(1);
        expect(Koth.hill(target).get(user2)).to.equal(-1);
    });

    it('loses properly', () =>{
        Koth.hill(target).add(user);
        Koth.hill(target).add(user2);
        Koth.hill(target).lose();
        let queue = Koth.hill(target).get();
        expect(queue.length).to.equal(1);
        expect(Koth.hill(target).get(user)).to.equal(-1);
    });

});

describe('Arena Id stuff', () =>{
    it('sets aid', () =>{
        Koth.hill(target).aid = 'ArenaID';
        expect(Koth.hill(target).aid).to.equal('ArenaID')
    })
});