import { addUser, rating, updateUser, ratingAdd, rank} from "./database";
import {atHandle} from "./helpers";

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

function baseHandle(args, target, client, usr) {
    client.say(target, 'Works');
}

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
        client.say(target, CommandList[args[0]].help)
    }
    else if(args.length === 0){
        client.say(target, helpCom.help)
    }
    else{
        client.say(target, `use '!help' or '!help command' to get help.`)
    }
};

let helpCom = new Command(
    'help',
    `use '!help command' to get help or a specific command or visit https://pastebin.com/MN7KQ3mH to find out more.`,
    help
);

let rankHandle =  async (args, target, client, usr)=>{
    let msg = `rank expects either '!rank' to find your rank or '!rank @username' to find another's rank`;
    if(args.length > 1){

        client.say(target, msg);
        return
    }
    if(args.length === 1){
        usr = atHandle(args[0]);
    }
    const usr_r = await rating(usr);
    const usr_rank = await rank(usr);
    if(usr_r !== null && usr_rank !== null){
        msg = `${usr}'s rank is ${usr_rank}(${usr_r})`;
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
export let CommandList = {
    'base' : baseCom,
    'rating' : ratingCom,
    'help' : helpCom,
    'rank' : rankCom
};