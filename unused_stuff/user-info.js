module.exports = {
	name: 'user-info',
	description: 'Gets you user info!',
	category: "utils",
	execute(message, args) {
		message.channel.send(`Your username: ${message.author.username}\nYour ID: ${message.author.id}\nYour discriminator: ${message.author.discriminator}`);
	},
};