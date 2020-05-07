const { invite } = require("../config.json");

module.exports = {
    name: 'invite',
    description: "DM's you the invite link for the bot.",
    category: "utils",
    aliases: ["invi", "vite", "inv"],
    execute(message, args) {
        return message.author.send(`My invite link is ${invite} !`, { split: true })
            .then(() => {
                if (message.channel.type === "dm") return;
                message.reply(`I've sent you a DM with my invite link!`);
            })
            .catch(error => {
                console.error(`Could not send invite DM to ${message.author.tag}. \n`, error);
                message.reply("it seems like I can't DM you! Do you have DMs disabled?");
            });
    },
};