require("dotenv").config();
const { Client } = require("pg");

const client = new Client({
  connectionString: process.env.DIRECT_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

client.connect()
  .then(() => {
    console.log("✅ DIRECT_URL PostgreSQL connection SUCCESSFUL");
    return client.query("SELECT NOW()");
  })
  .then(result => {
    console.log("Database time:", result.rows[0]);
    return client.end();
  })
  .catch(error => {
    console.error("❌ DIRECT_URL connection FAILED");
    console.error("Code:", error.code);
    console.error("Message:", error.message);
    client.end();
  });