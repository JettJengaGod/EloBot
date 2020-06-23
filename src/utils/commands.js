import { addUser, rating, updateUser, ratingAdd, rank, topRank} from "./database";
import {atHandle} from "./helpers";
import Koth from './koth'
import {ModCommandList} from "./modCommands";

function default_handle(args, target, usr) {
    return('This command isn\'t properly setup')
}
export class Command{
    constructor(com='', help='', handle=default_handle) {
        this.com = com;
        this.help = help;
        this.handle = handle;
    }

    helpPrompt() {
        return this.help
    }

}

let baseHandle = async (args, target, usr)=> {
    return 'Works';
};

let baseCom = new Command(
    'base',
    'No help',
    baseHandle);

let ratingHandle = async (args, target, usr)=>{
    let msg = `rating expects either '!rating' to find your rating or '!rating @username' to find another's rating`;
    if(args.length > 1){

        return msg;
    }
    if(args.length === 1){
        usr = atHandle(args[0]);
    }
    else{
        usr = atHandle(usr);
    }
    const usr_r = await rating(usr,target);
    if(usr_r !== null){
        msg = `${usr}'s rating is ${usr_r}`;
    }
    else{
        msg = `${usr} does not have a rating, play a match to get a rating`
    }

    return msg;
};

let ratingCom = new Command(
    'rating',
    `Use '!rating' to find your rating or '!rating @username' to find another's rating`,
    ratingHandle);

let help = function (args, target, usr) {
    if(args.length === 1){
        const command = args[0];
        if(command in CommandList) {
            return CommandList[command].help;
        }
        else if(args[0] in ModCommandList){
            return ModCommandList[command].help;
        }
        else {
            return `Command: ${command} not recognized.`;
        }
    }
    else if(args.length === 0){
        return helpCom.help;
    }
    else{
        return `use '!help' or '!help commandname' to get help.`;
    }
};

let helpCom = new Command(
    'help',
    `use '!help command' to get help on a specific command or visit https://pastebin.com/MN7KQ3mH to find out more.`,
    help
);

let websiteHandle = function (args, target, usr) {
    return `The website is https://jettelobot.herokuapp.com/`;
};

let websiteCom = new Command(
    'website',
    `use '!website' to get a link to the website https://jettelobot.herokuapp.com/.`,
    websiteHandle
);


let rankHandle =  async (args, target, usr)=>{
    let msg = `rank expects either '!rank' to find your rank or '!rank @username' to find another's rank`;
    if(args.length > 1){

        return msg;
    }
    if(args.length === 1){
        usr = args[0];
    }
    usr = atHandle(usr);
    const usr_r = await rating(usr, target);
    const usr_rank = await rank(usr, target);
    if(usr_r !== null && usr_rank[0] !== null){
        msg = `${usr}'s rank is ${usr_rank[0]}/${usr_rank[1]} (${usr_r})`;
    }
    else{
        msg = `${usr} does not have a rank, play a match to get a rank`
    }

    return msg;
};

let rankCom = new Command(
    'rank',
    `user '!rank' to find what your rank is or '!rank @username' to find someone else rank`,
    rankHandle
);

let listHandle = async (args, target, usr)=> {
    let msg = '';
    let queue = Koth.hill(target).get();
    switch (queue.length) {
        case 0:
            msg = `No users in the list, use '!challenge' to join the list.`;
            break;
        case 1:
            msg = `King: ${queue[0]} ~~~~ Challengers: There are no challengers, use '!challenge' to join the list.`;
            break;
        default:
            msg = `King: ${queue[0]} ~~~~ Challengers: `;
            for(let i = 1; i < queue.length; i++){
                msg += `${queue[i]}, `
            }
            msg = msg.substring(0, msg.length - 2);
    }

    if (Koth.hill(target).get(usr) !== -1) {
        msg += ` You are at position ${Koth.hill(target).get(usr)}.`
    }
    return msg;
};

