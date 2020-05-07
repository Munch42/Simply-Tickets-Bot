const Discord = require("discord.js");
const ticketinfo = require("../ticketinfo.json");
const settings = require("../customSettings.json");

module.exports = {
    name: 'remove',
    description: "Allows support team members to remove users from open tickets by linking one or more channels and one or more users. All mentioned users will be removed from all mentioned channels",
    category: "tickets",
    aliases: ["-", "rem", "remov"],
    usage: "<@user(s)> <#channel(s)>",
    args: true,
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
            if (!message.mentions.channels.size) {
                const embed = new Discord.MessageEmbed()
                    .setTimestamp()
                    .setAuthor("Simply Tickets", "https://munch42.github.io/img/SimpleTicketsImage.jpg")
                    .setDescription(`Please tag one or more channels.`)
                    .setFooter("Channels a must have!")
                    .setColor("#e68525");

                return message.channel.send(embed);
            }

            if (!message.mentions.users.size) {
                const embed2 = new Discord.MessageEmbed()
                    .setTimestamp()
                    .setAuthor("Simply Tickets", "https://munch42.github.io/img/SimpleTicketsImage.jpg")
                    .setDescription(`Please tag one or more users.`)
                    .setFooter("Also you need some users to remove that is cool!")
                    .setColor("#e68525");

                return message.channel.send(embed2);
            }

            const channelList = message.mentions.channels.map(channel => {
                return channel;
            });

            const userList = message.mentions.users.map(user => {
                return user;
            });

            let ticketChannels = ticketinfo[message.guild.id].channelIDs;

            channelList.forEach(channel => {
                if (!ticketChannels.includes(channel.id)) {
                    for (let i = 0; i < channelList.length; i++) {
                        if (channelList[i] == channel.id) {
                            channelList.splice(i, 1);
                        }
                    }
                }
            });

            userList.forEach(user => {
                for (let x = 0; x < channelList.length; x++) {
                    let channel = channelList[x];
                    channel.updateOverwrite(user, { VIEW_CHANNEL: false });
                }
            });

            const completeEmbed = new Discord.MessageEmbed()
                .setTimestamp()
                .setAuthor("Simply Tickets", "https://munch42.github.io/img/SimpleTicketsImage.jpg")
                .setDescription(`Successfully removed all tagged users from all of the tagged **ticket** channels.`)
                .setFooter("Completed at long last!")
                .setColor("#e68525");

            return message.channel.send(completeEmbed);
        } else {
            const embed = new Discord.MessageEmbed()
                .setTimestamp()
                .setAuthor("Simply Tickets", "https://munch42.github.io/img/SimpleTicketsImage.jpg")
                .setDescription(`Hey! You must be the guild owner, an administrator or on the support team to remove people from tickets.`)
                .setFooter("Tickets + People = Support.")
                .setColor("#e68525");

            return message.channel.send(embed);
        }

    },
};