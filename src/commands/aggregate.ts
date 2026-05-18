import console from "console";
import { getNextFeedToFetch, markFeedFetched } from "../lib/db/queries/feeds.js";
import { fetchFeed } from "../lib/rss.js";

export async function handlerAgg(cmdName: string, ...args: string[]) {
    if (args.length === 0) {
        throw new Error(`the ${cmdName} handler expects one argument, the duration between fetch.`);
    }

    const timeBetweenReqs = args[0]
    const durationMS = parseDuration(timeBetweenReqs);
    if (!durationMS) {
        throw new Error(
            `invalid duration: ${timeBetweenReqs} – use format 1h 30m 15s or 3500ms`,
        );
    }

    console.log(`Collecting feeds every ${timeBetweenReqs}`);

    scrapeFeeds().catch(handleError);

    const interval = setInterval(() => {
        scrapeFeeds().catch(handleError);
    }, durationMS);

    await new Promise<void>((resolve) => {
        process.on("SIGINT", () => {
            console.log("Shutting down feed aggregator...");
            clearInterval(interval);
            resolve();
        });
    });
};

async function scrapeFeeds() {

    const nextFeed = await getNextFeedToFetch();
    if (!nextFeed) {
        console.log(`No feeds to fetch.`);
        return;
    }

    const rss = await fetchFeed(nextFeed.url);
    await markFeedFetched(nextFeed.id);

    console.log("========================");
    console.log(`Scraping feed: ${nextFeed.name}`);
    console.log("========================");

    for (const item of rss.channel.item) {
        console.log(item.title)
    }


}

function parseDuration(durationStr: string): number {
    const regex = /^(\d+)(ms|s|m|h)$/;
    const match = durationStr.match(regex);
    if (!match || match.length < 3) {
        throw new Error(
            `${durationStr} is not a correct time_between_reqs string!`
        );
    }
    const unit = match[2];
    const value = Number(match[1]);


    switch (unit) {
        case "ms":
            return value;
        case "s":
            return value * 1000;
        case "m":
            return value * 1000 * 60;
        case "h":
            return value * 1000 * 60 * 60;

        default:
            throw new Error(
                `${durationStr} is not a correct string: ^(\\d+)(ms|s|m|h)$`,
            );
    }
}

function handleError(err: unknown) {
    console.error(
        `Error scraping feeds: ${err instanceof Error ? err.message : err}`,
    );
}