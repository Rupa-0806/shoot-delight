require("dotenv").config();
const app = require("./app");

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Shoot Delight API listening on port ${PORT} [${process.env.NODE_ENV || "development"}]`);
});

// Graceful shutdown
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  server.close(() => process.exit(1));
});
