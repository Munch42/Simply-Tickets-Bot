const settings = require("../customSettings.json");
const fs = require("fs");
const Discord = require("discord.js");

module.exports = {
    name: 'setcategory',
    description: "Sets the category tickets are opened in for your server. Capitals Matter.",
    category: "utils",
    aliases: ["sc"],
    cooldown: 10,
    usage: "<category name, case sensitive>",
    guildOnly: true,
    execute(message, args) {
        if (message.author.id == message.guild.ownerID || message.member.hasPermission("ADMINISTRATOR")) {
            let id = message.guild.id;

            let list = "";

            for (let x = 0; x < args.length; x++) {
                if (x == 0) {
                    list = `${args[x]}`
                } else {
                    list = `${list} ${args[x]}`
                }
            }

            settings[id].category = list;

            fs.writeFile("./customSettings.json", JSON.stringify(settings), (err) => {
                if (err) console.log(err);
            });

            const embed = new Discord.MessageEmbed()
                .setTimestamp()
                .setAuthor("Simply Tickets", "https://munch42.github.io/img/SimpleTicketsImage.jpg")
                .setDescription(`Category set to: ${list}`)
                .setFooter("Categorized Tickets are best!")
                .setColor("#e68525");

            message.channel.send(embed);
        } else {
            const embed = new Discord.MessageEmbed()
                .setTimestamp()
                .setAuthor("Simply Tickets", "https://munch42.github.io/img/SimpleTicketsImage.jpg")
                .setDescription(`You must be an administrator or the guild owner to set the ticket category!`)
                .setFooter("Incorrect permissions can be painful!")
                .setColor("#e68525");

            message.channel.send(embed);
        }
    },
};