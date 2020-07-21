const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (err, req, res, next) => {
	console.log(err.message);
	if (err.name === "ValidationError")
		return res.status(400).send({ error: err.message });
	next(err);
};

module.exports = { unknownEndpoint, errorHandler };
