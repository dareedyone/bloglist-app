const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

blogsRouter.get("/", async (request, response) => {
	const blogs = await Blog.find({}).populate("user", {
		username: 1,
		name: 1,
		_id: 1,
	});
	response.json(blogs);
});

blogsRouter.post("/", async (request, response) => {
	const { title, author, url, likes } = request.body;
	//got token through tokenExtractor middleware
	const { token } = request;
	const decodedToken = token && (await jwt.verify(token, process.env.SECRET));

	if (!decodedToken?.id)
		return response.status(401).json({ error: "token missing or invalid" });
	const user = await User.findById(decodedToken.id);
	const blog = new Blog({
		title,
		author,
		url,
		likes,
		user: user._id,
	});
	const savedBlog = await blog.save();
	user.blogs = user.blogs.concat(savedBlog._id);
	await user.save();
	response.status(201).json(savedBlog);
});

blogsRouter.delete("/:id", async (req, res) => {
	const { token } = req;

	const decodedToken = token && (await jwt.verify(token, process.env.SECRET));
	const blog = await Blog.findById(req.params.id);
	if (
		!decodedToken.id ||
		decodedToken?.id?.toString() !== blog?.user?.toString()
	) {
		return res.status(401).send({ error: "You are not authorized!" });
	}

	await Blog.findByIdAndRemove(req.params.id);
	res.status(204).end();
});
blogsRouter.put("/:id", async (req, res) => {
	const {
		body,
		params: { id },
	} = req;
	const { likes } = body;
	if (!likes) {
		return res.status(400).send({ error: "Invalid request" });
	}

	const updatedList = await Blog.findByIdAndUpdate(
		id,
		{ likes },
		{ new: true }
	);
	res.json(updatedList);
});

module.exports = blogsRouter;
