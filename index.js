const express = require("express");

const connectDB = require("./Database/Mongo");
require("dotenv").config();
const app = express();

const PORT = 5000;
connectDB();
if (!connectDB) {
  console.error("MongoDB URI not found in .env file");
  process.exit(1);
}
app.use(express.json());

app.listen(PORT, () => {
  console.log(`Running on Server ,${PORT}`);
});
