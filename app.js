const { MONGODB_URI } = require("./utils/config");
const { unknownEndpoint } = require("./utils/middleware");
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");

const blogsRouter = require("./controllers/blogs");
const { error, info } = require("./utils/logger");

info("connecting to", MONGODB_URI);
mongoose
	// eslint-disable-next-line no-undef
	.connect(process.env.MONGODB_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => info("CONNECTED TO MONGODB"))
	.catch((err) => error(`database err: ${err} `));

app.use(cors());
app.use(express.json());
app.use("/api/blogs", blogsRouter);
app.use(unknownEndpoint);

module.exports = app;
