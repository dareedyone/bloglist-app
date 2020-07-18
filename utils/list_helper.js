const dummy = (_blogs) => 1;
const totalLikes = (blogs) => blogs.reduce((sum, obj) => sum + obj.likes, 0);

const favoriteBlog = (blogs) =>
	blogs.find(
		(obj) => obj.likes === Math.max(...blogs.map((blog) => blog.likes))
	);
const mostBlogs = (blogs) => {
	const uniqueAuthors = {};

	for (let i = 0; i < blogs.length; i++) {
		uniqueAuthors[blogs[i].author]
			? (uniqueAuthors[blogs[i].author].blogs += 1)
			: (uniqueAuthors[blogs[i].author] = {
					author: blogs[i].author,
					blogs: 1,
			  });
	}

	const sortedAuthors = Object.values(uniqueAuthors);
	return sortedAuthors.length > 0
		? sortedAuthors.find(
				(obj) =>
					obj.blogs === Math.max(...sortedAuthors.map((obj) => obj.blogs))
		  )
		: undefined;
};

const mostLikes = (blogs) => {
	const uniqueAuthors = {};

	for (let i = 0; i < blogs.length; i++) {
		uniqueAuthors[blogs[i].author]
			? (uniqueAuthors[blogs[i].author].likes += blogs[i].likes)
			: (uniqueAuthors[blogs[i].author] = {
					author: blogs[i].author,
					likes: blogs[i].likes,
			  });
	}

	const sortedAuthors = Object.values(uniqueAuthors);
	return sortedAuthors.length > 0
		? sortedAuthors.find(
				(obj) =>
					obj.likes === Math.max(...sortedAuthors.map((obj) => obj.likes))
		  )
		: undefined;
};

module.exports = { totalLikes, favoriteBlog, mostBlogs, mostLikes, dummy };
