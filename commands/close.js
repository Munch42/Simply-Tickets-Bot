const prefixes = require("../prefixes.json");
const Discord = require("discord.js");
const ticketinfo = require("../ticketinfo.json");
const settings = require("../customSettings.json");
const fs = require("fs");

module.exports = {
    name: 'close',
    description: "Closes the ticket you run the command in.",
    category: "tickets",
    aliases: ["closeticket", "shutdown", "destroy", "terminate"],
    cooldown: 1,
    guildOnly: true,
    execute(message, args) {
        let customRole = false;

        if (settings[message.guild.id].supportRoleID) {
            let role = message.guild.roles.cache.get(settings[message.guild.id].supportRoleID);

            if (role) {
                customRole = true;
            }
        }

        if (!message.guild.roles.cache.some(role => role.name === "Support Team") && !customRole) {
            const embed = new Discord.MessageEmbed()
                .setTimestamp()
                .setAuthor("Simply Tickets", "https://munch42.github.io/img/SimpleTicketsImage.jpg")
                .setDescription(`Please create a role with the name 'Support Team' or run the command ${prefixes[message.guild.id].prefix}setup or ${prefixes[message.guild.id].prefix}setrole`)
                .setFooter("Tickets what a wonderful concept!")
                .setColor("#e68525");

            return message.channel.send(embed);
        }

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

        if (channels.includes(message.channel.id)) {
            const embed3 = new Discord.MessageEmbed()
                .setTimestamp()
                .setAuthor("Simply Tickets", "https://munch42.github.io/img/SimpleTicketsImage.jpg")
                .setDescription(`Please react to this message with either ✅ to close this ticket or 🚫 to cancel this command within 15 seconds.`)
                .setFooter("Time is a ticking!")
                .setColor("#e68525");

            const embed4 = new Discord.MessageEmbed()
                .setTimestamp()
                .setAuthor("Simply Tickets", "https://munch42.github.io/img/SimpleTicketsImage.jpg")
                .setDescription(`You cancelled the close ticket command!`)
                .setFooter("Time is up!")
                .setColor("#e68525");

            const filter = (reaction, user) => {
                return reaction.emoji.name === '✅' || reaction.emoji.name === '🚫';
            };

            let cancelledCommand = false;

            message.channel.send(embed3)
                .then(msg => {
                    msg.react('✅')
                        .then(() => msg.react('🚫'))
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

                            if (settings[id].logChannel) {
                                let loggingChannel = message.client.channels.cache.get(settings[id].logChannel);

                                if (!loggingChannel) {
                                    let embed4 = new Discord.MessageEmbed()
                                        .setTimestamp()
                                        .setAuthor("Simply Tickets", "https://munch42.github.io/img/SimpleTicketsImage.jpg")
                                        .setDescription(`The specified logging channel was not found. Please contact your guild administrators.`)
                                        .setFooter("HTTP Error Code: 500")
                                        .setColor("#a3051d");

                                    message.channel.send(embed4);
                                } else {
                                    let embed5 = new Discord.MessageEmbed()
                                        .setTimestamp()
                                        .setAuthor("Simply Tickets", "https://munch42.github.io/img/SimpleTicketsImage.jpg")
                                        .setDescription(`🚫 A ticket was closed with the name: \`${message.channel.name}\``)
                                        .setFooter("Closed for good.")
                                        .setColor("#a3051d");

                                    loggingChannel.send(embed5);
                                }
                            }

                            // Needed to avoid the error of no channel found
                            cancelledCommand = true;
                            collector.stop();

                            message.channel.delete();

                            for (let i = 0; i < channels.length; i++) {
                                if (channels[i] == message.channel.id) {
                                    channels.splice(i, 1);
                                }
                            }

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
            const embed2 = new Discord.MessageEmbed()
                .setTimestamp()
                .setAuthor("Simply Tickets", "https://munch42.github.io/img/SimpleTicketsImage.jpg")
                .setDescription(`This is channel is not a ticket. Please retry in an open ticket.`)
                .setFooter("Tickets so cool!")
                .setColor("#e68525");

            return message.channel.send(embed2);
        }
    },
};