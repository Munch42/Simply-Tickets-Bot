const Discord = require("discord.js");
const fs = require("fs");
const blacklist = require("../blacklist.json");
const settings = require("../customSettings.json");

module.exports = {
    name: 'listblacklist',
    description: "Lists all the ID's and names of the users in the blacklist.",
    category: "moderation",
    aliases: ["lbl", "listbl", "lsbl"],
    guildOnly: true,
    async execute(message, args) {
        let customRole = false;

        if (settings[message.guild.id].supportRoleID) {
            let role = message.member.roles.cache.has(settings[message.guild.id].supportRoleID);

            if (role) {
                customRole = true;
            }
        }

        if (message.author.id == message.guild.ownerID || message.member.hasPermission("ADMINISTRATOR") || message.member.roles.cache.some(role => role.name === 'Support Team') || customRole) {
            let id = message.guild.id;

            let blacklistedUsers = blacklist[id].blacklistedID;
            let userArray = Array.from(blacklistedUsers);

            const blacklistEmbed = new Discord.MessageEmbed()
                .setTimestamp()
                .setAuthor("Simply Tickets", "https://munch42.github.io/img/SimpleTicketsImage.jpg")
                .setFooter("Lists amazing!")
                .setColor("#e68525")

            // Work on no error when a person leaves so no user is fetched.

            let list = "";
            //let userMap = new Map();
            //let lastFailed = false;

            if (userArray.length == 0) {
                blacklistEmbed.addField("Blacklist:", "There are currently no blacklisted users!", false);
                return message.channel.send(blacklistEmbed);
            }

            for (let x = 0; x < userArray.length; x++) {
                if (list == "") {
                    list = `<@!${userArray[x]}> \n`;
                } else {
                    list = `${list}<@!${userArray[x]}> \n`;
                }

                if (x == (userArray.length - 1)) {
                    blacklistEmbed.addField("Blacklist:", list, false);

                    return message.channel.send(blacklistEmbed);
                }

                /*if (!message.guild.members.cache.get(userArray[x])) {
                    console.log("Can't fetch");
                    //removeUser(userArray[x], blacklistedUsers);
                    if (x == (userArray.length - 1)) {
                        lastFailed = true;
                    } else {
                        continue;
                    }
                }

                if (lastFailed) {
                    currentUser = "705559253712240652";
                } else {
                    currentUser = userArray[x];
                }

                message.client.users.fetch(currentUser)
                    .then(user => {
                        if (!lastFailed) {
                            userMap.set(userArray[x], user.username);
                        }

                        if (x == (userArray.length - 1)) {
                            console.log("1: " + blacklistedUsers);
                            console.log(userMap);

                            userArray = Array.from(blacklistedUsers);

                            let i = 0;

                            userMap.forEach(function (value, key) {
                                if (list == "") {
                                    list = `${key} - ${value} \n`;
                                    console.log("dwab " + list);
                                } else {
                                    list = `${list}${key} - ${value} \n`;
                                    console.log("cab " + list);
                                }

                                if (i == (userMap.size - 1)) {
                                    blacklistEmbed.addField("Blacklist:", list, false);
                                    console.log("end " + list);

                                    return message.channel.send(blacklistEmbed);
                                }

                                i++;
                            });
                        }
                    }).catch(error => { console.log(error); });
                    */
                //.catch(error => {
                // In here put logic to remove the errored person and to inform the user.
                /*
                if (x == (userArray.length - 1)) {
                    list = `${list} User left or was deleted. \n`;
         
                    blacklistEmbed.addField("Blacklist:", list, false);
         
                    message.channel.send(blacklistEmbed);
                } else if (list == "") {
                    console.log("bla");
                    list = `User left or was deleted. \n`;
                } else {
                    console.log("dwa");
                    console.log(list);
                    list = `${list}User left or was deleted. \n`;
                    console.log("2 " + list);
                }*/

                // Removing Doesn't work but the user left or was deleted does.

                /*for (let i = 0; i < blacklistedUsers.length; i++) {
                    if (blacklistedUsers[i] == userArray[x]) {
                        blacklistedUsers.splice(i, 1);
                    }
                }
         
                blacklist[id] = {
                    blacklistedID: blacklistedUsers
                };
         
                fs.writeFile("./blacklist.json", JSON.stringify(blacklist), (err) => {
                    if (err) console.log(err);
                });*/
                //});
            }

            // Test Set
            /*
            "352854019934257156", // Real
            "270904126974511578", // Fake
            "270904126974590935", // Fake
            "270904126974590976", // Real
            "270904126974595825", // Fake
            "270904126974581820"  // Fake
         
            Copyable:
            "352854019934257156", 
            "270904126974511578", 
            "270904126974590935", 
            "270904126974590976",
            "270904126974595825",
            "270904126974581820"
            */
        } else {
            const embed = new Discord.MessageEmbed()
                .setTimestamp()
                .setAuthor("Simply Tickets", "https://munch42.github.io/img/SimpleTicketsImage.jpg")
                .setDescription(`Hey! You must be the guild owner, an administrator or on the support team to list the blacklist.`)
                .setFooter("Bazinga!")
                .setColor("#e68525");

            return message.channel.send(embed);
        }

        /*function removeUser(user2, blacklistedUsers) {
            //userArray.forEach(user2 => {
            //if (!userMap.has(user2)) {
            console.log("i: " + blacklistedUsers);
            for (let i = 0; i < blacklistedUsers.length; i++) {
                if (blacklistedUsers[i] == user2) {
                    blacklistedUsers.splice(i, 1);
                    //console.log("2: " + blacklistedUsers);
                }
                //  }

                console.log("chi " + blacklistedUsers);

                //console.log("3: " + blacklistedUsers);

                //console.log("4: " + blacklist);

                blacklist[message.guild.id] = {
                    blacklistedID: blacklistedUsers
                };

                //console.log("5: " + blacklist);

                fs.writeFile("./blacklist.json", JSON.stringify(blacklist), (err) => {
                    if (err) console.log(err);
                });
            }
            //});
        }*/
    },
};