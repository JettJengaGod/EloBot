import {CommandList} from "./commands.js";
import { addUser, rating, updateUser, ratingAdd, addMatch} from "./database";
import EloRank from 'elo-rank';
let elo = new EloRank();
import {JettCommands, ModCommandList} from "./modCommands";
import RandomOrg from "random-org";

const {GoogleSpreadsheet} = require("google-spreadsheet");
let sheet = new GoogleSpreadsheet("1nHTotuYNshncsHpkjswued5xmVdnbFpqcFINi9o6iMI");

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

export const nth = function(d) {
    if (d > 3 && d < 21) return 'th';
    switch (d % 10) {
        case 1:  return "st";
        case 2:  return "nd";
        case 3:  return "rd";
        default: return "th";
    }
}
export let auth = async() =>{
    await sheet.useApiKey(process.env.GOOGLE_API)
    await sheet.loadInfo();
}
export let character = async (player, number) =>{
    let worksheet = sheet.sheetsByIndex[0]
    let rows = await worksheet.getRows()
    let playerRow = -1
    for(let i = 0; i < rows.length; i++){
        let name = String(rows[i].Player)
        if(name.startsWith(player)){
            playerRow = i
            break;
        }
    }
    if(playerRow > -1){
        await worksheet.loadCells();
        return await worksheet.getCell(playerRow+1, number).value;

    }
    else{
        return `player not found`
    }
}