const express = require("express");
const User = require("./models/user");
const { connectToMongoDB } = require("./db.js");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api", require("./routes/index"));

app.listen(5050, () => {
  console.log("Listening on Port 5050!");
});
