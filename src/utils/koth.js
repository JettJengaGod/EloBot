class hill {
    get open() {
        return this._open;
    }

    set open(value) {
        this._open = value;
    }
    get aid3() {
        return this._aid3;
    }

    set aid3(value) {
        this._aid3 = value;
    }
    get aid2() {
        return this._aid2;
    }

    set aid2(value) {
        this._aid2 = value;
    }
    get aid() {
        return this._aid;
    }

    set aid(value) {
        this._aid = value;
    }
    constructor(streamer){
        this._queue = [];
        this._aid = 'not set';
        this._aid2 = 'not set';
        this._aid3 = 'not set';
        this._open = true;
        this._clist = [];
        this._streak = 0;
        this.streamer = streamer;
    }

    add(user, index = null){
        if(this._queue.includes(user)){
            throw `${user} is already in queue`
        }
        if(index !== null)
            this._queue.splice(index, 0 , user);
        else
            this._queue.push(user);
    }

    get(user=null){
        if(user)
            return this._queue.indexOf(user);
        return this._queue;
    }

    remove(user){
        if(this._queue.includes(user)){
            this._queue.splice(this._queue.indexOf(user), 1)
        }
        else{
            throw `${user} not in queue`
        }
    }

    win(){
        this._queue.splice(1, 1);
        this._streak += 1;
    }
    skip(){
        this._queue.splice(1, 1);
    }
    lose(){
        this._streak = 1;
        this._clist = [];
        this._queue.splice(0, 1);
    }
    clear(){
        this._queue = [];
        this._clist = [];
    }
    close(){
        this._open = false;
    }
    openList(){
        this._open = true;
    }
    add_char(c){
        this._clist.push(c);
    }
    chars(){
        return this._clist;
    }
    streak(){
        return this._streak;
    }
}

class Koth{
    constructor(){
        if(! Koth.instance){
            this._hills = {};
            Koth.instance = this;
        }

        return Koth.instance;
    };
    addHill(streamer){
        this._hills[streamer] = new hill(streamer);
    }
    hill(streamer){
        if(!(streamer in this._hills)){
            this._hills[streamer] = new hill(streamer);
        }
        return this._hills[streamer];
    }
}
const instance = new Koth();

export default instance;