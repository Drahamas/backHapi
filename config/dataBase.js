const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    // host: process.env.HOST_DB, 
    // user: process.env.USER_DB, 
    // password: process.env.PASS_DB, 
    // database: process.env.NAME_DB,
    // max: 20, 
    // idleTimeoutMillis: 30000,
    // connectionTimeoutMillis: 2000
    host: '34.139.234.178',
    user: 'postgres',
    password: 'Dg1037637170*',
    database: 'sprint_backend_2',
    port: 5432

})

module.exports = { pool }