module.exports = {
	name: 'ping',
	description: 'Pong!',
	cooldown: 5,
	category: "fun",
	execute(message, args) {
		message.channel.send('Pong!');
	},
};