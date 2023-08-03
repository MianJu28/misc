"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const headers = {
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Safari/537.36 Edg/89.0.774.63",
    accept: "*/*",
    "accept-encoding": "gzip, deflate, br",
    "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
};
async function getCid(bvid, aid) {
    const params = bvid
        ? {
            bvid: bvid,
        }
        : {
            aid: aid,
        };
    const cidRes = (await axios_1.default.get("https://api.bilibili.com/x/web-interface/view?%s", {
        headers: headers,
        params: params,
    })).data;
    return cidRes;
}

async function getMediaSource(musicItem, quality) {
    var _a;
    let cid = musicItem.cid;
    if (!cid) {
        cid = (await getCid(musicItem.bvid, musicItem.aid)).data.cid;
    }
    const _params = musicItem.bvid
        ? {
            bvid: musicItem.bvid,
        }
        : {
            aid: musicItem.aid,
        };
    const res = (await axios_1.default.get("https://api.bilibili.com/x/player/playurl", {
        headers: headers,
        params: Object.assign(Object.assign({}, _params), { cid: cid, fnval: 16 }),
    })).data;
    let url;
    if (res.data.dash) {
        const audios = res.data.dash.audio;
        audios.sort((a, b) => a.bandwidth - b.bandwidth);
        switch (quality) {
            case "low":
                url = audios[0].baseUrl;
                break;
            case "standard":
                url = audios[1].baseUrl;
                break;
            case "high":
                url = audios[2].baseUrl;
                break;
            case "super":
                url = audios[3].baseUrl;
                break;
        }
    }
    else {
        url = res.data.durl[0].url;
    }
    const hostUrl = url.substring(url.indexOf("/") + 2);
    const _headers = {
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Safari/537.36 Edg/89.0.774.63",
        accept: "*/*",
        host: hostUrl.substring(0, hostUrl.indexOf("/")),
        "accept-encoding": "gzip, deflate, br",
        connection: "keep-alive",
        referer: "https://www.bilibili.com/video/".concat((_a = (musicItem.bvid !== null && musicItem.bvid !== undefined
            ? musicItem.bvid
            : musicItem.aid)) !== null && _a !== void 0 ? _a : ""),
    };
    return {
        url: url,
        headers: _headers,
    };
}

function formatMusic(item, flag) {
    return {
        id: item.bvid,
        aid: item.aid,
        bvid: item.bvid,
        artist: item.artist,
        title: flag ? item.date + '-' + item.num + '-' + item.title : item.title,
        album: item.bvid,
        artwork: item.artwork,
        description: item.desc,
        duration: item.duration,
        date: item.date,
        cid: item.cid
    }
}

async function searchMusic(keyword, page) {
    const rsp = (await axios_1.get('https://api.vplayer.tk/musics/妮莉安Lily/' + keyword)).data
    const data = rsp.map(item => formatMusic(item, true))
    return {
        isEnd: true,
        data: data
    }
}

async function getTopLists(){
    const rsp = (await axios_1.get('https://api.vplayer.tk/albums/妮莉安Lily')).data
    return [{
        title: "直播歌切",
        data: rsp
    }]
}

async function getTopListDetail(topListItem){
    const rsp = (await axios_1.get('https://api.vplayer.tk/albums/妮莉安Lily/' + topListItem.id)).data
    return {
        id: topListItem.id,
        description: topListItem.description,
        coverImg: topListItem.coverImg,
        title: topListItem.title,
        musicList: rsp.map(item => formatMusic(item, false))
    };
}

module.exports = {
    platform: "妮莉安Lily",
    appVersion: ">=0.0",
    version: "0.1.1",
    defaultSearchType: "music",
    cacheControl: "no-cache",
    srcUrl: "https://raw.githubusercontent.com/MianJu28/misc/main/musicfree/lily.js",
    async search(keyword, page, type) {
        if (type === "music") {
            return await searchMusic(keyword, page);
        }
        if (type === "album" || type === "artist") {
            return await searchMusic(keyword, page);
        }
    },
    getMediaSource,
    getTopLists,
    getTopListDetail
};
