module.exports = { 
    name: 'lb',
    async execute(message, args) {
        
        const { getBeatmap_Id, twoDecimals, craftAccuracy, numberBeautify, craftMods } = require('../auxiliary.js');
        const { api_key, cookie } = require('../config.json');

        var myHeaders = new fetch.Headers();
        myHeaders.append("Cookie", cookie);

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        let beatmap_id = getBeatmap_Id(args[0]);
        let flag = args[1];

        let url = `https://osu.ppy.sh/beatmaps/${beatmap_id}/scores`;
        if (flag) {
            url += "?type=country";
        }
        let json = await fetch(url, requestOptions).then(response => response.json());

        let jsonbeatmap = await fetch(`https://osu.ppy.sh/api/get_beatmaps?k=${api_key}&b=${beatmap_id}`).then(response => response.text());
        jsonbeatmap = jsonbeatmap.substring(1);
        jsonbeatmap = jsonbeatmap.slice(0, -1);
        const beatmap = JSON.parse(jsonbeatmap);

        const listing = {

            color: 0x0099ff,
            url: `https://osu.ppy.sh/beatmaps/${beatmap_id}`,
            author: {
                name: `${beatmap.artist} - ${beatmap.title} [${beatmap.version}] [${twoDecimals(beatmap.difficultyrating)}\u2605]`,
                icon_url: message.author.avatarURL(),
                url: `https://osu.ppy.sh/beatmaps/${beatmap_id}`,
            },
            thumbnail: {
                url: `https://assets.ppy.sh/beatmaps/${beatmap.beatmapset_id}/covers/cover.jpg`,
            },
            fields: [
                {
                    name: '---------------------------------------------------------------------------',
                    value: '',
                    inline: false,
                },
            ],
            timestamp: new Date(),
            footer: {
                text: `Map by ${beatmap.creator}`,
                icon_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Osu%21Logo_%282015%29.png/600px-Osu%21Logo_%282015%29.png',
            },
        }
        for (let i = 0; i < 5; i++) {
            listing.fields[0].value += `**${i + 1}.** **[${json.scores[i].user.username}](https://osu.ppy.sh/users/${json.scores[i].user.username}/)**: ${numberBeautify(json.scores[i].score)} [ **${json.scores[i].max_combo}x**/${beatmap.max_combo}x ] ${craftMods(json.scores[i].mods)} \n - **${twoDecimals(json.scores[i].pp)}pp** ~ ${craftAccuracy(json.scores[i].accuracy)} ~ date \n`;
        }
        message.channel.send({ embed: listing });
    }
}