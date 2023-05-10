const axios = require("axios")

async function search(query, page = 1, type) {
    // 三个参数分别为: 查询的keyword，当前页码，搜索类型
    if (type === 'music') {
        // https://steria.vplayer.tk/api/musics/连名带姓/1
        const data = (await axios.get('https://steria.vplayer.tk/api/musics/' + query + '/' + page)).data
        const searchResults = []
        const total = data.total
        for (let music of data.data) {
            searchResults.push({
                id: music.id,
                title: music.name,
                artist: '薇Steria',
                artwork: 'https://steria.vplayer.tk/static/images/steria.jpg',
                url: music.url
            })
        }
        return {
            isEnd: page * 10 >= total,
            data: searchResults
        }
    }
    return {
        isEnd: true, // 分页请求是否结束
        data: [], // 不同type媒体类型的列表，即MusicItem[] | AlbumItem[] | ArtistItem[]
    };
}

module.exports = {
    platform: "薇Steria", // [必选] 插件名，搜索到的结果都会自动带上platform的标记
    cacheControl: "cache", // [可选] 插件的缓存控制方案，用来缓存插件信息
    version: "0.1.2", // [可选] 插件版本号
    defaultSearchType: "music", // [可选] 插件在搜索时，首屏默认请求的搜索类型，默认是music。
    srcUrl: "https://raw.githubusercontent.com/MianJu28/misc/main/musicfree/steria.js",
    /**[可选] 搜索 */
    search,
    async getTopLists(){
        const data = (await axios.get('https://steria.vplayer.tk/api/tops')).data
        const tops = []
        for (let top of data) {
            tops.push({
                id: top.id,
                description: '直播歌切',
                coverImg: 'https://steria.vplayer.tk/static/images/steria.jpg',
                title: top.title
            })
        }
        return [{
            title: "直播歌切",
            data: tops
        }]
    },
    async getTopListDetail(topListItem){
        const data = (await axios.get('https://steria.vplayer.tk/api/tops/' + topListItem.title)).data
        const musics = []
        for (let music of data.data) {
            musics.push({
                id: music.id,
                title: music.name,
                artist: '薇Steria',
                artwork: 'https://steria.vplayer.tk/static/images/steria.jpg',
                url: music.url
            })
        }
        return {
            id: topListItem.id,
            title: topListItem.title,
            description: topListItem.description,
            coverImg: topListItem.coverImg,
            musicList: musics
        }
    }
}
