// eslint-disable-next-line no-unused-vars
const dummy = (blogs) => 1;

const totalLikes = (blogs) => {
	return blogs.reduce((sum, obj) => sum + obj.likes, 0);
};
const favoriteBlog = (blogs) => {
	return blogs.find(
		(obj) => obj.likes === Math.max(...blogs.map((blog) => blog.likes))
	);
};

module.exports = { dummy, totalLikes, favoriteBlog };
