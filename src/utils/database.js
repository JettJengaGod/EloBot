import { User, Match } from '../models';

import "core-js/stable";
import "regenerator-runtime/runtime";

export const addUser = async( name, stream) => {
    console.log(stream, name)
    const user = await lookup(name, stream);
    if (user) {
        console.log('Tried to create a duplicate user', name);
        return user;
    }
    return await User.create({ tName: name, rating: Number(process.env.DEFAULT_RATING), stream: stream});


};

export const addStream = async(stream) => {
    console.log(stream)
    const str = await Stream.findOne({ where: { stream : stream } });
    if (str) {
        console.log('Tried to create a duplicate user', str);
        return stream;
    }
    return await Stream.create({stream: stream});


};
export let rating = async ( name, stream ) => {
    const user = await lookup(name, stream);
    if (user) return user.rating;
    return null;
};

export let ratingAdd = async (name, stream) => {
    const user = await addUser(name, stream);
    return user.rating;
};

let lookup = async( name, stream ) => {

    console.log(stream, name)
    return await User.findOne({ where: { tName: name, stream : stream } });
};

export const updateUser = async ( name, rating, stream) => {
    console.log(stream)
    const user = await lookup(name, stream);
    if (user) {
        return await user.update({'rating': rating});
    }
    return null
};

export const addMatch = async (winner, loser, w_r, l_r, w_rc, l_rc, stream) =>{
    const w_u = await lookup(winner, stream);
    const l_u = await lookup(loser, stream);
    return await Match.create({
        winner: winner,
        winnerID : w_u.id,
        w_r: w_r,
        w_rc: w_rc,
        loser: loser,
        loserID : l_u.id,
        l_r: l_r,
        l_rc: l_rc,
        stream: stream
        }
    )
};


export const rank = async (user, stream) =>{
    let users = await User.findAll(
        {order: [
            ['rating', 'DESC']
            ]},
            {where: {stream : stream}}
        );
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

export const topRank = async (number = 0, stream) =>{
    console.log(stream);
    let users = await User.findAll(
        {where: {stream : stream}},
        {order: [
                ['rating', 'DESC']
            ]}
            );
    let ret = [];
    if(number === 0) number = users.length;
    for(let i = 0; i < number && i < users.length; i++){
        ret.push(users[i])
    }
    return ret
};

export const delUser = async (user, stream) =>{
    await User.destroy({
        where: {tName: user, stream:stream}
    })
};

export const nukeDB = async (stream) =>{
    await User.destroy({
        where: {stream:stream},
        truncate: true
    });
    await Match.destroy({
        where: {stream:stream},
        truncate: true
    })
};
export const undoLastMatch = async(stream)=>{
    const match = await(Match.findAll({
        limit: 1,
        order: [ [ 'createdAt', 'DESC' ]]
    },
        {where: {stream:stream}}
    ));
    if(match) {
        const last = match[0];
        await updateUser(last.winner, last.w_r - last.w_rc, stream);
        await updateUser(last.loser, last.l_r + last.l_rc, stream);
        await Match.destroy({
            where: {
                id : last.id,
                stream:stream
            },
            limit: 1,
            order: [['createdAt', 'DESC']]
        });
        return last;
    }
};