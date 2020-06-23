import {CommandList} from "./commands.js";
import { addUser, rating, updateUser, ratingAdd, addMatch} from "./database";
import EloRank from 'elo-rank';
let elo = new EloRank();
import {king_chal} from "../bot_rewrite";
import {JettCommands, ModCommandList} from "./modCommands";

export function atHandle(name){
    name = name.toLowerCase();
    if(name.endsWith(',')){
        name = name.substring(0, name.length-1)
    }
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

export let score_match = async(winner, loser) => {
    // Set expected values if either party won
    let w_rating = await ratingAdd(winner);
    let l_rating = await ratingAdd(loser);
    let es_w = elo.getExpected(w_rating, l_rating);
    let es_l = elo.getExpected(l_rating, w_rating);
    // Get new actual values
    let new_w_r = elo.updateRating(es_w, 1, w_rating);
    let new_l_r = elo.updateRating(es_l, 0, l_rating);
    const w_rc = new_w_r-w_rating;
    const l_rc = l_rating - new_l_r;
    // Update users
    let wup = updateUser(winner, new_w_r);
    let lup = updateUser(loser, new_l_r);
    let match = addMatch(winner, loser,
        new_w_r, new_l_r, w_rc, l_rc);
    await Promise.all([wup, lup, match]);
    let ret = {
        'w_r' : new_w_r,
        'l_r' : new_l_r,
        'win_r_c': w_rc,
        'lose_r_c' : l_rc
    };
    return ret

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
    let resp = "";
    if(command in ModCommandList && mod) {
        resp = await ModCommandList[command].handle(args, target, usr);
    }
    else if(command in CommandList) {
        resp = await CommandList[command].handle(args, target, usr);
    }
    else if(command in JettCommands && (usr === 'alexjett' || usr === 't5ace')){
        resp = await JettCommands[command].handle(args, target, usr);
    }
    if(resp) {
        client.say(target, resp);
    }
};
