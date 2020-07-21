const mongoose = require("mongoose");
const mongooseUniqueValidator = require("mongoose-unique-validator");

const userSchema = new mongoose.Schema({
	username: { type: String, required: true, minlength: 3, unique: true },
	name: String,
	passwordHash: { type: String, required: true, minlength: 3 },
});

userSchema.plugin(mongooseUniqueValidator);

userSchema.set("toJSON", {
	transform: (document, returnedObj) => {
		returnedObj.id = returnedObj._id.toString();
		delete returnedObj._id;
		delete returnedObj.__v;
		delete returnedObj.passwordHash;
	},
});

const User = mongoose.model("User", userSchema);

module.exports = User;
