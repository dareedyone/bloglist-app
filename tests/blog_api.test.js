const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const Blog = require("../models/blog");
const User = require("../models/user");
const bcrypt = require("bcrypt");

let token;

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
	// console.log("db cleared");
	const blogsToBeSaved = initialBlogs.map((blog) => new Blog(blog));
	const promises = blogsToBeSaved.map((blog) => blog.save());
	await Promise.all([promises]);
	// console.log("blogs added");
});

describe("when there is initially some blogs saved ", () => {
	test("returns the correct amount of blog posts in the JSON format", async () => {
		// console.log("enter test");
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

describe("Addition of a new blog", () => {
	beforeAll(async () => {
		await User.deleteMany({});
		const user = new User({
			username: "root",
			name: "Super User",
			passwordHash: await bcrypt.hash("daemon", 10),
		});

		await user.save();
		const { body: userWithToken } = await api
			.post("/api/login")
			.send({ username: "root", password: "daemon" })
			.expect(200)
			.expect("Content-Type", /application\/json/);
		token = `bearer ${userWithToken.token}`;
	});

	test("that making an HTTP POST request to the /api/blogs url successfully creates a new blog post", async () => {
		const newBloglist = {
			title: "Cloud is just someone's server",
			author: "movbe",
			uri: "somexample.com",
			likes: 21,
		};

		await api
			.post("/api/blogs")
			.set("Authorization", token)
			.send(newBloglist)
			.expect(201)
			.expect("Content-Type", /application\/json/);
		const { body: blogs } = await api.get("/api/blogs");
		const newResponseTitle = blogs[initialBlogs.length]["title"];

		expect(blogs.length).toBe(initialBlogs.length + 1);
		expect(newResponseTitle).toBe(newBloglist.title);
	});

	test("that if the likes property is missing from the request, it will default to the value 0", async () => {
		const blogWithoutLike = {
			title: "I am a blog without like",
			author: "movbe",
			uri: "somexample.com",
		};

		const { body: blog } = await api
			.post("/api/blogs")
			.set("Authorization", token)
			.send(blogWithoutLike)
			.expect(201)
			.expect("Content-Type", /application\/json/);
		expect(blog.likes).toBe(0);
	});

	test(" that if the title and url properties are missing from the request data, the backend responds to the request with the status code 400 Bad Request", async () => {
		await api
			.post("/api/blogs")
			.set("Authorization", token)
			.send({ author: "someone" })
			.expect(400);
	});

	test("that a blog contains information on the creator of the blog", async () => {
		const newBloglist = {
			title: "Cloud is just someone's server",
			author: "movbe",
			uri: "somexample.com",
			likes: 21,
		};

		await api
			.post("/api/blogs")
			.set("Authorization", token)
			.send(newBloglist)
			.expect(201)
			.expect("Content-Type", /application\/json/);
		const { body: blogs } = await api.get("/api/blogs");
		expect(blogs[3].user.username).toBe("root");
	});

	test("that adding a blog fails with proper status code 401 Unauthorized if token is not provided", async () => {
		const blog = {
			title: "Hello world",
			author: "petr",
			uri: "somexample.com",
			like: 23,
		};

		await api.post("/api/blogs").send(blog).expect(401);
	});
});

describe("deletion of a blog", () => {
	test("that deletion succeeds with a status of 204 if token is valid and its the user making the request", async () => {
		const { body: userWithToken } = await api
			.post("/api/login")
			.send({ username: "root", password: "daemon" })
			.expect(200)
			.expect("Content-Type", /application\/json/);
		token = `bearer ${userWithToken.token}`;

		const newBloglist = {
			title: "Cloud is just someone's server",
			author: "movbe",
			uri: "somexample.com",
			likes: 21,
		};

		const { body: blog } = await api
			.post("/api/blogs")
			.set("Authorization", token)
			.send(newBloglist)
			.expect(201)
			.expect("Content-Type", /application\/json/);

		await api
			.delete(`/api/blogs/${blog.id}`)
			.set("Authorization", token)
			.expect(204);
	});
});

describe("editing of a blog", () => {
	test("ensures blog get deleted, with the right status", async () => {
		const { body } = await api.get("/api/blogs");
		const blogEdited = await api
			.put(`/api/blogs/${body[0].id}`)
			.send({ likes: 100 })
			.expect(200);
		expect(body[0].likes).not.toBe(blogEdited.likes);
	});
});

afterAll(() => mongoose.connection.close());
