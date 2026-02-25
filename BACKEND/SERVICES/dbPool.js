require("dotenv").config({ path: "../.env" });
const {Pool } = require('pg');

const pool = new Pool({
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    database: process.env.DB_NAME,
    user: process.env.DB_ADMIN,
    password: process.env.DB_PASSWORD,
    ssl: false, // je retire la connexion SSL
});


module.exports = pool;
