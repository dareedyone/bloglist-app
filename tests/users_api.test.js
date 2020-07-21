const User = require("../models/user");
const supertest = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");
const Blog = require("../models/blog");
const api = supertest(app);

beforeEach(async () => {
	await User.deleteMany({});
	const user = new User({
		username: "root",
		name: "Super User",
		passwordHash: "daemon",
	});
	await user.save();
});
describe("post request to users route", () => {
	test("that it saves correctly and return with right status code ", async () => {
		const newUser = {
			username: "earlybird",
			name: "first 15percents",
			password: "leader",
		};

		await api
			.post("/api/users")
			.send(newUser)
			.expect(201)
			.expect("Content-Type", /application\/json/);
	});

	test("that invalid users are not created and invalid add user operation returns a suitable status code and error message", async () => {
		const invalidUser = {
			username: "root",
			name: "tester",
			password: "w",
		};
		const errMessage = await api
			.post("/api/users")
			.send(invalidUser)
			.expect(400);
		expect(errMessage.body.error).toMatch(/User validation failed/i);
	});
});
describe("get request to users route", () => {
	test("that it returns all users available", async () => {
		await api
			.get("/api/users")
			.expect(200)
			.expect("Content-Type", /application\/json/);
		// console.log(body);
	});
	test("that each user contain information about each blogs", async () => {
		const newUser = {
			username: "amebo",
			name: "saliu elenugboro",
			password: "knownot",
		};
		const { body: savedNewUser } = await api
			.post("/api/users")
			.send(newUser)
			.expect(201)
			.expect("Content-Type", /application\/json/);

		const newUserBlog = {
			title: "kayefi",
			url: "kayefi.com",
			likes: 2,
			author: "alawiye",
			user: savedNewUser.id,
		};
		const savedBlog = await new Blog(newUserBlog).save();
		const user = await User.findById(savedNewUser.id);
		user.blogs = user.blogs.concat(savedBlog._id);
		await user.save();
		const { body: allUsers } = await api.get("/api/users");
		const userBlogAuthor = allUsers.map(({ blogs }) => blogs[0]?.author);
		expect(userBlogAuthor).toContain(newUserBlog.author);
	});
});
afterAll(async () => {
	mongoose.connection.close();
});
