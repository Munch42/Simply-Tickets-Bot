const prefixes = require("../prefixes.json");
const Discord = require("discord.js");
const settings = require("../customSettings.json");
const config = require("../config.json");

module.exports = {
    name: 'help',
    description: 'Lists all of my commands or info about a specific command!',
    aliases: ["commands", "info", "i"],
    usage: "[command name]",
    cooldown: 5,
    category: "utils",
    execute(message, args) {
        let customRole = false;

        if (message.channel.type != "dm") {
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

                message.channel.send(embed);

                return;
            }
        }

        const data = [];
        const { commands } = message.client;

        let id = "";

        if (message.channel.type != "dm") {
            id = message.guild.id;
        }

        const capitalize = (s) => {
            if (typeof s !== 'string') return '';
            return s.charAt(0).toUpperCase() + s.slice(1);
        }

        const categoriesDuplicates = commands.map(command => command.category);

        const categories = Array.from(new Set(categoriesDuplicates));

        // Specify here any categories that you don't want to show up in the help command.
        const secretCategories = ["debug"];

        secretCategories.forEach(categ => {
            for (let i = 0; i < categories.length; i++) {
                if (categories[i].toLowerCase() == categ.toLowerCase()) {
                    categories.splice(i, 1);
                }
            }
        });

        if (!args.length) {
            const embed = new Discord.MessageEmbed()
                .setTimestamp()
                .setTitle("Command Categories")
                .setAuthor("Simply Tickets", "https://munch42.github.io/img/SimpleTicketsImage.jpg")
                .setFooter("Tickets what a wonderful concept!")
                .setColor("#e68525");

            for (i = 0; i < categories.length; i++) {
                let name = capitalize(categories[i]);

                if (message.channel.type == "dm") {
                    embed.addField(`${name}`, `\`${config.prefix}help ${categories[i]}\``, true)
                } else {
                    embed.addField(`${name}`, `\`${prefixes[id].prefix}help ${categories[i]}\``, true)
                }
            }

            return message.channel.send(embed);
        }

        const name = args[0].toLowerCase();

        if (categories.includes(name)) {
            data.push(`Here's a list of all my commands within the \`${name}\` category:`);
            data.push(commands.filter(command => command.category.toLowerCase() === name.toLowerCase()).map(command => `\`${command.name}\``).join(", "));
            if (message.channel.type == "dm") {
                data.push(`\nYou can send \`${config.prefix}help [command name]\` to get info on a specific command!`);
            } else {
                data.push(`\nYou can send \`${prefixes[id].prefix}help [command name]\` to get info on a specific command!`);
            }

            return message.author.send(data, { split: true })
                .then(() => {
                    if (message.channel.type === "dm") return;
                    message.reply(`I've sent you a DM with all my commands within the \`${name}\` category!`);
                })
                .catch(error => {
                    console.error(`Could not send help DM to ${message.author.tag}. \n`, error);
                    message.reply("it seems like I can't DM you! Do you have DMs disabled?");
                });
        }

        const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

        if (!command) {
            return message.reply("that's not a valid command or category! Are you sure you typed it right?");
        }

        data.push(`**Name:** ${command.name}`);
        data.push(`**Category:** ${command.category}`);

        if (command.aliases) data.push(`**Aliases:** ${command.aliases.join(", ")}`);
        if (command.description) data.push(`**Description:** ${command.description}`);

        if (message.channel.type == "dm") {
            if (command.usage) data.push(`**Usage:** ${config.prefix}${command.name} ${command.usage}`);
        } else {
            if (command.usage) data.push(`**Usage:** ${prefixes[id].prefix}${command.name} ${command.usage}`);
        }

        data.push(`**Cooldown:** ${command.cooldown || 3} second(s)`);

        if (command.guildOnly) {
            let guildOnlySetting = command.guildOnly;

            if (guildOnlySetting) {
                guildOnlySetting = "True";
            } else {
                guildOnlySetting = "False";
            }

            data.push(`**Guild Only:** ${guildOnlySetting}`);
        }

        if (command.disabled) {
            let disabled = command.disabled;

            if (disabled) {
                disabled = "True";
            } else {
                disabled = "False";
            }

            data.push(`**Disabled:** ${disabled}`);
        }

        message.channel.send(data, { split: true });
    },
};