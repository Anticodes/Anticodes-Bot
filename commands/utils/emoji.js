module.exports = {
    name: 'emoji',
    description: 'Displays all emojis in a server.',
    dir: 'utils',
    args: false,
    usage: '<server id>',
    async execute (message, args){
        if(message.author.id !== process.env.DEVID) return;
        if(!args.length) return message.client.emojis.cache.forEach(emoji => console.log(emoji.animated ? '<a:' + emoji.name + ':' + emoji.id + '>' : '<:' + emoji.name + ':' + emoji.id + '>'));
        return message.client.guilds.cache.get(args[0]).emojis.cache.forEach(emoji => console.log(emoji.animated ? '<a:' + emoji.name + ':' + emoji.id + '>' : '<:' + emoji.name + ':' + emoji.id + '>'));
    }
}