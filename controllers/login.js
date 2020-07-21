const User = require("../models/user");

const loginRouter = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

loginRouter.post("/", async (req, res) => {
	const { username, password } = req.body;
	const user = await User.findOne({ username });

	const paswordValid =
		user && (await bcrypt.compare(password, user.passwordHash));
	if (!paswordValid) return res.json({ error: "Invalid username or password" });
	const userForToken = {
		username: user.username,
		id: user._id,
	};
	const token = await jwt.sign(userForToken, process.env.SECRET);
	res.send({ token, username: user.username, name: user.name });
});

module.exports = loginRouter;
