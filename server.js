const express = require("express");
const { requireSession } = require("@clerk/clerk-sdk-node");
const User = require("./models/user");
const { connectToMongoDB } = require("./db.js");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api", require("./routes/index"));

app.post("/webhook/clerk", async (req, res) => {
  try {
    await connectToMongoDB();
    const event = req.body;

    if (event.type === "user.created") {
      const { id, email } = event.data;

      // Save user to MongoDB
      const user = new User({ clerkUserId: id, email });
      await user.save();
    }

    res.status(200).send("OK");
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(500).send("Error");
  }
});

app.listen(5050, () => {
  console.log("Listening on Port 5050!");
});
