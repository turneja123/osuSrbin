const fs = require('fs');
const Discord = require('discord.js');
global.fetch = require('node-fetch');
global.client = new Discord.Client();
const { prefix, token, api_key } = require('./config.json');
const { lb } = require('./commands/lb.js');


client.once('ready', () => {
	console.log('Ready!');
});

client.login(token);

client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands');

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

client.on('message', async message => {
	console.log(message.content);
    const msg = message.content.split(" ");

    if (msg[0] === `${prefix}osu`) {
        let json = await fetch(`https://osu.ppy.sh/api/get_user?k=${api_key}&u=${msg[1]}`).then(response => response.text());
        json = json.substring(1);
        json = json.slice(0, -1);
        const obj = JSON.parse(json);
		message.channel.send(obj.user_id);
    }

    if (msg[0] === `${prefix}lb`) {
        args = [msg[1], 0, 0];
        if (msg.length > 2) {
            args[2] = msg[2];
        }
        client.commands.get("lb").execute(message, args);
    }

    if (msg[0] === `${prefix}country`) {
        args = [msg[1], 1, 0];
        if (msg.length > 2) {
            args[2] = msg[2];
        }
        client.commands.get("lb").execute(message, args);
    }
})
