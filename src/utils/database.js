import { User, Match } from '../models';


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
    return await Match.create({
        winner: winner,
        w_r: w_r,
        w_rc: w_rc,
        loser: loser,
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
    return [value, users.length]
};

export const topRank = async (number) =>{
    let users = await User.findAll(
        {order: [
                ['rating', 'DESC']
            ]});
    let ret = [];
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