const mongoose = require("mongoose");

const connectToMongoDB = async () => {
	try {
		const uri = process.env.MONGODB_URI;
		if (!uri) {
			throw new Error(
				"MONGODB_URI is not defined in environment variables"
			);
		}
		console.log(`Connecting to MongoDB at ${uri}`);
		await mongoose.connect(uri, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		console.log("Connected to MongoDB!");
	} catch (error) {
		console.log("MONGODB connection FAILED ", error);
		process.exit(1);
	}
};

module.exports = { connectToMongoDB };
