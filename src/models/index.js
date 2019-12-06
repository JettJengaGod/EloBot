const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const dbName = 'EloDB';
const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASS;
const options = {
    host: '0.0.0.0',
        dialect: 'sqlite',
        pool: {
        max: 5,
            min: 0,
            idle: 10000
    },
    // Security note: the database is saved to the file `database.sqlite` on the local filesystem. It's deliberately placed in the `.data` directory
    // which doesn't get copied if someone remixes the project.
    storage: '.data/EloDB.sqlite'
};
const basename = path.basename(module.filename);
const sequelize = new Sequelize(dbName, dbUser, dbPass, options);
const db = { Sequelize, sequelize };
const onlyModels = file =>
    file.indexOf('.') !== 0 &&
    file !== basename &&
    file.slice(-3) === '.js';
const importModel = file => {
    const modelPath = path.join(__dirname, file);
    const model = sequelize.import(modelPath);
    db[model.name] = model
};
const associate = modelName => {
    if (typeof db[modelName].associate === 'function')
        db[modelName].associate(db)
};
fs.readdirSync(__dirname)
    .filter(onlyModels)
    .forEach(importModel);
Object.keys(db).forEach(associate);
module.exports = db;