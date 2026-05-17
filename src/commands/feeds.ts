import { readConfig } from "../config.js";
import { createFeed, getFeeds } from "../lib/db/queries/feeds.js";
import { getUser, getUserById } from "../lib/db/queries/users.js";
import type { Feed, User } from "../lib/db/schema.js";

export async function handlerAddFeed(cmdName: string, ...args: string[]) {
    if (args.length < 2) {
        throw new Error(`the ${cmdName} handler expects a two arguments, the name and the url of the feed.`)
    }

    const currentUser = readConfig().currentUserName;
    if (!currentUser) {
        throw new Error("You must log-in before creating a feed.")
    }
    const feedName = args[0];
    const feedUrl = args[1];
    const userData = await getUser(currentUser);
    if (!userData) {
        throw new Error(`${currentUser} doesn't exist in db.`)
    }
    const userId = userData.id;

    const checkFeed = await createFeed(feedName, feedUrl, userId);
    if (!checkFeed) {
        throw new Error("Error: feed not created")
    }
    console.log("Success: feed successfully created")
    printFeed(checkFeed, userData)

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
            throw new Error(`No user for the feed : ${feed.id} - ${feed.name}`)
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