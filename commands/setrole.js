const settings = require("../customSettings.json");
const fs = require("fs");
const Discord = require("discord.js");

module.exports = {
    name: 'setrole',
    description: "Sets a custom role for the support team. Takes the first mentioned role.",
    category: "utils",
    aliases: ["ssr", "setsupportteam", "setsupportrole"],
    cooldown: 10,
    usage: "<@role>",
    guildOnly: true,
    execute(message, args) {
        if (message.author.id == message.guild.ownerID || message.member.hasPermission("ADMINISTRATOR")) {
            let id = message.guild.id;

            if (!message.mentions.roles.size && args[0] != "disable") {
                const embed2 = new Discord.MessageEmbed()
                    .setTimestamp()
                    .setAuthor("Simply Tickets", "https://munch42.github.io/img/SimpleTicketsImage.jpg")
                    .setDescription(`Please mention a role to set as the support team role. To disable please run the command with disable such as \`?setrole disable\``)
                    .setFooter("The roles disapparated!")
                    .setColor("#e68525");

                return message.channel.send(embed2);
            }

            if (args[0] == "disable") {
                settings[id].supportRoleID = "";

                fs.writeFile("./customSettings.json", JSON.stringify(settings), (err) => {
                    if (err) console.log(err);
                });

                const embed = new Discord.MessageEmbed()
                    .setTimestamp()
                    .setAuthor("Simply Tickets", "https://munch42.github.io/img/SimpleTicketsImage.jpg")
                    .setDescription(`Custom support role disabled.`)
                    .setFooter("Roles are now done.")
                    .setColor("#e68525");

                return message.channel.send(embed);
            }

            role = message.mentions.roles.first();

            settings[id].supportRoleID = role.id;

            fs.writeFile("./customSettings.json", JSON.stringify(settings), (err) => {
                if (err) console.log(err);
            });

            const embed = new Discord.MessageEmbed()
                .setTimestamp()
                .setAuthor("Simply Tickets", "https://munch42.github.io/img/SimpleTicketsImage.jpg")
                .setDescription(`Support role set to: ${role.name}`)
                .setFooter("Customization at its finest.")
                .setColor("#e68525");

            message.channel.send(embed);
        } else {
            const embed = new Discord.MessageEmbed()
                .setTimestamp()
                .setAuthor("Simply Tickets", "https://munch42.github.io/img/SimpleTicketsImage.jpg")
                .setDescription(`You must be an administrator or the guild owner to set the support team role!`)
                .setFooter("Support the cheese to my crackers.")
                .setColor("#e68525");

            message.channel.send(embed);
        }
    },
};