const settings = require("../customSettings.json");
const fs = require("fs");
const Discord = require("discord.js");

module.exports = {
    name: 'setticketnames',
    description: "Sets the name that tickets are opened with. Use %ticketCount% as the placeholder for the ticket number. Ex. ticket-%ticketCount% could become ticket-1.",
    category: "utils",
    aliases: ["stn", "setnames", "setnamingscheme"],
    cooldown: 10,
    usage: "<ticket-name>",
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

            settings[id].namingScheme = list;

            fs.writeFile("./customSettings.json", JSON.stringify(settings), (err) => {
                if (err) console.log(err);
            });

            const embed = new Discord.MessageEmbed()
                .setTimestamp()
                .setAuthor("Simply Tickets", "https://munch42.github.io/img/SimpleTicketsImage.jpg")
                .setDescription(`Ticket Names set to: ${list}`)
                .setFooter("Ticket names, amazing!")
                .setColor("#e68525");

            message.channel.send(embed);
        } else {
            const embed = new Discord.MessageEmbed()
                .setTimestamp()
                .setAuthor("Simply Tickets", "https://munch42.github.io/img/SimpleTicketsImage.jpg")
                .setDescription(`You must be an administrator or the guild owner to set the ticket naming scheme!`)
                .setFooter("Scheme your evil plan you must!")
                .setColor("#e68525");

            message.channel.send(embed);
        }
    },
};