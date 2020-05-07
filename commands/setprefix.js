const prefixes = require("../prefixes.json");
const fs = require("fs");
const Discord = require("discord.js");

module.exports = {
    name: 'setprefix',
    description: "Sets the prefix for the bot within your server.",
    category: "utils",
    aliases: ["sp"],
    cooldown: 10,
    args: true,
    usage: "<new prefix>",
    guildOnly: true,
    execute(message, args) {
        if (message.author.id == message.guild.ownerID || message.member.hasPermission("ADMINISTRATOR")) {
            let id = message.guild.id;

            prefixes[id] = {
                prefix: args[0]
            };

            fs.writeFile("./prefixes.json", JSON.stringify(prefixes), (err) => {
                if (err) console.log(err);
            });

            const embed = new Discord.MessageEmbed()
                .setTimestamp()
                .setAuthor("Simply Tickets", "https://munch42.github.io/img/SimpleTicketsImage.jpg")
                .setDescription(`Server prefix set to: ${args[0]}`)
                .setFooter("Prefixes made easy!")
                .setColor("#e68525");

            message.channel.send(embed);
        } else {
            const embed = new Discord.MessageEmbed()
                .setTimestamp()
                .setAuthor("Simply Tickets", "https://munch42.github.io/img/SimpleTicketsImage.jpg")
                .setDescription(`You must be an administrator or the guild owner to set my prefix!`)
                .setFooter("Incorrect permissions can come back to bite you!")
                .setColor("#e68525");

            message.channel.send(embed);
        }
    },
};