const testingRouter = require("express").Router();
const User = require("../models/user");
const Blog = require("../models/blog");
testingRouter.post("/reset", async (req, res) => {
	console.log("enter testing route post");
	await User.deleteMany({});
	await Blog.deleteMany({});
	res.status(204).end();
});

module.exports = testingRouter;
