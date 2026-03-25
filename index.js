const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./app/configs/dbConnect");

dotenv.config();
connectDB("irtc_DB");

const app = express();
app.use(express.json());

// IMPORTANT: import router file
const router = require("./app/router/router");

app.use(router);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});