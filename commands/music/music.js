const ytdl = require('ytdl-core');

const { YTSearcher } = require('ytsearcher');
const YouTube = require('simple-youtube-api');
const youtube = new YouTube(process.env.YOUTUBEKEY);

const searcher = new YTSearcher({
    key: process.env.YOUTUBEKEY,
    revealKey: true
});

const queue = new Map();

module.exports = {
    name: 'music',
    desc: 'Music commands',
    dir: 'music',
    args: true,
    usage: "<play|stop|skip|pause|resume> <*link|*search terms>\n*Only needed if you've used play.",
    guildOnly: true,
    async execute(message, args) {

        let serverQueue = queue.get(message.guild.id);
        const command = args.shift().toLowerCase();

        switch (command) {
            case 'play':
                execute();
                break;
            case 'stop':
                stop();
                break;
            case 'skip':
                skip();
                break;
            case 'pause':
                pause();
                break;
            case 'resume':
                resume();
                break;
            case 'loop':
                loop();
                break;
            default:
                message.channel.send("There is no such command!");
        }

        async function execute() {
            let vc = message.member.voice.channel;
            if (!vc) {
                return message.channel.send("Please join a voice chat first!");
            } else {
                let songs = [];
                let result = await searcher.search(args.join(" "), { type: "video" });
                try {
                    const songInfo = await ytdl.getInfo(result.first.url);
                    songs = [{
                        title: songInfo.videoDetails.title,
                        url: songInfo.videoDetails.video_url
                    }];
                } catch (e) {
                    try {
                        result = await searcher.search(args.join(" "), { type: "playlist" });
                        const playList = await youtube.getPlaylist(result.first.url);
                        const songList = await playList.getVideos();

                        for(let i = 0; i < songList.length; i++){
                            songs.push({title: songList[i].title, url: songList[i].url});
                        }

                        songList.forEach(async(elem) => {
                            const song = await elem.fetch();
                            songs.push({
                                title: song.title,
                                url: song.url
                            })
                        })
                    } catch (e) {
                        console.log(e);
                        return message.channel.send("I can't find that on youtube, maybe it's not allowed on discord!");
                    }
                }

                if (!serverQueue) {
                    const queueConstructor = {
                        txtChannel: message.channel,
                        vChannel: vc,
                        connection: null,
                        songs: [],
                        volume: 5,
                        playing: true,
                        loop: false
                    };
                    queue.set(message.guild.id, queueConstructor);
                    serverQueue = queue.get(message.guild.id);

                    songs.forEach(es => serverQueue.songs.push(es));

                    try {
                        let connection = await vc.join();
                        serverQueue.connection = connection;
                        play(serverQueue.songs[0]);
                    } catch (err) {
                        console.error(err);
                        queue.delete(message.guild.id);
                        return message.channel.send(`Unable to join the voice chat ${err}`);
                    }
                } else {
                    if (serverQueue.vChannel !== vc)
                        return message.channel.send("I'm on another voice chat!");
                    serverQueue.songs.push(song);
                    return message.channel.send(`The song has been added ${song.url}`);
                }
            }
        }
        async function play(song) {
            if (!song) {
                serverQueue.vChannel.leave();
                queue.delete(message.guild.id);
                return;
            }
            const dispatcher = serverQueue.connection
                .play(ytdl(song.url), { bitrate: 128000 })
                .on('finish', () => {
                    if (!serverQueue.loop) serverQueue.songs.shift();
                    play(serverQueue.songs[0]);
                })
                .on("error", error => console.error(error));
            dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
            serverQueue.txtChannel.send(`Now playing ${serverQueue.songs[0].url}`);
        }
        async function stop() {
            if (!message.member.voice.channel)
                return message.channel.send("You need to join the voice chat first!");
            if (!serverQueue)
                return message.channel.send("There is nothing to stop!");
            if (message.member.voice.channel !== serverQueue.vChannel)
                return message.channel.send("I'm on another voice chat!");
            serverQueue.songs = [];
            serverQueue.connection.dispatcher.end();
            return message.channel.send("This session has been **stopped**! I'm leaving.");
        }
        async function skip() {
            if (!message.member.voice.channel)
                return message.channel.send("You need to join the voice chat first!");
            if (!serverQueue)
                return message.channel.send("There is nothing to skip!");
            if (message.member.voice.channel !== serverQueue.vChannel)
                return message.channel.send("I'm on another voice chat!");
            serverQueue.connection.dispatcher.end();
            if (serverQueue.loop) return message.channel.send("The song is on a loop so it started **again**!");
            return message.channel.send("The song has been **skipped**!");
        }
        async function pause() {
            if (!message.member.voice.channel)
                return message.channel.send("You need to join the voice chat first!");
            if (!serverQueue)
                return message.channel.send("There is nothing to skip!");
            if (message.member.voice.channel !== serverQueue.vChannel)
                return message.channel.send("I'm on another voice chat!");
            if (serverQueue.connection.dispatcher.paused)
                return message.channel.send("The song is already paused!");
            serverQueue.connection.dispatcher.pause();
            return message.channel.send("The song has been **paused**!");
        }
        async function resume() {
            if (!message.member.voice.channel)
                return message.channel.send("You need to join the voice chat first!");
            if (!serverQueue)
                return message.channel.send("There is nothing to skip!");
            if (message.member.voice.channel !== serverQueue.vChannel)
                return message.channel.send("I'm on another voice chat!");
            if (serverQueue.connection.dispatcher.resumed)
                return message.channel.send("The song is already playing!");
            serverQueue.connection.dispatcher.resume();
            return message.channel.send("The song has been **resumed**!");
        }
        async function loop() {
            if (!message.member.voice.channel)
                return message.channel.send("You need to join the voice chat first!");
            if (!serverQueue)
                return message.channel.send("There is nothing to loop!");
            if (message.member.voice.channel !== serverQueue.vChannel)
                return message.channel.send("I'm on another voice chat!");
            serverQueue.loop = !serverQueue.loop;
            return message.channel.send(`Loop for ${serverQueue.songs[0].title} is now ${serverQueue.loop ? '**enabled**' : '**disabled**'}`);
        }
    }
}