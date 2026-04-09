const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./app/configs/dbConnect");

dotenv.config();
connectDB("irtc_DB");

const app = express();
app.use(cors({
  origin: 'https://bala-119.github.io',
  credentials: true
}));
app.use(express.json());

// IMPORTANT: import router file
const router = require("./app/router/router");

app.use(router);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});