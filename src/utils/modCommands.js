import {atHandle, score_match} from "./helpers";
import Koth from './koth'
import {CommandList} from './commands'
import {updateUser, delUser, undoLastMatch} from "./database";

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
        client.say(target, `The Arena ID is set to ${Koth.aid}.`)
    }
    else if(args.length === 0){
        return CommandList['arenaid'].handle(args,target,client,usr)
    }
    else{

        client.say(target, `Please only send in the Arena ID separated by a space after !arenaid`)
    }
};

let idCom = new Command(
    'arenaid',
    `Use '!arenaid' to find the Arena ID! or '!arenaid [idhere]' to set a new one`,
    idHandle);

let idHandle2 = async (args, target, client, usr)=> {
    if(args.length === 1){
        Koth.aid2 = args[0];
        client.say(target, `The Arena 2 ID is set to ${Koth.aid2}.`)
    }
    else if(args.length === 0){
        return CommandList['arenaid2'].handle(args,target,client,usr)
    }
    else{

        client.say(target, `Please only send in the Arena ID separated by a space after !arenaid2`)
    }
};

let idCom2 = new Command(
    'arenaid2',
    `Use '!arenaid2' to find the Arena ID! or '!arenaid2 [idhere]' to set a new one`,
    idHandle2);

let idHandle3 = async (args, target, client, usr)=> {
    if(args.length === 1){
        Koth.aid3 = args[0];
        client.say(target, `The Arena 3 ID is set to ${Koth.aid3}.`)
    }
    else if(args.length === 0){
        return CommandList['arenaid3'].handle(args,target,client,usr)
    }
    else{

        client.say(target, `Please only send in the Arena ID separated by a space after !arenaid3`)
    }
};

let idCom3 = new Command(
    'arenaid3',
    `Use '!arenaid3' to find the arena id! or '!arenaid3 [idhere]' to set a new one`,
    idHandle3);
let queueApped = (msg, queue) =>{
    if(queue.length>=2){
        msg += `${queue[1]} is next (ArenaID: ${Koth.aid})`
    }
    if(queue.length>=3){
        msg += ` ${queue[2]} is on deck`
    }
    if(queue.length>=4){
        msg += ` and ${queue[3]} is in the hole`
    }
    return msg
};
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
            and remains King.  `;
    msg = queueApped(msg, queue);
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
    msg = `The King ${loser} ${rChanges['l_r']}(-${rChanges['lose_r_c']}) is defeated. ${winner} ${rChanges['w_r']}(+${rChanges['win_r_c']}) 
            is the new King.  `;
    msg = queueApped(msg, queue);
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

let moveHandle = async (args, target, client, usr)=> {

    let msg = `Please call move like this '!move @username' or '!move @username [number]'`;
    if(args.length === 2){
        const username = atHandle(args[0]);
        if(!Number.isInteger(Number(args[1]))){
            msg = `Please use a number when calling '!move @username [number]'`
        }
        else {
            const index = Math.min(Number(args[1]),Koth.get().length);
            if (Koth.get(username) === -1) {
                msg = `${username} is not in the list!`
            }
            else{
                Koth.remove(username);
                Koth.add(username, index);
                msg = `${username} moved in list to position ${index}!`
            }
        }
    }
    client.say(target, msg);
};

let moveCom = new Command(
    'move',
    `Use '!move @username [number]' as a mod to move username to the spot in the list`,
    moveHandle);

let clearHandle = async (args, target, client, usr)=> {
    Koth.clear();
    client.say(target, `The list is now cleared!`);
};

let clearCom = new Command(
    'clear',
    `Use '!clear' as a mod to clear the KotH list`,
    clearHandle);

let undoHandle = async (args, target, client, usr)=> {
    let last = await undoLastMatch();
    let msg = `Match between ${last.winner}(${last.w_r - last.w_rc}) and ${last.loser} (${last.l_r + last.l_rc}) undone and ratings are updated!`;
    client.say(target, msg);
};

let undoCom = new Command(
    'undo',
    `Use '!undo' as a mod to undo the last match.`,
    undoHandle);

export let ModCommandList = {
    'arenaid' : idCom,
    'arenaid2' : idCom2,
    'arenaid3' : idCom3,
    'win' : winCom,
    'lose' : loseCom,
    'undo' : undoCom,
    'open' : openCom,
    'close': closeCom,
    'add': addCom,
    'remove' : removeCom,
    'move' : moveCom,
    'clear' : clearCom
};

let setRatingHandle = async (args, target, client, usr)=> {
    let msg = 'Invalid input';
    if(args.length === 2){
        const username = atHandle(args[0]);
        if(!Number.isInteger(Number(args[1]))){
            msg = `Please use a number when calling '!setrating @username [number]'`
        }
        else {
            let number = Number(args[1]);
            msg = `${username} updated to ${number}.`;
            await updateUser(username, number);
            }
        }

    client.say(target, msg);
    };

let setRatingCom = new Command(
    'setrating',
    `Use '!add @username' as a mod to add username to the list`,
    setRatingHandle);


let delHandle = async (args, target, client, usr)=> {
    let msg = `please call add like this '!deluser @username'`;
    if(args.length === 1){
        const username = atHandle(args[0]);
        await delUser(username);
        msg = `User ${username} deleted from database.`
    }
    client.say(target, msg);
};

let delCom = new Command(
    'deluser',
    `Use '!add @username' as a mod to add username to the list`,
    delHandle);

export let JettCommands ={
    'setrating' : setRatingCom,
    'deluser' : delCom
};