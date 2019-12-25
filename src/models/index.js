import fs from 'fs';
import path from 'path'
import Sequelize from "sequelize";
import sheroku from 'sequelize-heroku'
let dbName, dbUser, dbPass, options, sequelize;
dbUser = process.env.DB_USER;
dbPass = process.env.DB_PASS;
if(process.env.DB_URL) {
    options = {
        dialect:  'postgres',
        protocol: 'postgres'
    };
    sequelize = new Sequelize(process.env.DB_URL, options);
}
else {

    dbName = 'EloDB';
    options = {
        host: '0.0.0.0',
        dialect: 'sqlite',
        pool: {
            max: 5,
            min: 0,
            idle: 10000
        },
        // Security note: the database is saved to the file `database.sqlite` on the local filesystem. It's deliberately placed in the `.data` directory
        // which doesn't get copied if someone remixes the project.
        storage: '.data/' + process.env.NODE_ENV + 'EloDB.sqlite'
    };

    sequelize = new Sequelize(dbName, dbUser, dbPass, options);
}
const basename = path.basename(module.filename);
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
db['User'].sync();
db['Match'].sync();
module.exports = db;