let listCom = new Command(
    'list',
    `Use '!list' to find who is the king and what players are in the queue`,
    listHandle);

let challengeHandle = async (args, target, usr)=> {
    usr = atHandle(usr);
    if (Koth.hill(target).open) {
        if (Koth.hill(target).get(usr) === -1) {
            Koth.hill(target).add(usr);
            return `${usr} has been added to the queue at position ${Koth.hill(target).get(usr)}.`;
        } else {
            return `${usr} is already in the queue at position ${Koth.hill(target).get(usr)}.`;
        }
    }
    else{

        return `The list is currently closed.`;
    }
};

let challengeCom = new Command(
    'challenge',
    `Use '!challenge' to add yourself to the queue!`,
    challengeHandle);

let dropspotHandle = async (args, target, usr)=> {
    usr = atHandle(usr);
    if(Koth.hill(target).get(usr) === -1) {
        return `Cannot drop ${usr} as they are not in queue.`;
    }
    else{
        Koth.hill(target).remove(usr);
        return `${usr} has left the queue.`;
    }
};

let dropspotCom = new Command(
    'dropspot',
    `Use '!dropspot' to remove yourself from the queue`,
    dropspotHandle);

let spotHandle = async (args, target, usr)=> {
    if(args.length === 1){
        usr = args[0]
    }
    usr = atHandle(usr);
    const spot = Koth.hill(target).get(usr);
    let msg = '';
    switch (spot) {
        case 0:
            msg = `${usr} is the king, how do you not know that?`;
            break;
        case -1:
            msg = `${usr} is not in queue`;
            break;
        default:
            msg = `${usr} is ${spot} in the queue`
    }
    return msg;
};

let spotCom = new Command(
    'spot',
    `Use '!spot' to find your place in the queue`,
    spotHandle);


let idHandle = async (args, target, usr)=> {
    return `The Arena ID is ${Koth.hill(target).aid}.`;
};

let idCom = new Command(
    'arenaid',
    `Use '!arenaid' to find the arena id!`,
    idHandle);

let idHandle2 = async (args, target, usr)=> {
    return `The Arena 2 ID is ${Koth.hill(target).aid2}.`;
};
//TODO refactor arenaid2 and 3
let idCom2 = new Command(
    'arenaid2',
    `Use '!arenaid2' to find the arena id 2!`,
    idHandle2);

let idHandle3 = async (args, target, usr)=> {
    return `The Arena 3 ID is ${Koth.hill(target).aid3}.`;
};

let idCom3 = new Command(
    'arenaid3',
    `Use '!arenaid3' to find the arena id 3!`,
    idHandle3);

let topHandle = async (args, target, usr)=> {
    let tops = await topRank(5);
    let msg = `The Top 5 is: `;
    for(let i = 0; i < tops.length; i ++){
        msg += `${i+1}. ${tops[i].tName}(${tops[i].rating}), `;
    }
    msg = msg.substring(0, msg.length-2);
    return msg;
};

let topCom = new Command(
    'top',
    `Use '!top to see the top 5 players`,
    topHandle);

let kingHandle = async (args, target, usr)=> {
    let msg = "The king has used : ";
    msg = msg.concat(Koth.hill(target).chars().join(", "))
    return msg;
};

let kingCom = new Command(
    'top',
    `Use '!top to see the top 5 players`,
    kingHandle);


export let CommandList = {
    'base' : baseCom,
    'rating' : ratingCom,
    'help' : helpCom,
    'website' : websiteCom,
    'leaderboard' : websiteCom,
    'rank' : rankCom,
    'list' : listCom,
    'challenge' : challengeCom,
    'chal' : challengeCom,
    'join' : challengeCom,
    'dropspot' : dropspotCom,
    'spot' : spotCom,
    'arena' : idCom,
    'id' : idCom,
    'arenaid' : idCom,
    'arenaid2' : idCom2,
    'arena2' : idCom2,
    'id2' : idCom2,
    'arenaid3' : idCom3,
    'top' : topCom,
    'king' : kingCom
};