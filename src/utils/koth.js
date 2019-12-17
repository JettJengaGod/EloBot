class Koth {
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
    constructor(){
        if(! Koth.instance){
            this._queue = [];
            Koth.instance = this;
            this._aid = 'not set';
            this._aid2 = 'not set';
            this._aid3 = 'not set';
            this._open = true;
        }

        return Koth.instance;
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
    }

    lose(){
        this._queue.splice(0, 1);
    }
    clear(){
        this._queue = [];
    }
    close(){
        this._open = false;
    }
    openList(){
        this._open = true;
    }

}


const instance = new Koth();

export default instance;