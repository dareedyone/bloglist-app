const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (err, req, res, next) => {
	console.log(err.message);
	if (err.name === "ValidationError")
		return res.status(400).send({ error: err.message });

	if (err.name === "JsonWebTokenError")
		return res.status(401).json({
			error: "invalid token",
		});

	next(err);
};

const tokenExtractor = (req, res, next) => {
	const auth = req.get("authorization");
	const token =
		auth && auth.toLowerCase().startsWith("bearer ") && auth.substring(7);
	req.token = token;
	next();
};

module.exports = { unknownEndpoint, errorHandler, tokenExtractor };
