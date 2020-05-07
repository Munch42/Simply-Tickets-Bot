const Discord = require("discord.js");
const fs = require("fs");
const blacklist = require("../blacklist.json");
const settings = require("../customSettings.json");

module.exports = {
    name: 'blacklist',
    description: "Blacklists a user, stopping them from using any of my commands.",
    category: "moderation",
    aliases: ["bl"],
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

        if (message.author.id == message.guild.ownerID || message.member.hasPermission("ADMINISTRATOR") || message.member.roles.cache.some(role => role.name === 'Support Team' || customRole)) {
            if (!message.mentions.users.size) {
                const embed = new Discord.MessageEmbed()
                    .setTimestamp()
                    .setAuthor("Simply Tickets", "https://munch42.github.io/img/SimpleTicketsImage.jpg")
                    .setDescription(`Please tag one or multiple people to blacklist.`)
                    .setFooter("Interesting!")
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
                if (!blacklistedUsers.includes(userID) && userID != message.author.id) {
                    blacklistedUsers.push(userID);
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
                .setDescription(`All of the given users have been blacklisted! If you tried blacklisting yourself, you were not blacklisted.`)
                .setFooter("Interesting!")
                .setColor("#e68525");

            return message.channel.send(embed);
        } else {
            const embed = new Discord.MessageEmbed()
                .setTimestamp()
                .setAuthor("Simply Tickets", "https://munch42.github.io/img/SimpleTicketsImage.jpg")
                .setDescription(`Hey! You must be the guild owner, an administrator or on the support team to blacklist someone.`)
                .setFooter("Blacklists, powerful stuff!")
                .setColor("#e68525");

            return message.channel.send(embed);
        }
    },
};