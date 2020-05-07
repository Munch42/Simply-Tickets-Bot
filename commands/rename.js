const Discord = require("discord.js");
const ticketinfo = require("../ticketinfo.json");
const settings = require("../customSettings.json");

module.exports = {
    name: 'rename',
    description: "Allows support team members to rename tickets by running this command in the ticket they wish to change and providing the new name.",
    category: "tickets",
    aliases: ["ren", "name", "title"],
    usage: "<new name>",
    guildOnly: true,
    execute(message, args) {
        let customRole = false;

        if (settings[message.guild.id].supportRoleID) {
            let role = message.member.roles.cache.has(settings[message.guild.id].supportRoleID);

            if (role) {
                customRole = true;
            }
        }

        if (message.author.id == message.guild.ownerID || message.member.hasPermission("ADMINISTRATOR") || message.member.roles.cache.some(role => role.name === 'Support Team') || customRole) {
            if (!args.length) {
                const embed = new Discord.MessageEmbed()
                    .setTimestamp()
                    .setAuthor("Simply Tickets", "https://munch42.github.io/img/SimpleTicketsImage.jpg")
                    .setDescription(`You must provide a new name for this ticket.`)
                    .setFooter("Differentiation")
                    .setColor("#e68525");

                return message.channel.send(embed);
            }

            let ticketChannels = ticketinfo[message.guild.id].channelIDs;

            if (!ticketChannels.includes(message.channel.id)) {
                const embed = new Discord.MessageEmbed()
                    .setTimestamp()
                    .setAuthor("Simply Tickets", "https://munch42.github.io/img/SimpleTicketsImage.jpg")
                    .setDescription(`You must perform this command within an open ticket channel.`)
                    .setFooter("Going through the correct channels.")
                    .setColor("#e68525");

                return message.channel.send(embed);
            }

            let list = "";

            for (let x = 0; x < args.length; x++) {
                if (list == "") {
                    list = `${args[x]}-`;
                } else {
                    list = `${list}${args[x]}-`
                }
            }

            message.channel.setName(list);

            const finalEmbed = new Discord.MessageEmbed()
                .setTimestamp()
                .setAuthor("Simply Tickets", "https://munch42.github.io/img/SimpleTicketsImage.jpg")
                .setDescription(`The ticket has now been renamed.`)
                .setFooter("Completely Complete!")
                .setColor("#e68525");

            return message.channel.send(finalEmbed);
        } else {
            const embed = new Discord.MessageEmbed()
                .setTimestamp()
                .setAuthor("Simply Tickets", "https://munch42.github.io/img/SimpleTicketsImage.jpg")
                .setDescription(`Hey! You must be the guild owner, an administrator or on the support team to rename a ticket.`)
                .setFooter("Tickets + Names = Identification.")
                .setColor("#e68525");

            return message.channel.send(embed);
        }

    },
};