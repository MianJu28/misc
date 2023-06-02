const axios = require("axios")
const FormData = require('form-data')
const URL = 'https://music.ghxi.com/wp-admin/admin-ajax.php'
const config = {
    headers: {
        'origin': 'https://music.ghxi.com',
        'referer': 'https://music.ghxi.com'
    }
}
async function isAuth() {
    const data = new FormData()
    data.append('action', 'gh_music_ajax')
    data.append('type', 'isauth')
    const res = (await axios.post(URL, data, config))
    if (res.data.code !== 200) {
        config.headers.cookie = res.headers['set-cookie'][0].substring(0, 36)
        const newdata = new FormData()
        newdata.append('action', 'gh_music_ajax')
        newdata.append('type', 'postAuth')
        newdata.append('code', 'ghyynb')
        await axios.post(URL, newdata, config)
    }
}
async function search(query, page = 1, type) {
    await isAuth()
    if (type === 'music') {
        const data = new FormData()
        data.append('action', 'gh_music_ajax')
        data.append('type', 'search')
        data.append('music_type', 'qq')
        data.append('search_word', query)
        const res = (await axios.post(URL, data, config))
        const searchResults = []
        for (let music of res.data.data) {
            searchResults.push({
                id: music.songid,
                title: music.songname,
                artist: music.singer,
                album: music.albumname,
                artwork: music.album_img,
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
}
async function getMediaSource(music) {
    let size = music.sizeflac === 1 ? 'flac' : music.size320 === 1 ? '320': '128'
    await isAuth()
    const data = {
        'action': 'gh_music_ajax',
        'type': 'getMusicUrl',
        'music_type': 'qq',
        'music_size': size,
        'songid': music.songid
    }
    const res = (await axios.post(URL, data, config))
    return {url: res.data.url}
}
module.exports = {
    platform: "ghqq", // [必选] 插件名，搜索到的结果都会自动带上platform的标记
    cacheControl: "no-cache", // [可选] 插件的缓存控制方案，用来缓存插件信息
    version: "0.1.5", // [可选] 插件版本号
    defaultSearchType: "music", // [可选] 插件在搜索时，首屏默认请求的搜索类型，默认是music。
    srcUrl: "https://raw.githubusercontent.com/MianJu28/misc/main/musicfree/ghqq.js",
    search,
    getMediaSource
}
