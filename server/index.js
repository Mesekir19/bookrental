const express = require("express");
const app = express();
const { sequelize } = require("./models");
const book = require("./routes/bookRoutes");
const userRoutes = require("./routes/userRoutes");
const rent = require("./routes/rentRoutes");

const cors = require("cors");
require("dotenv").config();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({ origin: "http://localhost:3000" }));
app.use("/api/books", book);
app.use("/api/users", userRoutes);
app.use("/api/rent", rent);

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  await sequelize.authenticate();
  console.log("Database connected!");
});
