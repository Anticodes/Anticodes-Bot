module.exports = {
    name: 'attach',
    desc: 'Secret Command',
    dir: 'utils',
    isAttached: false,
    channel: null,
    userdm: null,
    args: false,
    async execute (message, args){
        if(message.author.id !== process.env.DEVID) return;
        if(this.isAttached){
            this.isAttached=false;
            return this.userdm.send("Attach removed successfully!");
        }
        let channelID = args.shift();
        this.channel = message.client.channels.cache.get(channelID);
        this.userdm = message.channel;
        this.isAttached = true;
        return message.channel.send("Attached successfully!");
    },
    async talk (message){
        if(this.isAttached){
            if(this.channel === message.channel)this.userdm.send(message.author.username + ": " + message.content);
            else if(this.userdm === message.channel)this.channel.send(message.content);
        } 
    }
}