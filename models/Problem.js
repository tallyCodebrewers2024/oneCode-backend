const mongoose = require("mongoose");

const problemSchema = new mongoose.Schema({
	problemId: {
		type: String,
		required: true,
	},
	title: {
		type: String,
		required: true,
	},
	difficulty: {
		type: String,
		required: true,
		enum: ["Easy", "Medium", "Hard"],
	},
	tags: [
		{
			type: String,
			required: true,
		},
	],
	description: {
		type: String,
		default: "",
	},
	problemStatement: {
		type: String,
		required: true,
	},
	inputFormat: {
		type: String,
		required: true,
	},
	outputFormat: {
		type: String,
		required: true,
	},
	constraints: [
		{
			type: String,
			required: true,
		},
	],
	examples: [
		{
			input: {
				type: String,
				required: true,
			},
			output: {
				type: String,
				required: true,
			},
			explanation: {
				type: String,
				required: true,
			},
		},
	],
	testCases: [
		{
			input: {
				type: String,
				required: true,
			},
			output: {
				type: String,
				required: true,
			},
		},
	],
	solution: {
		type: String,
		required: true,
	},
	private: {
		type: Boolean,
		default: false,
	},
	author: {
		type: String,
		required: true,
	},
});

const Problem =
	mongoose.models.Problem || mongoose.model("Problem", problemSchema);
module.exports = Problem;
