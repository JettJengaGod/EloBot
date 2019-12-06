const { User } = require('../models');


export const addUser = async( name ) => {
    const user = await lookup(name);
    if (user) {
        console.log('Tried to create a duplicate user', name);
        return user;
    }
    return await User.create({ tName: name, rating: process.env.DEFAULT_RATING});


};

export let rating = async ( name ) => {
    const user = await lookup(name);
    if (user) return user.rating;
    return null;
};

let lookup = async( name ) => {
    return await User.findOne({ where: { tName: name } });
};

export const updateUser = async ( name, rating ) => {
    const user = await lookup(name);
    if (user) return await user.update('rating', rating);
    return null
};
