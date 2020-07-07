const settings = require("../customSettings.json");
const fs = require("fs");
const Discord = require("discord.js");

module.exports = {
    name: 'extraping',
    description: "Sets whether or not the bot will ping the support team role outside of the embed after the ticket is created.",
    category: "utils",
    aliases: ["ep", "extp", "setextraping"],
    cooldown: 10,
    usage: "<true | false>",
    args: true,
    guildOnly: true,
    execute(message, args) {
        if (message.author.id == message.guild.ownerID || message.member.hasPermission("ADMINISTRATOR")) {
            let id = message.guild.id;

            if (args[0].toLowerCase() != "false" && args[0].toLowerCase() != "true") {
                const embed2 = new Discord.MessageEmbed()
                    .setTimestamp()
                    .setAuthor("Simply Tickets", "https://munch42.github.io/img/SimpleTicketsImage.jpg")
                    .setDescription(`Please use \`true\` or \`false\` to enable or disable the extra ping!`)
                    .setFooter("The roles disapparated!")
                    .setColor("#e68525");

                return message.channel.send(embed2);
            }

            if (args[0].toLowerCase() == "false") {
                settings[id].extraPing = "false";

                fs.writeFile("./customSettings.json", JSON.stringify(settings), (err) => {
                    if (err) console.log(err);
                });

                const embed = new Discord.MessageEmbed()
                    .setTimestamp()
                    .setAuthor("Simply Tickets", "https://munch42.github.io/img/SimpleTicketsImage.jpg")
                    .setDescription(`Extra ping is now disabled.`)
                    .setFooter("Pings are gone.")
                    .setColor("#e68525");

                return message.channel.send(embed);
            }

            settings[id].extraPing = "true";

            fs.writeFile("./customSettings.json", JSON.stringify(settings), (err) => {
                if (err) console.log(err);
            });

            const embed = new Discord.MessageEmbed()
                .setTimestamp()
                .setAuthor("Simply Tickets", "https://munch42.github.io/img/SimpleTicketsImage.jpg")
                .setDescription(`Extra Ping enabled!`)
                .setFooter("Customization at its finest.")
                .setColor("#e68525");

            message.channel.send(embed);
        } else {
            const embed = new Discord.MessageEmbed()
                .setTimestamp()
                .setAuthor("Simply Tickets", "https://munch42.github.io/img/SimpleTicketsImage.jpg")
                .setDescription(`You must be an administrator or the guild owner to set this option!`)
                .setFooter("Support the cheese to my crackers.")
                .setColor("#e68525");

            message.channel.send(embed);
        }
    },
};