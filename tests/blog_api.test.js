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

describe("when there is initially some notes saved ", () => {
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
});

describe("addition of a new blog", () => {
	test("that making an HTTP POST request to the /api/blogs url successfully creates a new blog post", async () => {
		const newBloglist = {
			title: "Cloud is just someone's server",
			author: "movbe",
			uri: "somexample.com",
			likes: 21,
		};
		await api
			.post("/api/blogs")
			.send(newBloglist)
			.expect(201)
			.expect("Content-Type", /application\/json/);
		const { body } = await api.get("/api/blogs");
		const newResponseTitle = body[initialBlogs.length]["title"];

		expect(body.length).toBe(initialBlogs.length + 1);
		expect(newResponseTitle).toBe(newBloglist.title);
	});

	test("that if the likes property is missing from the request, it will default to the value 0", async () => {
		const {
			body: [blogWithoutLike, ..._rest],
		} = await api.get("/api/blogs");
		expect(blogWithoutLike.likes).toBe(0);
	});

	test(" that if the title and url properties are missing from the request data, the backend responds to the request with the status code 400 Bad Request", async () => {
		await api.post("/api/blogs").send({}).expect(400);
	});
});

describe("deletion of a blog", () => {
	test("succeeds with a status of 204 if id is valid", async () => {
		const { body } = await api.get("/api/blogs");
		await api.delete(`/api/blogs/${body[0].id}`).expect(204);
		const blogsAfterDeleting = await api.get("/api/blogs");
		expect(blogsAfterDeleting.body.length).toBe(body.length - 1);
	});
});

afterAll(() => mongoose.connection.close());
