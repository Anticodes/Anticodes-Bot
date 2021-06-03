const fetch = require('node-fetch');

module.exports = {
    name: 'gif',
    aliases: ['meme'],
    desc: 'Shows gifs from famous gif search engine Tenor.',
    dir: 'fun',
    args: true,
    usage: '<search terms>',
    guildOnly: true,
    async execute (message, args) {
        let keywords = "random";
        if(args.length > 0){
            keywords = args.join(" ");
        }
        let url = `https://api.tenor.com/v1/search?q=${keywords}&key=${process.env.TENORKEY}&contentfilter=high`;
        let response = await fetch(url);
        let json = await response.json();
        const index = Math.floor(Math.random() * json.results.length);
        message.channel.send(json.results[index].url);
    }
}