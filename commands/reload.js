module.exports = {
    name: 'reload',
    description: 'Reloads a command. Munch42 Only.',
    cooldown: 0,
    aliases: ["rel", "rl"],
    usage: "<command-name>",
    args: true,
    category: "debug",
    execute(message, args) {
        if (message.author.id !== "370345007317516289") {
            return message.reply("You cannot perform this command. You must be Munch42 to perform the command.");
        }
        const commandName = args[0].toLowerCase();
        const command = message.client.commands.get(commandName) || message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

        if (!command) return message.channel.send(`There is no command with the name or alias \`${commandName}\`, ${message.author.name}!`);

        delete require.cache[require.resolve(`./${command.name}.js`)];

        try {
            const newCommand = require(`./${command.name}.js`);
            message.client.commands.set(newCommand.name, newCommand);
            message.channel.send(`Command \`${command.name}\` was reloaded!`);
        } catch (error) {
            console.log(error);
            message.channel.send(`There was an error reloading a command \`${commandName}\`:\n\`${error.message}\``);
        }
    },
};