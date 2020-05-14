import { addUser, rating, updateUser, ratingAdd, rank, topRank} from "./database";
import {atHandle} from "./helpers";
import Koth from './koth'
import {ModCommandList} from "./modCommands";

function default_handle(args, target, client, usr) {
    client.say(target, 'This command isn\'t properly setup')
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

let baseHandle = async (args, target, client, usr)=> {
    client.say(target, 'Works');
};

let baseCom = new Command(
    'base',
    'No help',
    baseHandle);

let ratingHandle = async (args, target, client, usr)=>{
    let msg = `rating expects either '!rating' to find your rating or '!rating @username' to find another's rating`;
    if(args.length > 1){

        client.say(target, msg);
        return
    }
    if(args.length === 1){
        usr = atHandle(args[0]);
    }
    else{
        usr = atHandle(usr);
    }
    const usr_r = await rating(usr);
    if(usr_r !== null){
        msg = `${usr}'s rating is ${usr_r}`;
    }
    else{
        msg = `${usr} does not have a rating, play a match to get a rating`
    }

    client.say(target, msg)
};

let ratingCom = new Command(
    'rating',
    `Use '!rating' to find your rating or '!rating @username' to find another's rating`,
    ratingHandle);

let help = function (args, target, client, usr) {
    if(args.length === 1){
        const command = args[0];
        if(command in CommandList) {
            client.say(target, CommandList[command].help)
        }
        else if(args[0] in ModCommandList){
            client.say(target, ModCommandList[command].help)
        }
        else {
            client.say(target, `Command: ${command} not recognized.`)
        }
    }
    else if(args.length === 0){
        client.say(target, helpCom.help)
    }
    else{
        client.say(target, `use '!help' or '!help commandname' to get help.`)
    }
};

let helpCom = new Command(
    'help',
    `use '!help command' to get help on a specific command or visit https://pastebin.com/MN7KQ3mH to find out more.`,
    help
);

let websiteHandle = function (args, target, client, usr) {
    client.say(target, `The website is https://jettelobot.herokuapp.com/`)
};

let websiteCom = new Command(
    'website',
    `use '!website' to get a link to the website https://jettelobot.herokuapp.com/.`,
    websiteHandle
);


let rankHandle =  async (args, target, client, usr)=>{
    let msg = `rank expects either '!rank' to find your rank or '!rank @username' to find another's rank`;
    if(args.length > 1){

        client.say(target, msg);
        return
    }
    if(args.length === 1){
        usr = args[0];
    }
    usr = atHandle(usr);
    const usr_r = await rating(usr);
    const usr_rank = await rank(usr);
    if(usr_r !== null && usr_rank[0] !== null){
        msg = `${usr}'s rank is ${usr_rank[0]}/${usr_rank[1]} (${usr_r})`;
    }
    else{
        msg = `${usr} does not have a rank, play a match to get a rank`
    }

    client.say(target, msg);
};

let rankCom = new Command(
    'rank',
    `user '!rank' to find what your rank is or '!rank @username' to find someone else rank`,
    rankHandle
);

let listHandle = async (args, target, client, usr)=> {
    let msg = '';
    let queue = Koth.get();
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

    if (Koth.get(usr) !== -1) {
        msg += `\n You are at position ${Koth.get(usr)}.`
    }
    await client.say(target, msg);
};

let listCom = new Command(
    'list',
    `Use '!list' to find who is the king and what players are in the queue`,
    listHandle);

let challengeHandle = async (args, target, client, usr)=> {
    usr = atHandle(usr);
    if (Koth.open) {
        if (Koth.get(usr) === -1) {
            Koth.add(usr);
            client.say(target, `${usr} has been added to the queue at position ${Koth.get(usr)}.`);
        } else {
            client.say(target, `${usr} is already in the queue at position ${Koth.get(usr)}.`);
        }
    }
    else{

        client.say(target, `The list is currently closed.`);
    }
};

let challengeCom = new Command(
    'challenge',
    `Use '!challenge' to add yourself to the queue!`,
    challengeHandle);

let dropspotHandle = async (args, target, client, usr)=> {
    usr = atHandle(usr);
    if(Koth.get(usr) === -1) {
        client.say(target, `Cannot drop ${usr} as they are not in queue.`);
    }
    else{
        Koth.remove(usr);
        client.say(target, `${usr} has left the queue.`);
    }
};

let dropspotCom = new Command(
    'dropspot',
    `Use '!dropspot' to remove yourself from the queue`,
    dropspotHandle);

let spotHandle = async (args, target, client, usr)=> {
    if(args.length === 1){
        usr = args[0]
    }
    usr = atHandle(usr);
    const spot = Koth.get(usr);
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
    client.say(target, msg);
};

let spotCom = new Command(
    'spot',
    `Use '!spot' to find your place in the queue`,
    spotHandle);


let idHandle = async (args, target, client, usr)=> {
    client.say(target, `The Arena ID is ${Koth.aid}.`)
};

let idCom = new Command(
    'arenaid',
    `Use '!arenaid' to find the arena id!`,
    idHandle);

let idHandle2 = async (args, target, client, usr)=> {
    client.say(target, `The Arena 2 ID is ${Koth.aid2}.`)
};
//TODO refactor arenaid2 and 3
let idCom2 = new Command(
    'arenaid2',
    `Use '!arenaid2' to find the arena id 2!`,
    idHandle2);

let idHandle3 = async (args, target, client, usr)=> {
    client.say(target, `The Arena 3 ID is ${Koth.aid3}.`)
};

let idCom3 = new Command(
    'arenaid3',
    `Use '!arenaid3' to find the arena id 3!`,
    idHandle3);

let topHandle = async (args, target, client, usr)=> {
    let tops = await topRank(5);
    let msg = `The Top 5 is: `;
    let i = 0;
    for(let i = 0; i < tops.length; i ++){
        msg += `${i+1}. ${tops[i].tName}(${tops[i].rating}), `;
    }
    msg = msg.substring(0, msg.length-2);
    client.say(target, msg);
};

let topCom = new Command(
    'top',
    `Use '!top to see the top 5 players`,
    topHandle);

let kingHandle = async (args, target, client, usr)=> {
    let msg = "The king has used : ";
    msg = msg.concat(Koth.chars().join(","))
    client.say(target, msg);
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