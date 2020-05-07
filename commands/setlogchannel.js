const settings = require("../customSettings.json");
const fs = require("fs");
const Discord = require("discord.js");

module.exports = {
    name: 'setlogchannel',
    description: "Sets the log channel which is where the opening and closing of tickets is logged. Takes the first mentioned channel.",
    category: "utils",
    aliases: ["slc", "setlogs", "setlog"],
    cooldown: 10,
    usage: "<#channel>",
    guildOnly: true,
    execute(message, args) {
        if (message.author.id == message.guild.ownerID || message.member.hasPermission("ADMINISTRATOR")) {
            let id = message.guild.id;

            if (!message.mentions.channels.size && args[0] != "disable") {
                const embed2 = new Discord.MessageEmbed()
                    .setTimestamp()
                    .setAuthor("Simply Tickets", "https://munch42.github.io/img/SimpleTicketsImage.jpg")
                    .setDescription(`Please mention a channel to set as the log channel. To disable please run the command with disable such as \`?setlogchannel disable\``)
                    .setFooter("No logs")
                    .setColor("#e68525");

                return message.channel.send(embed2);
            }

            if (args[0] == "disable") {
                settings[id].logChannel = "";

                fs.writeFile("./customSettings.json", JSON.stringify(settings), (err) => {
                    if (err) console.log(err);
                });

                const embed = new Discord.MessageEmbed()
                    .setTimestamp()
                    .setAuthor("Simply Tickets", "https://munch42.github.io/img/SimpleTicketsImage.jpg")
                    .setDescription(`Log channel disabled.`)
                    .setFooter("Disabling Logs!")
                    .setColor("#e68525");

                return message.channel.send(embed);
            }

            channel = message.mentions.channels.first();

            settings[id].logChannel = channel.id;

            fs.writeFile("./customSettings.json", JSON.stringify(settings), (err) => {
                if (err) console.log(err);
            });

            const embed = new Discord.MessageEmbed()
                .setTimestamp()
                .setAuthor("Simply Tickets", "https://munch42.github.io/img/SimpleTicketsImage.jpg")
                .setDescription(`Log channel set to: ${channel.name}`)
                .setFooter("Logging Logs!")
                .setColor("#e68525");

            message.channel.send(embed);
        } else {
            const embed = new Discord.MessageEmbed()
                .setTimestamp()
                .setAuthor("Simply Tickets", "https://munch42.github.io/img/SimpleTicketsImage.jpg")
                .setDescription(`You must be an administrator or the guild owner to set the log channel!`)
                .setFooter("Logarithmic")
                .setColor("#e68525");

            message.channel.send(embed);
        }
    },
};