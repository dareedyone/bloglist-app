const mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);

const blogSchema = new mongoose.Schema({
	title: { type: String, required: true },
	author: { type: String, required: true },
	url: String,
	likes: { type: Number, default: 0 },
	user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

blogSchema.set("toJSON", {
	transform: (document, returnedObj) => {
		returnedObj.id = returnedObj._id.toString();
		delete returnedObj._id;
		delete returnedObj.__v;
	},
});
const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;
