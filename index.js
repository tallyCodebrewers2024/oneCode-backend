import express from "express";

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.listen(8800, () => {
  console.log("Listening on Port 8800!");
});
