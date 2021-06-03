module.exports = {
    name: 'ping',
    desc: 'Shows the delay of connection.',
    dir: 'moderation',
    args: false,
    guildOnly: true,
    async execute (message, args){
        message.channel.send(`Ping of the bot is: ${message.client.ws.ping}ms.`);
    }
}