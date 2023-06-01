const axios = require("axios")

module.exports = {
    platform: "ghqq", // [必选] 插件名，搜索到的结果都会自动带上platform的标记
    cacheControl: "no-cache", // [可选] 插件的缓存控制方案，用来缓存插件信息
    version: "0.1.0", // [可选] 插件版本号
    defaultSearchType: "music", // [可选] 插件在搜索时，首屏默认请求的搜索类型，默认是music。
    srcUrl: "https://raw.githubusercontent.com/MianJu28/misc/main/musicfree/ghqq.js",
    async search(query, page = 1, type) {
        // 三个参数分别为: 查询的keyword，当前页码，搜索类型
        if (type === 'music') {
            // https://steria.vplayer.tk/api/musics/连名带姓/1
            const data = (await axios.get('https://steria.vplayer.tk/ghyy/search/qq/' + query)).data
            const searchResults = []
            for (let music of data.data) {
                searchResults.push({
                    id: music.songid,
                    title: music.songname,
                    artist: music.singer,
                    album: music.albumname,
                    artwork: music.album_img,
                    url: music.url,
                    size128: music.size128,
                    size320: music.size320,
                    sizeflac: music.sizeflac
                })
            }
            return {
                isEnd: true,
                data: searchResults
            }
        }
        return {
            isEnd: true, // 分页请求是否结束
            data: [], // 不同type媒体类型的列表，即MusicItem[] | AlbumItem[] | ArtistItem[]
        };
    },
    async getMediaSource(music, quality) {
        switch (quality) {
            case 'high':
                const data = (await axios.get('https://steria.vplayer.tk/ghyy/song/qq/320?songId=' + music.id)).data
                return {url: data.url}
            case 'super':
                const data = (await axios.get('https://steria.vplayer.tk/ghyy/song/qq/flac?songId=' + music.id)).data
                return {url: data.url}
            default:
                const data = (await axios.get('https://steria.vplayer.tk/ghyy/song/qq/128?songId=' + music.id)).data
                return {url: data.url}
        }
    }
}
