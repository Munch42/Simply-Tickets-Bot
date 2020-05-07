const fs = require("fs");
const Discord = require("discord.js");
const config = require("./config.json");
const basePrefix = config.prefix;
const prefixes = require("./prefixes.json");
const blacklist = require("./blacklist.json");
const settings = require("./customSettings.json");
//const xp = require("./xp.json");
const client = new Discord.Client();

const escapeRegex = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync("./commands").filter((file) => file.endsWith(".js"));

const cooldowns = new Discord.Collection();

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);

  // set a new item in the Collection
  // with the key as the command name and the value as the exported module
  client.commands.set(command.name, command);
}

function getMinutesBetweenDates(startDate, endDate) {
  var diff = endDate.getTime() - startDate.getTime();
  return diff / 60000;
}

client.once("ready", () => {
  // Removed | ${client.guilds.cache.size} Servers
  client.user.setActivity(`?help | ?invite`, { type: "PLAYING", });
  console.log("Ready!");
});

// To ping someone with their id use <@!ID>
// To check if it only has the content use === otherwise for if it can have anything else use .startsWith

client.on("message", async (message) => {
  if (message.author.bot) return;

  if (message.channel.type == "dm") {
    const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(basePrefix)})\\s*`);
    if (!prefixRegex.test(message.content)) return;

    const [, matchedPrefix] = message.content.match(prefixRegex);

    const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName) || client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;

    if (command.disabled) {
      return message.reply("This command is currently disabled!");
    }

    if (command.guildOnly && message.channel.type !== "text") {
      return message.reply("I can't execute that command inside DMs!");
    }

    if (command.args && !args.length) {
      let reply = `You didn't provide any arguments, ${message.author}`;

      if (command.usage) {
        reply += `\nThe proper usage would be: \`${prefixes[id].prefix}${command.name} ${command.usage}\``;
      }

      return message.channel.send(reply);
    }

    if (!cooldowns.has(command.name)) {
      cooldowns.set(command.name, new Discord.Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;

    if (timestamps.has(message.author.id)) {
      const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

      if (now < expirationTime) {
        const timeLeft = (expirationTime - now) / 1000;
        return message.reply(
          `please wait ${timeLeft.toFixed(1)} more seconds before reusing the \`${
          command.name
          }\` command.`
        );
      }
    }

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    try {
      command.execute(message, args);
    } catch (error) {
      console.error(error);
      message.reply(
        "there was an error trying to execute that command. Please contact the developers here: https://discord.gg/2jNmctR."
      );
    }
  } else {
    if (!blacklist[message.guild.id]) {
      blacklist[message.guild.id] = {
        blacklistedID: []
      };

      fs.writeFile("./blacklist.json", JSON.stringify(blacklist), (err) => {
        if (err) console.log(err);
      });
    }

    if (blacklist[message.guild.id].blacklistedID.includes(message.author.id)) {
      const blacklisted = new Discord.MessageEmbed()
        .setTimestamp()
        .setAuthor("Simply Tickets", "https://munch42.github.io/img/SimpleTicketsImage.jpg")
        .setDescription(`You are blacklisted and cannot execute any of my commands!`)
        .setFooter("Blacklisted")
        .setColor("#e68525");

      return message.channel.send(blacklisted);
    }

    const id = message.guild.id;

    /*if (!xp[id]) {
      xp[id] = {
        xp: 10,
        level: 1,
        lasttime: new Date(),
      };
    }*/

    if (!settings[id]) {
      settings[id] = {
        openMessage: "Dear %user%, \n\n Thanks for reaching out to support! We will be with you shortly. \n\n While you are waiting, please describe your question(s) below.",
        category: undefined,
        logChannel: undefined,
        supportRoleID: undefined,
        namingScheme: "ticket-%ticketCount%",
        transcriptChannel: undefined
      };

      fs.writeFile("./customSettings.json", JSON.stringify(settings), (err) => {
        if (err) console.log(err);
      });
    }

    if (!prefixes[id]) {
      prefixes[id] = {
        prefix: basePrefix
      };

      fs.writeFile("./prefixes.json", JSON.stringify(prefixes), (err) => {
        if (err) console.log(err);
      });
    }

    /*fs.writeFile("./xp.json", JSON.stringify(xp), (err) => {
      if (err) console.log(err);
    });*/

    const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(basePrefix)}|${escapeRegex(prefixes[id].prefix)})\\s*`);
    if (!prefixRegex.test(message.content)) return;

    const [, matchedPrefix] = message.content.match(prefixRegex);

    const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName) || client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;

    if (command.disabled) {
      return message.reply("This command is currently disabled!");
    }

    if (command.guildOnly && message.channel.type !== "text") {
      return message.reply("I can't execute that command inside DMs!");
    }

    if (command.args && !args.length) {
      let reply = `You didn't provide any arguments, ${message.author}`;

      if (command.usage) {
        reply += `\nThe proper usage would be: \`${prefixes[id].prefix}${command.name} ${command.usage}\``;
      }

      return message.channel.send(reply);
    }

    if (!cooldowns.has(command.name)) {
      cooldowns.set(command.name, new Discord.Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;

    if (timestamps.has(message.author.id)) {
      const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

      if (now < expirationTime) {
        const timeLeft = (expirationTime - now) / 1000;
        return message.reply(
          `please wait ${timeLeft.toFixed(1)} more seconds before reusing the \`${
          command.name
          }\` command.`
        );
      }
    }

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    try {
      command.execute(message, args);
    } catch (error) {
      console.error(error);
      message.reply(
        "there was an error trying to execute that command. Please contact the developers here: https://discord.gg/2jNmctR."
      );
    }
  }
});

client.login(config.token);
