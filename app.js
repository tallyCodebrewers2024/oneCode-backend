const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", (req, res) => res.send("Hello World!"));

app.use("/api", require("./routes/index"));

module.exports = app;
