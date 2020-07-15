// eslint-disable-next-line no-unused-vars
const dummy = (blogs) => 1;

const totalLikes = (blogs) => {
	return blogs.reduce((sum, obj) => sum + obj.likes, 0);
};

module.exports = { dummy, totalLikes };
