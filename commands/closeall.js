const prefixes = require("../prefixes.json");
const Discord = require("discord.js");
const ticketinfo = require("../ticketinfo.json");
const fs = require("fs");

module.exports = {
    name: 'closeall',
    description: "Closes all of the tickets. You must be the guild owner or an administrator to perform this. Support team members cannot.",
    category: "tickets",
    aliases: ["closealltickets", "shutdownall", "destroyall", "terminateall", "cll"],
    cooldown: 1,
    guildOnly: true,
    execute(message, args) {
        if (message.author.id == message.guild.ownerID || message.member.hasPermission("ADMINISTRATOR")) {

            let id = message.guild.id;

            if (!ticketinfo[id]) {
                ticketinfo[id] = {
                    ticketCount: 1,
                    channelIDs: []
                };

                fs.writeFile("./ticketinfo.json", JSON.stringify(ticketinfo), (err) => {
                    if (err) console.log(err);
                });
            }

            let channels = ticketinfo[id].channelIDs;

            const embed3 = new Discord.MessageEmbed()
                .setTimestamp()
                .setAuthor("Simply Tickets", "https://munch42.github.io/img/SimpleTicketsImage.jpg")
                .setDescription(`Please react to this message with either ✅ to close all tickets or 🚫 to cancel this command within 15 seconds.`)
                .setFooter("It's like a time bomb.")
                .setColor("#e68525");

            const embed4 = new Discord.MessageEmbed()
                .setTimestamp()
                .setAuthor("Simply Tickets", "https://munch42.github.io/img/SimpleTicketsImage.jpg")
                .setDescription(`You cancelled the close all tickets command.`)
                .setFooter("Or your time was up!")
                .setColor("#e68525");

            const filter = (reaction, user) => {
                return reaction.emoji.name === '✅' || reaction.emoji.name === '🚫';
            };

            let cancelledCommand = false;

            message.channel.send(embed3)
                .then(msg => {
                    msg.react('🚫')
                        .then(() => msg.react('✅'))
                        .catch();

                    const collector = msg.createReactionCollector(filter, { time: 15000 });

                    collector.on('collect', (reaction, user) => {
                        if (user.id !== message.author.id) {
                            return;
                        }

                        if (reaction.emoji.name === '✅') {
                            if (cancelledCommand) {
                                return;
                            }

                            if (!channels.includes(message.channel.id)) {
                                const embed = new Discord.MessageEmbed()
                                    .setTimestamp()
                                    .setAuthor("Simply Tickets", "https://munch42.github.io/img/SimpleTicketsImage.jpg")
                                    .setDescription(`All open tickets are now being closed.`)
                                    .setFooter("All gone with one button!?")
                                    .setColor("#e68525");

                                message.channel.send(embed);
                            }

                            // Needed to avoid the error of no channel found
                            cancelledCommand = true;
                            collector.stop();

                            channels.forEach(channelID => {
                                let tempChannel = message.client.channels.cache.get(channelID);
                                tempChannel.delete();
                            });

                            channels.length = 0;

                            ticketinfo[id].channelIDs = channels;

                            fs.writeFile("./ticketinfo.json", JSON.stringify(ticketinfo), (err) => {
                                if (err) console.log(err);
                            });
                        } else if (reaction.emoji.name === '🚫') {
                            if (cancelledCommand) {
                                return;
                            }

                            cancelledCommand = true;
                            return message.channel.send(embed4)
                                .then(msg2 => {
                                    msg2.delete({ timeout: 15000 });
                                });
                        }
                    });

                    collector.on("end", collected => {
                        if (cancelledCommand) {
                            return;
                        }
                        return message.channel.send(embed4)
                            .then(msg3 => {
                                msg3.delete({ timeout: 15000 });
                            });
                    });
                });
        } else {
            const embed = new Discord.MessageEmbed()
                .setTimestamp()
                .setAuthor("Simply Tickets", "https://munch42.github.io/img/SimpleTicketsImage.jpg")
                .setDescription(`Hey! You must be the guild owner or an administrator to close all tickets.`)
                .setFooter("Ba-da-bing Ba-da-boom!")
                .setColor("#e68525");

            return message.channel.send(embed);
        }
    },
};