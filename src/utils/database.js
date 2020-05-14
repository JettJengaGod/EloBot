import { User, Match } from '../models';

import "core-js/stable";
import "regenerator-runtime/runtime";

export const addUser = async( name) => {
    const user = await lookup(name);
    if (user) {
        console.log('Tried to create a duplicate user', name);
        return user;
    }
    return await User.create({ tName: name, rating: Number(process.env.DEFAULT_RATING)});


};

export let rating = async ( name ) => {
    const user = await lookup(name);
    if (user) return user.rating;
    return null;
};

export let ratingAdd = async (name ) => {
    const user = await addUser(name);
    return user.rating;
};

let lookup = async( name ) => {
    return await User.findOne({ where: { tName: name } });
};

export const updateUser = async ( name, rating ) => {
    const user = await lookup(name);
    if (user) {
        return await user.update({'rating': rating});
    }
    return null
};

export const addMatch = async (winner, loser, w_r, l_r, w_rc, l_rc) =>{
    const w_u = await lookup(winner);
    const l_u = await lookup(loser);
    return await Match.create({
        winner: winner,
        winnerID : w_u.id,
        w_r: w_r,
        w_rc: w_rc,
        loser: loser,
        loserID : l_u.id,
        l_r: l_r,
        l_rc: l_rc
        }
    )
};


export const rank = async (user) =>{
    let users = await User.findAll(
        {order: [
            ['rating', 'DESC']
            ]});
    let value = null;
    for(let i = 0; i < users.length; i++){
        if(users[i].tName === user){
            value = i+1;
            break;
        }
    }
    //TODO Calculate percentile here and return like silver or smth
    return [value, users.length]
};

export const topRank = async (number = 0) =>{
    let users = await User.findAll(
        {order: [
                ['rating', 'DESC']
            ]});
    let ret = [];
    if(number === 0) number = users.length;
    for(let i = 0; i < number && i < users.length; i++){
        ret.push(users[i])
    }
    return ret
};

export const delUser = async (user) =>{
    await User.destroy({
        where: {tName: user}
    })
};

export const nukeDB = async (user) =>{
    await User.destroy({
        where: {},
        truncate: true
    });
    await Match.destroy({
        where: {},
        truncate: true
    })
};
export const undoLastMatch = async()=>{
    const match = await(Match.findAll({
        limit: 1,
        order: [ [ 'createdAt', 'DESC' ]]
    }));
    if(match) {
        const last = match[0];
        await updateUser(last.winner, last.w_r - last.w_rc);
        await updateUser(last.loser, last.l_r + last.l_rc);
        await Match.destroy({
            where: {
                id : last.id
            },
            limit: 1,
            order: [['createdAt', 'DESC']]
        });
        return last;
    }
};