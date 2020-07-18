const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const Blog = require("../models/blog");

const initialBlogs = [
	{
		title: "React patterns",
		author: "Michael Chan",
		url: "https://reactpatterns.com/",
		likes: 7,
	},
	{
		title: "Go To Statement Considered Harmful",
		author: "Edsger W. Dijkstra",
		url:
			"http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
		likes: 5,
	},
	{
		title: "Canonical string reduction",
		author: "Edsger W. Dijkstra",
		url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
		likes: 12,
	},
];

beforeEach(async () => {
	await Blog.deleteMany({});
	console.log("db cleared");
	const blogsToBeSaved = initialBlogs.map((blog) => new Blog(blog));
	const promises = blogsToBeSaved.map((blog) => blog.save());
	await Promise.all([promises]);
	console.log("blogs added");
});

test("returns the correct amount of blog posts in the JSON format", async () => {
	console.log("enter test");
	const response = await api
		.get("/api/blogs")
		.expect(200)
		.expect("Content-Type", /application\/json/);
	const blogs = response.body;
	expect(blogs).toHaveLength(initialBlogs.length);
});

test("that the unique identifier property of the blog posts is named id", async () => {
	const { body } = await api.get("/api/blogs");
	const firstBlogId = body[0].id;
	expect(firstBlogId).toBeDefined();
});

afterAll(() => mongoose.connection.close());
