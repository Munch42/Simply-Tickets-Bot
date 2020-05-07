const settings = require("../customSettings.json");
const fs = require("fs");
const Discord = require("discord.js");

module.exports = {
    name: 'setmessage',
    description: "Sets the opening message in tickets for your server. Use %user% to ping the user who opened the ticket such as 'Dear %user%' Use backslash n (With no space) to create a new line.",
    category: "utils",
    aliases: ["sm"],
    cooldown: 10,
    usage: "<new opening message>",
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

            settings[id].openMessage = list;

            fs.writeFile("./customSettings.json", JSON.stringify(settings), (err) => {
                if (err) console.log(err);
            });

            const embed = new Discord.MessageEmbed()
                .setTimestamp()
                .setAuthor("Simply Tickets", "https://munch42.github.io/img/SimpleTicketsImage.jpg")
                .setDescription(`Opening message set to: \n\n ${list}`)
                .setFooter("Opening messages since 2020")
                .setColor("#e68525");

            message.channel.send(embed);
        } else {
            const embed = new Discord.MessageEmbed()
                .setTimestamp()
                .setAuthor("Simply Tickets", "https://munch42.github.io/img/SimpleTicketsImage.jpg")
                .setDescription(`You must be an administrator or the guild owner to set the default message!`)
                .setFooter("Incorrect permissions can be a pain!")
                .setColor("#e68525");

            message.channel.send(embed);
        }
    },
};