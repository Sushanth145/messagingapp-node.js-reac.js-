const pgp = require("pg-promise")();
const db = pgp("postgresql://postgres:9441984210@localhost:5432/messagingdb");

module.exports = db;
