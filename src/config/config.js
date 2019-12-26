module.exports = {
    development: {
        host: '0.0.0.0',
        dialect: 'sqlite',
        pool: {
            max: 5,
            min: 0,
            idle: 10000
        },
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        // Security note: the database is saved to the file `database.sqlite` on the local filesystem. It's deliberately placed in the `.data` directory
        // which doesn't get copied if someone remixes the project.
        storage: '.data/' + process.env.NODE_ENV + 'EloDB.sqlite'
    },
    test: {
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        dialect: "sqlite",
        storage: ":memory:"
    },
    production: {
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        host: process.env.DB_HOSTNAME,
        dialect: 'postgres',
        use_env_variable: 'DATABASE_URL'
    }
};