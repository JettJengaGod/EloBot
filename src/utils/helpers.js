import {Command, CommandList} from "./commands.js";
import { addUser, rating, updateUser, ratingAdd, addMatch} from "./database";
let models = require('../models');
let EloRank = require('elo-rank');
let elo = new EloRank();
import {king_chal} from "../bot_rewrite";

export function atHandle(name){
    if (name.startsWith('@')) {
        name = name.substring(1);
        return name;
    } else {
        return name;
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
    if(msg.startsWith(': The King ')){
        await bot_match(msg.substr(msg.indexOf('g')+2), target, client, king, challenger );
    }
    else if(msg.startsWith('Current King')|| msg.startsWith('King:')){
        parseKingandChal(msg);
    }
};

export let parseChal = (msg) => {
    const postIndex = msg.indexOf('@', msg.indexOf('@') + 1);
    if(postIndex>0)
        return msg.substring(postIndex + 1, msg.indexOf(' ', postIndex+1));
    else
        return 'default c'
};
export let parseKingandChal = (msg) => {
    if(msg.includes('The KotH line is empty.')){
        king_chal();
        return
    }
    const kingIndex = msg.indexOf('@');
    const king = msg.substring(kingIndex + 1, msg.indexOf('.', kingIndex+1));
    if(msg.includes('There are no challengers at the moment.')) {
        king_chal(king);
        return
    }
    const postIndex = msg.indexOf(':', msg.indexOf(':') + 2);
    let chal;
    if(msg.includes(',', postIndex)){
        const subend = msg.indexOf(',', postIndex);
        chal = msg.substring(postIndex+2, subend)
    }
    else{
        chal = msg.substring(postIndex+2)
    }
    king_chal(king, chal);
};

let score_match = async(winner, loser, target, client) => {
    // Set expected values if either party won
    let es_w = elo.getExpected(winner.rating, loser.rating);
    let es_l = elo.getExpected(loser.rating, loser.rating);
    // Get new actual values
    let new_w_r = elo.updateRating(es_w, 1, winner.rating);
    let new_l_r = elo.updateRating(es_l, 0, loser.rating);
    // Update users
    let wup = updateUser(winner.name, new_w_r);
    let lup = updateUser(loser.name, new_l_r);
    let match = addMatch(winner.name, loser.name,
        new_w_r, new_l_r, new_w_r-winner.rating, loser.rating -new_l_r)
    await Promise.all([wup, lup, match]);
    let ret = `${winner.name} ${new_w_r}(+${new_w_r-winner.rating})
     ${loser.name} ${new_l_r}(-${loser.rating-new_l_r})`;
    client.say(target, ret);

};

let bot_match = async(msg, target, client, king, challenger) => {
    let kingR = await ratingAdd(king);
    let kingUser = {
        name : king,
        rating : kingR
    };
    let chalR = await ratingAdd(challenger);
    let chalUser = {
        name : challenger,
        rating : chalR
    };
    let loser;
    let winner;
    if(msg.startsWith('falls')){
        loser = kingUser;
        winner = chalUser;
    }
    else if(msg.startsWith('wins')){
        winner = kingUser;
        loser = chalUser;
    }

    king_chal(winner.name, parseChal(msg));

    await(score_match(winner, loser, target, client));

};
export const handle_command = async(command, args, target, client, mod, usr) => {
    if(command in CommandList) {
        await CommandList[command].handle(args, target, client, usr);
    }
    // else if(command in mod_commands && mod) {
    //     commands[command](args, target, client);
    // }
};
