const prefixes = require("../prefixes.json");
const Discord = require("discord.js");
const ticketinfo = require("../ticketinfo.json");
const settings = require("../customSettings.json");
const fs = require("fs");

module.exports = {
    name: 'new',
    description: "Opens a new ticket given the specified subject. You can @ a user to add them to the ticket and you can set a subject of it: (reason) (@user). All pinged users will be added to ticket.",
    category: "tickets",
    aliases: ["open", "newticket", "ticket"],
    usage: "[Reason] [@User]",
    guildOnly: true,
    execute(message, args) {
        // This checks to see if the server has a support team role or not.
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

        // This updates the basic ticket info for the server.
        if (!ticketinfo[id]) {
            ticketinfo[id] = {
                ticketCount: 1,
                channelIDs: []
            };

            fs.writeFile("./ticketinfo.json", JSON.stringify(ticketinfo), (err) => {
                if (err) console.log(err);
            });
        }

        let additionalUsers = undefined;
        let reason = "No reason given.";

        // These are to determine the reason and pick out the additional users to be added to the channel.
        if (args.length == 1 && message.mentions.users.size) {
            additionalUsers = message.mentions.users.first();
        } else if (!message.mentions.users.size && args.length >= 1) {
            for (let i = 0; i < args.length; i++) {
                if (i == 0) {
                    reason = args[i];
                    continue;
                }

                reason = `${reason} ${args[i]}`;
            }
        } else if (args.length >= 2 && message.mentions.users.size > 1) {
            additionalUsers = message.mentions.users.map(user => {
                return user;
            });

            for (let i = 0; i < args.length; i++) {
                if (i == 0) {
                    if (`<@!${additionalUsers[i]}>` == args[i]) {
                        reason = args[i + 1]
                        i += 1;
                        continue;
                    } else {
                        reason = args[i];
                        continue;
                    }
                }

                reason = `${reason} ${args[i]}`;
            }
        } else if (args.length >= 2 && message.mentions.users.size == 1) {
            additionalUsers = message.mentions.users.first();
            for (let i = 1; i < args.length; i++) {
                if (i == 1) {
                    reason = args[i];
                    continue;
                }

                reason = `${reason} ${args[i]}`;
            }
        }

        let name = `ticket-${ticketinfo[id].ticketCount}`;

        if (settings[id].namingScheme) {
            name = settings[id].namingScheme;

            if (name != "") {
                name = name.replace(/%ticketCount%/g, `<@!${ticketinfo[id].ticketCount}>`)
            } else {
                name = `ticket-${ticketinfo[id].ticketCount}`;
            }
        } else {
            name = `ticket-${ticketinfo[id].ticketCount}`;
        }

        let supportID;

        if (settings[id].supportRoleID) {
            let role = message.guild.roles.cache.get(settings[id].supportRoleID);

            if (role) {
                supportID = role.id;
            } else {
                supportID = message.guild.roles.cache.find(role => role.name === "Support Team").id;
            }
        } else {
            supportID = message.guild.roles.cache.find(role => role.name === "Support Team").id;
        }

        // This actually creates a ticket, informs the user of the channel and sends a message to the channel.
        message.guild.channels.create(name, {
            type: "text",
            permissionOverwrites: [
                {
                    id: message.guild.id,
                    deny: ['VIEW_CHANNEL'],
                },
                {
                    id: message.author.id,
                    allow: ['VIEW_CHANNEL'],
                },
                {
                    id: supportID,
                    allow: ["VIEW_CHANNEL"],
                },
            ],
        })
            .then(channel => {
                if (additionalUsers != undefined) {
                    if (additionalUsers.length != undefined) {
                        for (let x = 0; x < additionalUsers.length; x++) {
                            channel.updateOverwrite(additionalUsers[x].id, { VIEW_CHANNEL: true });
                        }
                    } else {
                        channel.updateOverwrite(additionalUsers.id, { VIEW_CHANNEL: true });
                    }
                }

                if (settings[id].category) {
                    let category = message.guild.channels.cache.find(c => c.name == settings[id].category && c.type == "category");

                    if (!category) {
                        let embed3 = new Discord.MessageEmbed()
                            .setTimestamp()
                            .setAuthor("Simply Tickets", "https://munch42.github.io/img/SimpleTicketsImage.jpg")
                            .setDescription(`The specified category for your ticket was not found. Please inform your guild administrators.`)
                            .setFooter("Categories not found: 404")
                            .setColor("#e68525");

                        message.channel.send(embed3);
                    } else {
                        channel.setParent(category);
                    }
                }

                let embed2 = new Discord.MessageEmbed()
                    .setTimestamp()
                    .setAuthor("Simply Tickets", "https://munch42.github.io/img/SimpleTicketsImage.jpg")
                    .setDescription(`✅ Your ticket was created in the channel: <#${channel.id}> or \`${channel.name}\``)
                    .setFooter("Tickets what a wonderful concept!")
                    .setColor("#e68525");

                message.channel.send(embed2);

                let defaultMessage = settings[id].openMessage;
                defaultMessage = defaultMessage.replace(/%user%/g, `<@!${message.author.id}>`);
                defaultMessage = defaultMessage.replace(/\\n/g, "\n");

                let channelStartEmbed = new Discord.MessageEmbed()
                    .setTimestamp()
                    .setAuthor("Simply Tickets", "https://munch42.github.io/img/SimpleTicketsImage.jpg")
                    .setDescription(`${defaultMessage}`)
                    .addField(`Subject`, `${reason}`, false)
                    .setFooter("Tickets extremely useful things!")
                    .setColor("#e68525");

                channel.send(channelStartEmbed);

                if (settings[id].extraPing != null) {
                    let doPing = settings[id].extraPing;

                    if (doPing == "true") {
                        channel.send(`<@&${supportID}>`);
                    }
                }

                if (settings[id].logChannel) {
                    let loggingChannel = message.client.channels.cache.get(settings[id].logChannel);

                    if (!loggingChannel) {
                        let embed4 = new Discord.MessageEmbed()
                            .setTimestamp()
                            .setAuthor("Simply Tickets", "https://munch42.github.io/img/SimpleTicketsImage.jpg")
                            .setDescription(`The specified logging channel was not found. Please contact your guild administrators.`)
                            .setFooter("HTTP Error Code: 418")
                            .setColor("#a3051d");

                        message.channel.send(embed4);
                    } else {
                        let embed5 = new Discord.MessageEmbed()
                            .setTimestamp()
                            .setAuthor("Simply Tickets", "https://munch42.github.io/img/SimpleTicketsImage.jpg")
                            .setDescription(`✅ A ticket was created in the channel: <#${channel.id}> or \`${channel.name}\` \nSubject: ${reason}`)
                            .setFooter("Opened for business.")
                            .setColor("#0bb516");

                        loggingChannel.send(embed5);
                    }
                }

                let ids = ticketinfo[id].channelIDs;
                ids.push(channel.id);

                ticketinfo[id] = {
                    ticketCount: ticketinfo[id].ticketCount + 1,
                    channelIDs: ids
                };

                fs.writeFile("./ticketinfo.json", JSON.stringify(ticketinfo), (err) => {
                    if (err) console.log(err);
                });
            });
    },
};