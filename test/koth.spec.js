
import { expect } from'chai';
import Koth from '../src/utils/koth'


describe('koth functionality', () =>{
    const user = 'Testy';
    const user2 = 'McTestface';
    const user3 = 'Besty';
    context('test clear by itself ', ()=>{
        it('clears properly', ()=>{
            Koth.add(user);
            Koth.clear();

            let queue = Koth.get();
            expect(queue.length).to.equal(0)
        })
    });
    beforeEach(() => {
        Koth.clear();
    });

    it('adds to queue', () =>{
        Koth.add(user);
        let queue = Koth.get();
        expect(queue[0]).to.equal(user)
    });
    it('adds to the end of the queue', () =>{
        Koth.add(user);
        Koth.add(user2);
        let queue = Koth.get();
        expect(queue[1]).to.equal(user2)
    });
    it('gets a user index properly', ()=>{
        Koth.add(user);
        expect(Koth.get(user)).to.equal(0)
    });
    it('returns -1 when a user is not in queue', ()=>{
        Koth.add(user);
        expect(Koth.get(user2)).to.equal(-1)
    });
    it('adds at specific index when asked', () =>{
        Koth.add(user);
        Koth.add(user2);
        Koth.add(user3, 1);
        let queue = Koth.get();
        expect(queue[1]).to.equal(user3)
    });

    it('adds at the end when index is out of bounds', () =>{
        Koth.add(user);
        Koth.add(user2);
        Koth.add(user3, 10);
        let queue = Koth.get();
        expect(queue[2]).to.equal(user3)
    });

    it('thows an error when a user is already in queue', ()=>{
        Koth.add(user);
        try{
            Koth.add(user);
        }
        catch (e) {
            expect(e === `${user} is already in queue`).to.be.true
        }
    });

    it('thows an error when trying to remove a user not in queue', ()=>{
        Koth.add(user);
        try{
            Koth.remove(user2);
        }
        catch (e) {
            expect(e).to.equal(`${user2} not in queue`)
        }
    });

    it('removes the a user properly', () =>{
        Koth.add(user);
        Koth.remove(user);
        let queue = Koth.get();
        expect(queue.length).to.equal(0)
    });

    it('wins properly', () =>{
        Koth.add(user);
        Koth.add(user2);
        Koth.win();
        let queue = Koth.get();
        expect(queue.length).to.equal(1);
        expect(Koth.get(user2)).to.equal(-1);
    });

    it('loses properly', () =>{
        Koth.add(user);
        Koth.add(user2);
        Koth.lose();
        let queue = Koth.get();
        expect(queue.length).to.equal(1);
        expect(Koth.get(user)).to.equal(-1);
    });

});

describe('Arena Id stuff', () =>{
    it('sets aid', () =>{
        Koth.aid = 'ArenaID';
        expect(Koth.aid).to.equal('ArenaID')
    })
});