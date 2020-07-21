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
});
describe("get request to users route", () => {
	test("that it returns all users available", async () => {
		await api
			.get("/api/users")
			.expect(200)
			.expect("Content-Type", /application\/json/);
	});
});
afterAll(async () => {
	mongoose.connection.close();
});
