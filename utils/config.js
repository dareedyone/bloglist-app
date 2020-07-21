require("dotenv").config();
let { MONGODB_URI, PORT, TEST_MONGODB_URI, NODE_ENV } = process.env;

if (NODE_ENV === "test" || NODE_ENV === "development")
	MONGODB_URI = TEST_MONGODB_URI;

module.exports = { MONGODB_URI, PORT };
