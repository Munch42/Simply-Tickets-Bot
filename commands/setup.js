const Discord = require("discord.js");
const settings = require("../customSettings.json");

module.exports = {
    name: 'setup',
    description: 'Sets up the Support Team role for the server.',
    cooldown: 5,
    category: "tickets",
    guildOnly: true,
    execute(message, args) {
        if (message.author.id == message.guild.ownerID || message.member.hasPermission("ADMINISTRATOR")) {
            let customRole = false;

            if (settings[message.guild.id].supportRoleID) {
                let role = message.guild.roles.cache.get(settings[message.guild.id].supportRoleID);

                if (role) {
                    customRole = true;
                }
            }

            if (message.guild.roles.cache.some(role => role.name === "Support Team") || customRole) {
                const embed = new Discord.MessageEmbed()
                    .setTimestamp()
                    .setAuthor("Simply Tickets", "https://munch42.github.io/img/SimpleTicketsImage.jpg")
                    .setDescription(`Your server is already setup with the Support Team or a custom role!`)
                    .setFooter("Tickets what a wonderful concept!")
                    .setColor("#e68525");

                message.channel.send(embed);
            } else {
                message.guild.roles.create({ data: { name: "Support Team", color: "BLUE" } });
                const embed = new Discord.MessageEmbed()
                    .setTimestamp()
                    .setAuthor("Simply Tickets", "https://munch42.github.io/img/SimpleTicketsImage.jpg")
                    .setDescription(`The role of "Support Team" has now been created. Please apply it to all of those you want to be able to see all tickets.`)
                    .setFooter("Ticket Setup - Super Simple!")
                    .setColor("#e68525");

                message.channel.send(embed);
            }
        } else {
            const embed = new Discord.MessageEmbed()
                .setTimestamp()
                .setAuthor("Simply Tickets", "https://munch42.github.io/img/SimpleTicketsImage.jpg")
                .setDescription(`Hey! You must be the guild owner or an administrator to setup your server.`)
                .setFooter("Tickets so interesting!")
                .setColor("#e68525");

            message.channel.send(embed);
        }
    },
};