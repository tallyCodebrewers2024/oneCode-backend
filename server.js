const dotenv = require("dotenv");
const http = require("http");

dotenv.config({
  path: "./.env",
});

const { connectToMongoDB } = require("./db.js");
const app = require("./app");

let server;

connectToMongoDB()
  .then(() => {
    const h_server = http.createServer(app);
    server = h_server.listen(process.env.PORT || 5050, () => {
      console.log(`⚙️  Listening on Port: ${process.env.PORT || 5050}`);
    });
  })
  .catch((error) => {
    console.log("MongoDB connection failed! ", error);
  });

const exitHandler = () => {
  if (server) {
    server.close(() => {
      console.log("Server closed");
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  console.log(error);
  exitHandler();
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);
process.on("SIGTERM", () => {
  console.log("SIGTERM received");
  if (server) {
    server.close();
  }
});

module.exports = server;
