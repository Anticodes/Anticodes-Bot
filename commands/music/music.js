const ytdl = require('ytdl-core-discord');

const YouTube = require('simple-youtube-api');
const youtube = new YouTube(process.env.YOUTUBEKEY);

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
                execute(serverQueue);
                break;
            case 'stop':
                stop(serverQueue);
                break;
            case 'skip':
                skip(serverQueue);
                break;
            case 'pause':
                pause(serverQueue);
                break;
            case 'resume':
                resume(serverQueue);
                break;
            case 'loop':
                loop(serverQueue);
                break;
            case 'queue':
                queueCmd(serverQueue);
                break;
            default:
                message.channel.send("There is no such command!");
        }

        async function execute() {
            let vc = message.member.voice.channel;
            if (!vc) {
                return message.channel.send("Please join a voice chat first!");
            } else {
                if (!serverQueue) {
                    const queueConstructor = {
                        txtChannel: message.channel,
                        vChannel: vc,
                        connection: null,
                        songs: [],
                        volume: 5,
                        playing: false,
                        loop: false
                    };
                    queue.set(message.guild.id, queueConstructor);
                    serverQueue = queue.get(message.guild.id);
                } else if (serverQueue.vChannel !== vc)
                    return message.channel.send("I'm on another voice chat!");
                const query = args.join(" ").toString();
                if (query.match(/^https:\/\/www\.youtube\.com\/.*\?.*\blist=.*$/)) {
                    try {
                        const playList = await youtube.getPlaylist(query);
                        const songList = await playList.getVideos();

                        for (let i = 0; i < songList.length; i++) {
                            serverQueue.songs.push({ title: songList[i].title, url: `https://youtu.be/${songList[i].id}` });
                        }

                        queue.set(message.guild.id, serverQueue);

                        message.channel.send(`Playlist **${playList.title}** has been added to the queue!`);
                    } catch (e) {
                        console.log(e);
                        return message.channel.send("I can't find that on youtube, maybe it's not allowed on discord!");
                    }
                } else {
                    try {
                        const result = query.match(/^(http(s)?:\/\/)?((w){3}.)?youtu(be|.be)?(\.com)?\/.+/) ? [await youtube.getVideo(query)] : await youtube.searchVideos(query, 1);
                        if (result.length < 1) throw "";
                        serverQueue.songs.push({
                            title: result[0].title,
                            url: `https://youtu.be/${result[0].id}`
                        });
                        message.channel.send(`Song **${result[0].title}** has been added to the queue!`);
                    } catch (e) {
                        console.log(e);
                        return message.channel.send("I can't find that on youtube, maybe it's not allowed on discord!");
                    }
                }
                try {
                    if (!serverQueue.connection || !serverQueue.playing) {
                        let connection = await vc.join();
                        serverQueue.connection = connection;
                        play(serverQueue.songs[0]);
                    }
                } catch (err) {
                    console.error(err);
                    queue.delete(message.guild.id);
                    return message.channel.send(`Unable to join the voice chat ${err}`);
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
                .play(await ytdl(song.url), { type: "opus" })
                .on('finish', () => {
                    if (!serverQueue.loop) serverQueue.songs.shift();
                    play(serverQueue.songs[0]);
                })
                .on("error", error => console.error(error));
            serverQueue.playing = true;
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
        async function queueCmd(){
            if (!message.member.voice.channel)
                return message.channel.send("You need to join the voice chat first!");
            if(!serverQueue)
                return message.channel.send("Queue is empty!");
            if (message.member.voice.channel !== serverQueue.vChannel)
                return message.channel.send("I'm on another voice chat!");
            const queueEmbed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Queue')
            .setDescription(serverQueue.songs.map((song, index) => `${index+1}. ${song.title}\n`));
            return message.channel.send(queueEmbed)
        }
    }
}