const { readFileSync, createReadStream, unlinkSync } = require('fs-extra');

module.exports.config = {
	name: "cap",
	version: "1.0.0",
	hasPermssion: 0,
	credits: "Mirai Team",
	description: "Screenshot một trang web nào đó (NOT ALLOW NSFW PAGE)",
	commandCategory: "tiện ích",
	usages: "[url site]",
	cooldowns: 0,
	dependencies: {
        "fs-extra": "",
        "path": "",
        "url": ""
    }
};

module.exports.onLoad = async () => {
    const { existsSync } = require('fs-extra');  // Đảm bảo import đúng
    const { resolve } = require('path');

    const path = resolve(__dirname, "cache", "pornlist.txt");

    if (!existsSync(path)) {
        return await global.utils.downloadFile("https://raw.githubusercontent.com/blocklistproject/Lists/master/porn.txt", path);
    } else {
        return;
    }
};


module.exports.run = async ({ event, api, args }) => {
    const { readFileSync, createReadStream, unlinkSync } = require('fs-extra');  // Đảm bảo import đúng
    const url = require('url');  // Sử dụng require thay vì global.nodemodule

    if (!global.moduleData.pornList) {
        global.moduleData.pornList = readFileSync(__dirname + "/cache/pornlist.txt", "utf-8")
            .split('\n')
            .filter(site => site && !site.startsWith('#'))
            .map(site => site.replace(/^(0.0.0.0 )/, ''));
    }

    const urlParsed = url.parse(args[0]);

    if (global.moduleData.pornList.some(pornURL => urlParsed.host == pornURL)) {
        return api.sendMessage("Trang web bạn nhập không an toàn!!(NSFW PAGE)", event.threadID, event.messageID);
    }

    try {
        const path = __dirname + `/cache/${event.threadID}-${event.senderID}s.png`;
        await global.utils.downloadFile(`https://image.thum.io/get/width/1920/crop/400/fullpage/noanimate/${args[0]}`, path);
        api.sendMessage({ attachment: createReadStream(path) }, event.threadID, () => unlinkSync(path));
    } catch {
        return api.sendMessage("Không tìm thấy url này, định dạng không đúng ?", event.threadID, event.messageID);
    }
};
