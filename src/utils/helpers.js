import {CommandList} from "./commands.js";
import { addUser, rating, updateUser, ratingAdd, addMatch} from "./database";
import EloRank from 'elo-rank';
let elo = new EloRank();
import {JettCommands, ModCommandList} from "./modCommands";

export function atHandle(name){
    // name = name.toLowerCase();
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

export let score_match = async(winner, loser, target) => {
    // Set expected values if either party won
    let w_rating = await ratingAdd(winner, target);
    let l_rating = await ratingAdd(loser, target);
    let es_w = elo.getExpected(w_rating, l_rating);
    let es_l = elo.getExpected(l_rating, w_rating);
    // Get new actual values
    let new_w_r = elo.updateRating(es_w, 1, w_rating);
    let new_l_r = elo.updateRating(es_l, 0, l_rating);
    const w_rc = new_w_r-w_rating;
    const l_rc = l_rating - new_l_r;
    // Update users
    let wup = await updateUser(winner, new_w_r, target);
    let lup = await updateUser(loser, new_l_r, target);
    let match = await addMatch(winner, loser,
        new_w_r, new_l_r, w_rc, l_rc, target);
    // await Promise.all([wup, lup, match]);
    let ret = {
        'w_r' : new_w_r,
        'l_r' : new_l_r,
        'win_r_c': w_rc,
        'lose_r_c' : l_rc
    };
    return ret

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
