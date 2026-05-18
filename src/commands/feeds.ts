import { createFeedFollow } from "../lib/db/queries/feed_follows.js";
import { createFeed, getFeeds } from "../lib/db/queries/feeds.js";
import { getUserById } from "../lib/db/queries/users.js";
import { type Feed, type User } from "../lib/db/schema.js";
import { printFeedFollow } from "./follow.js";

export async function handlerAddFeed(cmdName: string, user: User, ...args: string[]) {
    if (args.length < 2) {
        throw new Error(`the ${cmdName} handler expects two arguments, the name and the url of the feed.`);
    }

    const feedName = args[0];
    const feedUrl = args[1];

    const userId = user.id;

    const checkFeed = await createFeed(feedName, feedUrl, userId);
    if (!checkFeed) {
        throw new Error("Error: feed not created");
    }

    const feedFollow = await createFeedFollow(userId, checkFeed.id);
    printFeedFollow(feedFollow.user_name, feedFollow.feed_name);

    console.log("Success: feed successfully created");
    printFeed(checkFeed, user);

}

export async function handlerFeeds(cmdName: string, ...args: string[]) {
    const feeds = await getFeeds();

    if (feeds.length === 0) {
        console.log(`No feeds found.`);
        return;
    }

    for (const feed of feeds) {
        const user = await getUserById(feed.userId)
        if (!user) {
            throw new Error(`No user for the feed : ${feed.id} - ${feed.name}`);
        }
        printFeed(feed, user);
        console.log("********************************");
    }
}

function printFeed(feed: Feed, user: User) {
    console.log(`* ID:            ${feed.id}`);
    console.log(`* Created:       ${feed.createdAt}`);
    console.log(`* Updated:       ${feed.updatedAt}`);
    console.log(`* name:          ${feed.name}`);
    console.log(`* URL:           ${feed.url}`);
    console.log(`* User:          ${user.name}`);
}

