const knex = require("knex");
require("dotenv").config();

// Database Settings
const options =
  process.env.NODE_ENV === "production"
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: true
      }
    : {
        host: "127.0.0.1",
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: "exceldatabase"
      };

module.exports = knex({
  client: "pg",
  connection: options
});