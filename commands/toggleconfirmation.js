const settings = require("../customSettings.json");
const fs = require("fs");
const Discord = require("discord.js");

module.exports = {
    name: 'toggleconfirmation',
    description: "Sets wether or not a confirmation message is shown when a ticket is closed. Default: true",
    category: "utils",
    aliases: ["tc", "togconf", "confirmation"],
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
                    .setDescription(`Please use \`true\` or \`false\` to enable or disable the close message!`)
                    .setFooter("The confirmation is useful when not in a hurry!")
                    .setColor("#e68525");

                return message.channel.send(embed2);
            }

            if (args[0].toLowerCase() == "false") {
                settings[id].closeConfirmation = "false";

                fs.writeFile("./customSettings.json", JSON.stringify(settings), (err) => {
                    if (err) console.log(err);
                });

                const embed = new Discord.MessageEmbed()
                    .setTimestamp()
                    .setAuthor("Simply Tickets", "https://munch42.github.io/img/SimpleTicketsImage.jpg")
                    .setDescription(`There will no longer be a confirmation message when you close a ticket.`)
                    .setFooter("Confirmed!")
                    .setColor("#e68525");

                return message.channel.send(embed);
            }

            settings[id].closeConfirmation = "true";

            fs.writeFile("./customSettings.json", JSON.stringify(settings), (err) => {
                if (err) console.log(err);
            });

            const embed = new Discord.MessageEmbed()
                .setTimestamp()
                .setAuthor("Simply Tickets", "https://munch42.github.io/img/SimpleTicketsImage.jpg")
                .setDescription(`Confirmation enabled!`)
                .setFooter("Customization at its finest.")
                .setColor("#e68525");

            message.channel.send(embed);
        } else {
            const embed = new Discord.MessageEmbed()
                .setTimestamp()
                .setAuthor("Simply Tickets", "https://munch42.github.io/img/SimpleTicketsImage.jpg")
                .setDescription(`You must be an administrator or the guild owner to set this option!`)
                .setFooter("Support, the cheese to my crackers.")
                .setColor("#e68525");

            message.channel.send(embed);
        }
    },
};