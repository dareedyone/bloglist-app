const User = require("../models/user");
const supertest = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");
const api = supertest(app);

beforeAll(async () => {
	await User.deleteMany({});
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
		const invalidUser = { username: "ab", name: "tester" };
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
});
afterAll(async () => {
	mongoose.connection.close();
});
