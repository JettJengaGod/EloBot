import {atHandle, score_match} from "./helpers";
import Koth from './koth'
import {CommandList} from './commands'
import {updateUser, delUser, undoLastMatch, nukeDB} from "./database";

function default_handle(args, target, usr) {
    return'This command isn\'t properly setup'
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

let idHandle = async (args, target, usr)=> {
    if(args.length === 1){
        Koth.hill(target).aid = args[0];
        return`The Arena ID is set to ${Koth.hill(target).aid}.`
    }
    else if(args.length === 0){
        return CommandList['arenaid'].handle(args,target,usr)
    }
    else{

        return`Please only send in the Arena ID separated by a space after !arenaid`
    }
};

let idCom = new Command(
    'arenaid',
    `Use '!arenaid' to find the Arena ID! or '!arenaid [idhere]' to set a new one`,
    idHandle);

let idHandle2 = async (args, target, usr)=> {
    if(args.length === 1){
        Koth.hill(target).aid2 = args[0];
        return`The Arena 2 ID is set to ${Koth.hill(target).aid2}.`
    }
    else if(args.length === 0){
        return CommandList['arenaid2'].handle(args,target,usr)
    }
    else{

        return`Please only send in the Arena ID separated by a space after !arenaid2`
    }
};

let idCom2 = new Command(
    'arenaid2',
    `Use '!arenaid2' to find the Arena ID! or '!arenaid2 [idhere]' to set a new one`,
    idHandle2);

let idHandle3 = async (args, target, usr)=> {
    if(args.length === 1){
        Koth.hill(target).aid3 = args[0];
        return`The Arena 3 ID is set to ${Koth.hill(target).aid3}.`
    }
    else if(args.length === 0){
        return CommandList['arenaid3'].handle(args,target,usr)
    }
    else{

        return`Please only send in the Arena ID separated by a space after !arenaid3`
    }
};

let idCom3 = new Command(
    'arenaid3',
    `Use '!arenaid3' to find the arena id! or '!arenaid3 [idhere]' to set a new one`,
    idHandle3);
let queueApped = (msg, queue, target) =>{
    if(queue.length>=2){
        msg += `: ${queue[1]} is next (ArenaID: ${Koth.hill(target).aid})`
    }
    if(queue.length>=3){
        msg += ` ${queue[2]} is on deck`
    }
    if(queue.length>=4){
        msg += ` and ${queue[3]} is in the hole`
    }
    return msg
};
let skipHandle = async (args, target, usr)=> {
    let msg = `There needs to be at least a king and one challenger for someone to be skipped.`;
    let queue = Koth.hill(target).get();
    if(queue.length <2){
        return msg;
    }
    const skipped = queue[1];
    Koth.hill(target).skip();
    msg = `Skipped ${skipped} `;
    msg = queueApped(msg, queue, target);
    return msg;
};

let skipCom = new Command(
    'skip',
    `Use '!skip' as a mod to skip the first challenger`,
    skipHandle);
let winHandle = async (args, target, usr)=> {
    let msg = `There needs to be at least a king and one challenger for someone to win.`;
    let queue = Koth.hill(target).get();
    if(queue.length <2){
        return msg;
    }

    const king = queue[0];
    const loser = queue[1];
    const rChanges = await score_match(king, loser, target);
    Koth.hill(target).win();
    msg = `The King ${king} ${rChanges['w_r']}(+${rChanges['win_r_c']}) defeated ${loser} ${rChanges['l_r']}(-${rChanges['lose_r_c']}) 
            Streak(${Koth.hill(target).streak()}) and remains King.  `;
    msg = queueApped(msg, queue, target);
    return msg;
};

let winCom = new Command(
    'win',
    `Use '!win' as a mod to say that the king won`,
    winHandle);

let loseHandle = async (args, target, usr)=> {
    let msg = `There needs to be at least a king and one challenger for someone to lose.`;
    let queue = Koth.hill(target).get();
    if(queue.length <2) {
        return msg;
    }
    const winner = queue[1];
    const loser = queue[0];
    const rChanges = await score_match(winner, loser, target);
    Koth.hill(target).lose();
    msg = `The King ${loser} ${rChanges['l_r']}(-${rChanges['lose_r_c']}) is defeated. ${winner} ${rChanges['w_r']}(+${rChanges['win_r_c']}) 
            is the new King.  `;
    msg = queueApped(msg, queue, target);
    return msg;
};

let loseCom = new Command(
    'lose',
    `Use '!lose' as a mod to say that the king won`,
    loseHandle);

let openHandle = async (args, target, usr)=> {
    let msg = `The list is already open!`;
    if(Koth.hill(target).open === false){
        Koth.hill(target).openList();
        msg = `The list is now open!`
    }
    return msg;
};

let openCom = new Command(
    'open',
    `Use '!open' as a mod to open the KotH list`,
    openHandle);

let closeHandle = async (args, target, usr)=> {
    let msg = `The list is already closed!`;
    if(Koth.hill(target).open === true){
        Koth.hill(target).close();
        msg = `The list is now closed!`
    }
    return msg;
};

let closeCom = new Command(
    'close',
    `Use '!close' as a mod to close the KotH list`,
    closeHandle);
let addListHandle = async (args, target, usr)=> {

    let msg = `please call add like this '!add @username' or '!add @username [number]'`;
    if(args.length === 1){
        const username = atHandle(args[0]);
        if(Koth.hill(target).get(username) === -1){
            Koth.hill(target).add(username);
            msg = `${username} added to list!`
        }
        else{
            msg = `${username} is already in the list!`
        }
    }
    else if(args.length >= 2){
        if(args[2] === '~~~~'){
            args.splice(3,1);
            args.splice(2,1);
            args.splice(0,1);
        }
        msg = `Added `;
        let extras = ``;
        for(let i = 0; i< args.length; i ++){
            let username = atHandle(args[i]);
            if (Koth.hill(target).get(username) === -1) {
                Koth.hill(target).add(username);
                msg += `${username}, `
            }
            else{
                extras += `${username}, `
            }
        }
        if(msg == `Added `){
            msg = ``;
        }
        else {
            msg = msg.substring(0, msg.length - 2);
        }
        if(extras.length > 0){
            extras = extras.substring(0, extras.length - 2);
            msg += ` These Players are already in the list ` + extras
        }
    }
    return msg;
};

let addListCom = new Command(
    'addlist',
    `Use '!addlist' and a list of people to add a list queue`,
    addListHandle);


let addHandle = async (args, target, usr)=> {

    let msg = `please call add like this '!add @username' or '!add @username [number]'`;
    if(args.length === 1){
        const username = atHandle(args[0]);
        if(Koth.hill(target).get(username) === -1){
            Koth.hill(target).add(username);
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
            const index = Math.min(Number(args[1]),Koth.hill(target).get().length);
            if (Koth.hill(target).get(username) === -1) {
                Koth.hill(target).add(username,index);
                msg = `${username} added to list at position ${index}!`
            }
            else{
                msg = `${username} is already in the list!`
            }
        }
    }
    return msg;
};

let addCom = new Command(
    'add',
    `Use '!add @username' as a mod to add username to the list`,
    addHandle);

let removeHandle = async (args, target, usr)=> {

    let msg = `please call add like this '!remove @username'`;
    if(args.length === 1){
        const username = atHandle(args[0]);
        if(Koth.hill(target).get(username) !== -1){
            Koth.hill(target).remove(username);
            msg = `${username} removed from list!`
        }
        else{
            msg = `${username} is not in the list!`
        }
    }
    return msg;
};

let removeCom = new Command(
    'remove',
    `Use '!remove @username' as a mod to remove username from the list`,
    removeHandle);

let moveHandle = async (args, target, usr)=> {

    let msg = `Please call move like this '!move @username' or '!move @username [number]'`;
    if(args.length === 2){
        const username = atHandle(args[0]);
        if(!Number.isInteger(Number(args[1]))){
            msg = `Please use a number when calling '!move @username [number]'`
        }
        else {
            const index = Math.min(Number(args[1]),Koth.hill(target).get().length);
            if (Koth.hill(target).get(username) === -1) {
                msg = `${username} is not in the list!`
            }
            else{
                Koth.hill(target).remove(username);
                Koth.hill(target).add(username, index);
                msg = `${username} moved in list to position ${index}!`
            }
        }
    }
    return msg;
};

let moveCom = new Command(
    'move',
    `Use '!move @username [number]' as a mod to move username to the spot in the list`,
    moveHandle);

let clearHandle = async (args, target, usr)=> {
    Koth.hill(target).clear();
    return`The list is now cleared!`;
};

let clearCom = new Command(
    'clear',
    `Use '!clear' as a mod to clear the KotH list`,
    clearHandle);

let undoHandle = async (args, target, usr)=> {
    let last = await undoLastMatch(target);
    let msg = `Match between ${last.winner}(${last.w_r - last.w_rc}) and ${last.loser} (${last.l_r + last.l_rc}) undone and ratings are updated!`;
    return msg;
};

let undoCom = new Command(
    'undo',
    `Use '!undo' as a mod to undo the last match.`,
    undoHandle);

let charHandle = async (args, target, usr)=> {
    let msg = 'You need to say a character';

    if(args.length > 0){
        let char = "";
        for(let i = 0; i< args.length; i++){
            char = char.concat(args[i]);
        }
        Koth.hill(target).add_char(char);
        msg = "Added ".concat(char);
    }

    return msg;
};
let charCom = new Command(
    'char',
    `Use '!char character' as a mod to add username to the list`,
    charHandle);

export let ModCommandList = {
    'arenaid' : idCom,
    'arenaid2' : idCom2,
    'arenaid3' : idCom3,
    'arena' : idCom,
    'id' : idCom,
    'arena2' : idCom2,
    'id2' : idCom2,
    'win' : winCom,
    'lose' : loseCom,
    'undo' : undoCom,
    'open' : openCom,
    'close': closeCom,
    'add': addCom,
    'addlist' : addListCom,
    'skip': skipCom,
    'remove' : removeCom,
    'move' : moveCom,
    'clear' : clearCom,
    'char' : charCom
};

let setRatingHandle = async (args, target, usr)=> {
    let msg = 'Invalid input';
    if(args.length === 2){
        const username = atHandle(args[0]);
        if(!Number.isInteger(Number(args[1]))){
            msg = `Please use a number when calling '!setrating @username [number]'`
        }
        else {
            let number = Number(args[1]);
            msg = `${username} updated to ${number}.`;
            await updateUser(username, number, target);
            }
        }

    return msg;
    };




let setRatingCom = new Command(
    'setrating',
    `Use '!add @username' as a mod to add username to the list`,
    setRatingHandle);

let nukeHandle = async (args, target, usr)=> {
    await nukeDB(target);
    let msg = `All users deleted from database. I hope you're happy. D:`;
    return msg;
};

let nukeCom = new Command(
    'nukeall',
    `Only use nukeall if you know what you are doing`,
    nukeHandle);

let delHandle = async (args, target, usr)=> {
    let msg = `please call add like this '!deluser @username'`;
    if(args.length === 1){
        const username = atHandle(args[0]);
        await delUser(username, target);
        msg = `User ${username} deleted from database.`
    }
    return msg;
};

let delCom = new Command(
    'deluser',
    `Use '!add @username' as a mod to add username to the list`,
    delHandle);

let streamHandle = async (args, target, usr)=> {
    let msg = `please call add like this '!deluser @username'`;
    if(args.length === 1){
        const username = args[0];
        await delUser(username, target);
        msg = `User ${username} deleted from database.`
    }
    return msg;
};

let streamCom = new Command(
    'addstream',
    `Use '!add streamname' as a mod to add a stream to the list of streams`,
    streamHandle);

export let JettCommands ={
    'setrating' : setRatingCom,
    'deluser' : delCom,
    'nukeall' : nukeCom,
    'addstream' : streamCom
};
