import { fetchFeed } from "../lib/rss.js";

export async function handlerAgg(cmdName: string, ...args: string[]) {
    const feedURL = "https://www.wagslane.dev/index.xml";

    const data = await fetchFeed(feedURL);
    const dataStringified = JSON.stringify(data, null, 2);
    console.log(dataStringified);

};