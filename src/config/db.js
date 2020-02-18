const { Pool } = require("pg");

module.exports = new Pool({
  user: 'postgres',
  password: "0814",
  host: "localhost",
  port: 5432,
  database: "myteacher"
});