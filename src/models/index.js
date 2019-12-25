import fs from 'fs';
import path from 'path'
import Sequelize from "sequelize";
let dbName, dbUser, dbPass, options, sequelize;
dbUser = process.env.DB_USER;
dbPass = process.env.DB_PASS;
const production = {
    url: process.env.DATABASE_URL,
        dialect: 'postgres',
};

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

const basename = path.basename(__filename);
const db = {};
if (process.env.DB_URL) {
    sequelize = new Sequelize(process.env.DB_URL, production);
} else {
    sequelize = new Sequelize(dbName, dbUser, dbPass, options);
}

fs
    .readdirSync(__dirname)
    .filter(file => {
        return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
    })
    .forEach(file => {
        const model = sequelize['import'](path.join(__dirname, file));
        db[model.name] = model;
    });

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;