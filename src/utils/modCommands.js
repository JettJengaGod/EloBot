import {atHandle, score_match} from "./helpers";
import Koth from './koth'
import {CommandList} from './commands'

function default_handle(args, target, client, usr) {
    client.say(target, 'This command isn\'t properly setup')
}
class Command{
    constructor(com='', help='', handle=default_handle) {
        this.com = com;
        this.help = help;
        this.handle = handle;
    }

    helpPrompt() {
        return this.help
    }

}

let idHandle = async (args, target, client, usr)=> {
    if(args.length === 1){
        Koth.aid = args[0];
        client.say(target, `The arena id is set to ${Koth.aid}`)
    }
    else if(args.length === 0){
        return CommandList['arenaid'].handle(args,target,client,usr)
    }
    else{

        client.say(target, `Please only send in the arena id separated by a space after !arenaid`)
    }
};

let idCom = new Command(
    'arenaid',
    `Use '!arenaid' to find the arena id! or '!arenaid [idhere]' to set a new one`,
    idHandle);

let idHandle2 = async (args, target, client, usr)=> {
    if(args.length === 1){
        Koth.aid2 = args[0];
        client.say(target, `The arena 2 id is set to ${Koth.aid2}`)
    }
    else if(args.length === 0){
        return CommandList['arenaid2'].handle(args,target,client,usr)
    }
    else{

        client.say(target, `Please only send in the arena id separated by a space after !arenaid2`)
    }
};

let idCom2 = new Command(
    'arenaid2',
    `Use '!arenaid2' to find the arena id! or '!arenaid2 [idhere]' to set a new one`,
    idHandle2);

let idHandle3 = async (args, target, client, usr)=> {
    if(args.length === 1){
        Koth.aid3 = args[0];
        client.say(target, `The arena 3 id is set to ${Koth.aid3}`)
    }
    else if(args.length === 0){
        return CommandList['arenaid3'].handle(args,target,client,usr)
    }
    else{

        client.say(target, `Please only send in the arena id separated by a space after !arenaid3`)
    }
};

let idCom3 = new Command(
    'arenaid3',
    `Use '!arenaid3' to find the arena id! or '!arenaid3 [idhere]' to set a new one`,
    idHandle3);

let winHandle = async (args, target, client, usr)=> {
    let msg = `There needs to be at least a king and one challenger for someone to win.`;
    let queue = Koth.get();
    if(queue.length <2){
        client.say(target, msg);
        return
    }

    const king = queue[0];
    const loser = queue[1];
    const rChanges = await score_match(king, loser);
    Koth.win();
    msg = `The King ${king} ${rChanges['w_r']}(+${rChanges['win_r_c']}) defeated ${loser} ${rChanges['l_r']}(-${rChanges['lose_r_c']}) 
            and remains king.`;
    if(queue.length>2){
        msg += `${queue[2]} is next (ArenaID: ${Koth.aid}`
    }
    client.say(target, msg);
};

let winCom = new Command(
    'win',
    `Use '!win' as a mod to say that the king won`,
    winHandle);

let loseHandle = async (args, target, client, usr)=> {
    let msg = `There needs to be at least a king and one challenger for someone to lose.`;
    let queue = Koth.get();
    if(queue.length <2){
        client.say(target, msg);
        return
    }
    const winner = queue[1];
    const loser = queue[0];
    const rChanges = await score_match(winner, loser);
    Koth.lose();
    msg = `The King ${loser} ${rChanges['l_r']}(-${rChanges['lose_r_c']}) is defeated ${winner} ${rChanges['w_r']}(+${rChanges['win_r_c']}) 
            is the new King.`;
    if(queue.length>2){
        msg += `${queue[2]} is next (ArenaID: ${Koth.aid}`
    }
    client.say(target, msg);
};

let loseCom = new Command(
    'lose',
    `Use '!lose' as a mod to say that the king won`,
    loseHandle);

let openHandle = async (args, target, client, usr)=> {
    let msg = `The list is already open!`;
    if(Koth.open === false){
        Koth.openList();
        msg = `The list is now open!`
    }
    client.say(target, msg);
};

let openCom = new Command(
    'open',
    `Use '!open' as a mod to open the KotH list`,
    openHandle);

let closeHandle = async (args, target, client, usr)=> {
    let msg = `The list is already closed!`;
    if(Koth.open === true){
        Koth.close();
        msg = `The list is now closed!`
    }
    client.say(target, msg);
};

let closeCom = new Command(
    'close',
    `Use '!close' as a mod to close the KotH list`,
    closeHandle);

let addHandle = async (args, target, client, usr)=> {

    let msg = `please call add like this '!add @username' or '!add @username [number]'`;
    if(args.length === 1){
        const username = atHandle(args[0]);
        if(Koth.get(username) === -1){
            Koth.add(username);
            msg = `${username} added to list!`
        }
        else{
            msg = `${username} is already in the list!`
        }
    }
    else if(args.length === 2){
        const username = atHandle(args[0]);
        if(!Number.isInteger(Number(args[1]))){
            msg = `Please use a number when calling '!add @username [number]'`
        }
        else {
            const index = Math.min(Number(args[1]),Koth.get().length);
            if (Koth.get(username) === -1) {
                Koth.add(username,index);
                msg = `${username} added to list at position ${index}!`
            }
            else{
                msg = `${username} is already in the list!`
            }
        }
    }
    client.say(target, msg);
};

let addCom = new Command(
    'add',
    `Use '!add @username' as a mod to add username to the list`,
    addHandle);

let removeHandle = async (args, target, client, usr)=> {

    let msg = `please call add like this '!remove @username'`;
    if(args.length === 1){
        const username = atHandle(args[0]);
        if(Koth.get(username) !== -1){
            Koth.remove(username);
            msg = `${username} removed from list!`
        }
        else{
            msg = `${username} is not in the list!`
        }
    }
    client.say(target, msg);
};

let removeCom = new Command(
    'remove',
    `Use '!remove @username' as a mod to remove username from the list`,
    removeHandle);

let clearHandle = async (args, target, client, usr)=> {
    Koth.clear();
    client.say(target, `The list is now cleared!`);
};

let clearCom = new Command(
    'clear',
    `Use '!clear' as a mod to clear the KotH list`,
    clearHandle);

export let ModCommandList = {
    'arenaid' : idCom,
    'arenaid2' : idCom2,
    'arenaid3' : idCom3,
    'win' : winCom,
    'lose' : loseCom,
    'open' : openCom,
    'close': closeCom,
    'add': addCom,
    'remove' : removeCom,
    'clear' : clearCom
};