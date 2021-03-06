const { DiscordAPIError } = require('discord.js');
const { MessageEmbed } = require('discord.js');

module.exports = { 
    name: 'lb',
    async execute(message, args) {
        
        const { getBeatmap_Id, twoDecimals, craftAccuracy, numberBeautify, craftMods } = require('../auxiliary.js');
        const { api_key, cookie } = require('../config.json');
        const paginationEmbed = require('discord.js-pagination');

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

        if (args[2] !== 0) {
            if (flag) {
                url += "&";
            } else {
                url += "?";
            }
            for (let i = 1; i < args[2].length; i += 2) {
                let osuMod = (args[2][i] + args[2][i + 1]).toUpperCase();
                if (i !== 1) {
                    url += "&";
                }
                url += `mods[]=${osuMod}`;
            }
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
                icon_url: `https://a.ppy.sh/${beatmap.creator_id}`,
            },      
        }

        const emoji_array = ['ossh', 'oss', 'osh', 'os', 'oa', 'ob', 'oc', 'od'];
        const emoji_map = new Map();
        emoji_map.set('XH', 0);
        emoji_map.set('X', 1);
        emoji_map.set('SH', 2);
        emoji_map.set('S', 3);
        emoji_map.set('A', 4);
        emoji_map.set('B', 5);
        emoji_map.set('C', 6);
        emoji_map.set('D', 7);

        const pages = [];

        for (let j = 0; j < Math.min(50, json.scores.length); j += 5) {
            for (let i = j; i < Math.min(j + 5, json.scores.length); i++) {
                listing.fields[0].value += `**${i + 1}.** ${client.emojis.cache.find(emoji => emoji.name === emoji_array[emoji_map.get(json.scores[i].rank)])} **[${json.scores[i].user.username}](https://osu.ppy.sh/users/${json.scores[i].user.id}/)**: ${numberBeautify(json.scores[i].score)} [ **${json.scores[i].max_combo}x**/${beatmap.max_combo}x ] ${craftMods(json.scores[i].mods)} \n - **${twoDecimals(json.scores[i].pp)}pp** ~ ${craftAccuracy(json.scores[i].accuracy)}`;
                listing.fields[0].value += ` \u25b8 [${json.scores[i].statistics.count_300}/${json.scores[i].statistics.count_100}/${json.scores[i].statistics.count_50}/${json.scores[i].statistics.count_miss}] ~ ${json.scores[i].created_at.slice(0, 10)}\n`;
            }
            const tempEmbed = new MessageEmbed(listing);
            pages.push(tempEmbed);
            listing.fields[0].value = ``;

        }
        
        paginationEmbed(message, pages);
    }
}