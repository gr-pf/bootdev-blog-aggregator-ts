import { createFeedFollow, getFeedFollowsForUser } from "../lib/db/queries/feed_follows";
import { readConfig } from "../config";
import { getUser } from "../lib/db/queries/users";
import { getFeedByUrl } from "../lib/db/queries/feeds";

export async function handlerFollow(cmdName: string, ...args: string[]) {
    if (args.length === 0) {
        throw new Error(`the ${cmdName} handler expects one argument, the url of the feed.`);
    }

    const user = readConfig().currentUserName;
    const userData = await getUser(user);
    const userId = userData.id;
    if (!userId) {
        throw new Error(`${user} not in db.`)
    }

    const url = args[0];
    const feedData = await getFeedByUrl(url);
    const feedId = feedData.id;
    if (!feedId) {
        throw new Error(`${url} not in db.`);
    }

    const feedFollow = await createFeedFollow(userId, feedId);
    if (!feedFollow) {
        throw new Error("createFeedFollow error.");
    }
    console.log("Success createFeedFollow!");
    printFeedFollow(feedFollow.user_name, feedFollow.feed_name);

};

export async function handlerFollowing(cmdName: string, ...args: string[]) {

    const user = readConfig().currentUserName;
    const userData = await getUser(user);
    const userId = userData.id;
    if (!userId) {
        throw new Error(`${user} not in db.`);
    }

    const feeds = await getFeedFollowsForUser(userId);

    if (!feeds) {
        console.log(`${user} doesn't follow any feed.`);
        return;
    }

    for (const feed of feeds) {
        console.log(feed.feed_name);
    }

};

export function printFeedFollow(username: string, feedname: string) {
    console.log(`* User:          ${username}`);
    console.log(`* Feed:          ${feedname}`);
};