module.exports = {
	name: 'server',
	description: 'Gets you server info!',
	guildOnly: true,
	category: "utils",
	execute(message, args) {
		message.channel.send(`This server's name is: ${message.guild.name}\nTotal Members: ${message.guild.memberCount}\nCreated on: ${message.guild.createdAt}\nRegion: ${message.guild.region}`);
	},
};