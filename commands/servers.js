module.exports = {
    name: 'servers',
    description: 'Lists how many servers the bot is in. Munch42 Only.',
    cooldown: 0.1,
    aliases: ["srv", "listservers", "totalservers"],
    category: "debug",
    execute(message, args) {
        if (message.author.id !== "370345007317516289") {
            return message.reply("You cannot perform this command. You must be Munch42 to perform the command.");
        }

        return message.channel.send(`I am in: ${message.client.guilds.cache.size} Servers`);
    },
};