module.exports = {
    name: 'args-info',
    description: 'Gets you your args info! (Debug)',
    args: true,
    usage: "<arguments>",
    category: "debug",
    execute(message, args) {
        if (args[0] === "foo") {
            return message.channel.send('bar');
        }

        message.channel.send(`Arguments: ${args}\nArguments length: ${args.length}`);
    },
};