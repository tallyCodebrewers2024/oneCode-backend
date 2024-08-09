const express = require("express");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/api', require("./routes/index"));

app.listen(5050, () => {
    console.log("Listening on Port 5050!");
});
