const User = require("../models/user");
const usersRouter = require("express").Router();
const bcrypt = require("bcrypt");

usersRouter.post("/", async (req, res) => {
	let { username, name, password } = req.body;
	const saltRounds = 10;
	let passwordHash = undefined;
	//to handle numbers and undefined so byscript hash dont throw errors
	if (password) {
		passwordHash =
			password && (await bcrypt.hash(password.toString(), saltRounds));
	}

	const savedUser = await new User({ username, name, passwordHash }).save();

	res.status(201).json(savedUser);
});

usersRouter.get("/", async (req, res) => {
	const users = await User.find({});
	res.json(users);
});

module.exports = usersRouter;
