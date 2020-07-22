const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const getTokenFrom = (req) => {
	const auth = req.get("authorization");
	const token =
		auth && auth.toLowerCase().startsWith("bearer ") && auth.substring(7);
	return token;
};

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
	const token = getTokenFrom(request);
	const decodedToken = token && (await jwt.verify(token, process.env.SECRET));
	if (!decodedToken.id)
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
	await Blog.findByIdAndRemove(req.params.id);
	res.status(204).end();
});
blogsRouter.put("/:id", async (req, res) => {
	const {
		body: { likes },
		params: { id },
	} = req;

	const updatedList = await Blog.findByIdAndUpdate(
		id,
		{ likes },
		{ new: true }
	);
	res.json(updatedList);
});

module.exports = blogsRouter;
