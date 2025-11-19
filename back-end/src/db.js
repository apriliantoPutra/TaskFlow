const {Pool}= require("pg");
const { connectionString, ssl } = require("pg/lib/defaults");
require("dotenv").config();

const pool= new Pool({
    connectionString: process.env.DB_URL,
    ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,

});

module.exports= pool;