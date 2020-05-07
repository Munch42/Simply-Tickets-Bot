const Discord = require("discord.js");
const fs = require("fs");
const blacklist = require("../blacklist.json");
const settings = require("../customSettings.json");

module.exports = {
    name: 'unblacklist',
    description: "Removes the mentioned users from the blacklist for your server, Allowing them to perform my commands again.",
    category: "moderation",
    aliases: ["unbl"],
    args: true,
    usage: "<@user(s)>",
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
            if (!message.mentions.users.size) {
                const embed = new Discord.MessageEmbed()
                    .setTimestamp()
                    .setAuthor("Simply Tickets", "https://munch42.github.io/img/SimpleTicketsImage.jpg")
                    .setDescription(`Please tag one or multiple people to remove them from the blacklist.`)
                    .setFooter("Almost There!")
                    .setColor("#e68525");

                return message.channel.send(embed);
            }

            const userList = message.mentions.users.map(user => {
                return user.id;
            });

            let id = message.guild.id;

            let blacklistedUsers = blacklist[id].blacklistedID;
            let userArray = Array.from(userList);

            userArray.forEach(userID => {
                for (let i = 0; i < blacklistedUsers.length; i++) {
                    if (blacklistedUsers[i] == userID) {
                        blacklistedUsers.splice(i, 1);
                    }
                }
            });

            blacklist[id] = {
                blacklistedID: blacklistedUsers
            };

            fs.writeFile("./blacklist.json", JSON.stringify(blacklist), (err) => {
                if (err) console.log(err);
            });

            const embed = new Discord.MessageEmbed()
                .setTimestamp()
                .setAuthor("Simply Tickets", "https://munch42.github.io/img/SimpleTicketsImage.jpg")
                .setDescription(`All of the given users have been removed from the blacklist!`)
                .setFooter("Coolio!")
                .setColor("#e68525");

            return message.channel.send(embed);
        } else {
            const embed = new Discord.MessageEmbed()
                .setTimestamp()
                .setAuthor("Simply Tickets", "https://munch42.github.io/img/SimpleTicketsImage.jpg")
                .setDescription(`Hey! You must be the guild owner, an administrator or on the support team to remove someone from the blacklist.`)
                .setFooter("Blacklists, wowza!")
                .setColor("#e68525");

            return message.channel.send(embed);
        }
    },
};