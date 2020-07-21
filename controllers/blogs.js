const blogsRouter = require("express").Router();
const Blog = require("../models/blog");

blogsRouter.get("/", async (request, response) => {
	const blogs = await Blog.find({}).populate("user", {
		username: 1,
		name: 1,
		_id: 1,
	});
	response.json(blogs);
});

blogsRouter.post("/", async (request, response) => {
	const blog = new Blog(request.body);
	const savedBlog = await blog.save();
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
