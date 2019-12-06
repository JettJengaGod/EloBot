import {Command, CommandList} from "./commands.js";
import { addUser, rating, updateUser} from "./database";
let models = require('../models');

function atHandle(name){
    if (name.startsWith('@')) {
        name = name.substring(1);
        return name;
    } else {
        return false;
    }
}

function rank(args, target, client){
    console.log(args);
    let ret = "Invalid Rank command, rank takes in either nothing or '@username'";
    if(args.length === 0){
        ret = 'MyRank'
    }
    else if(args.length === 1){
        const checkee = atHandle(args[0]);
        if(checkee) {
            ret = `Rank: ${checkee}`
        }
    }
    client.say(target, ret);
}

export const handle_bot = async(msg, target, client, king, challenger) => {
    if(msg.startsWith('The King ')){
        bot_match(msg.substr(9), target, client, king, challenger );
    }
    if(command in CommandList) {
        CommandList[command](args, target, client);
    }
    else if(command in mod_commands && mod) {
        commands[command](args, target, client);
    }
    else{ //TODO Remove this after done testing
        client.say(target, 'cmd no exist');
    }
};

let bot_match = async(msg, target, client, king, challenger) => {
    let kingUser = {
        name : king,
        rating : await rating(king)
    };
    let chalUser = {
        name : challenger,
        rating : await rating(challenger)
    };
    let loser;
    let winner;
    if(msg.startsWith('falls')){
        loser = kingUser;
        winner = chalUser;
    }

};
export const handle_command = async(msg, target, client) => {
    const usr = context.username;
    const mod = (context.mod || usr === 'alexjett' || usr.toLowerCase() === 't5ace');
    if(command in CommandList) {
        CommandList[command](args, target, client);
    }
    else if(command in mod_commands && mod) {
        commands[command](args, target, client);
    }
    else{ //TODO Remove this after done testing
        client.say(target, 'cmd no exist');
    }
};
