const { MONGODB_URI } = require("./utils/config");
const { unknownEndpoint, errorHandler } = require("./utils/middleware");
const express = require("express");
require("express-async-errors");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");

const blogsRouter = require("./controllers/blogs");
const { error, info } = require("./utils/logger");
const usersRouter = require("./controllers/users");

info("connecting to", MONGODB_URI);
mongoose
	.connect(MONGODB_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => info("CONNECTED TO MONGODB"))
	.catch((err) => error(`database err: ${err.message} `));

app.use(cors());
app.use(express.json());
app.use("/api/blogs", blogsRouter);
app.use("/api/users", usersRouter);
app.use(unknownEndpoint);
app.use(errorHandler);

module.exports = app;
