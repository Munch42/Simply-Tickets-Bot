const Discord = require("discord.js");

module.exports = {
	name: 'avatar',
	description: 'Sends you your avatar picture link.',
	aliases: ["icon", "pfp"],
	category: "utils",
	execute(message, args) {
		if (!message.mentions.users.size) {
			let embed = new Discord.MessageEmbed()
				.setTimestamp()
				.setTitle(`${message.author.username}'s Avatar Image`)
				.setAuthor("Simply Tickets", "https://munch42.github.io/img/SimpleTicketsImage.jpg")
				.setColor("#e68525")
				.addField("Avatar Link:", `${message.author.displayAvatarURL()}`)
				.setImage(message.author.displayAvatarURL());

			return message.channel.send(embed);
		}

		const avatarList = message.mentions.users.map(user => {
			let embed = new Discord.MessageEmbed()
				.setTimestamp()
				.setTitle(`${user.username}'s Avatar Image`)
				.setAuthor("Simply Tickets", "https://munch42.github.io/img/SimpleTicketsImage.jpg")
				.setColor("#e68525")
				.addField("Avatar Link:", `${user.displayAvatarURL()}`)
				.setImage(user.displayAvatarURL());

			return embed;
		});

		// send the entire array of strings as a message
		// by default, discord.js will `.join()` the array with `\n`
		for (i = 0; i < avatarList.length; i++) {
			message.channel.send(avatarList[i]);
		}
	},
};