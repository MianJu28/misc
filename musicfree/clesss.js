const axios = require("axios")
const cheerio = require('cheerio')

module.exports = {
    platform: "ClessS", // [必选] 插件名，搜索到的结果都会自动带上platform的标记
    cacheControl: "cache", // [可选] 插件的缓存控制方案，用来缓存插件信息
    version: "0.1.4", // [可选] 插件版本号
    defaultSearchType: "music", // [可选] 插件在搜索时，首屏默认请求的搜索类型，默认是music。
    srcUrl: "https://raw.githubusercontent.com/MianJu28/misc/main/musicfree/clesss.js",
    /**[可选] 搜索 */
    async getTopLists(){
        return [{
            title: "克勾播放器",
            data: [{
                id: 114514,
                description: '克勾播放器',
                coverImg: 'https://steria.vplayer.tk/static/images/steria.jpg',
                title: '克勾播放器'
            }]
        }]
    },
    async getTopListDetail(topListItem){
        const rawHtml = (await axios.get('http://clesss.xwbx.ink/audio/player.html')).data
        const musicList = []
        const $ = cheerio.load(rawHtml)
        const musics = JSON.parse($('#data').text())
        // let id = 1
        for (let i = 0; i < 500; i++) {
            musicList.push({
                id: i,
                title: musics[i],
                artist: '内德维德',
                artwork: 'https://steria.vplayer.tk/static/images/steria.jpg',
                url: 'http://clesss.xwbx.ink/audio/' + musics[i]
            })
        }
        // for (let music of musics) {
        //     musics.push({
        //         id: id,
        //         title: music,
        //         artist: '内德维德',
        //         artwork: 'https://steria.vplayer.tk/static/images/steria.jpg',
        //         url: 'http://clesss.xwbx.ink/audio/' + music
        //     })
        //     id++
        // }
        return {
            id: topListItem.id,
            title: topListItem.title,
            description: topListItem.description,
            coverImg: topListItem.coverImg,
            musicList: musicList
        }
    }
}
