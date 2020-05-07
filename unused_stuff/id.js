module.exports = {
	name: 'id',
    description: "Gets you a players id.",
	usage: "[player]",
	category: "utils",
	execute(message, args) {
        if (!message.mentions.users.size) {
			return message.channel.send(`Your id: <${message.author.id}>`);
		}
	
		const avatarList = message.mentions.users.map(user => {
			return `${user.username}'s id: <${user.id}>`;
		});
	
		// send the entire array of strings as a message
		// by default, discord.js will `.join()` the array with `\n`
		message.channel.send(avatarList);
    },
};