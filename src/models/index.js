import fs from 'fs';
import path from 'path'
import Sequelize from "sequelize";
const dbName = 'EloDB';
const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASS;
const options = {

        host: '0.0.0.0',
        protocol: 'postgres',

        dialect: 'postgres',
        pool: {
        max: 5,
            min: 0,
            idle: 10000
    },
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