import { createFeedFollow, getFeedFollowsForUser, deleteFeedFollow } from "../lib/db/queries/feed_follows";
import { getFeedByUrl } from "../lib/db/queries/feeds";
import type { User } from "../lib/db/schema.js";

export async function handlerFollow(cmdName: string, user: User, ...args: string[]) {
    if (args.length === 0) {
        throw new Error(`the ${cmdName} handler expects one argument, the url of the feed.`);
    }


    const userId = user.id;


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

export async function handlerFollowing(cmdName: string, user: User, ...args: string[]) {

    const userId = user.id;

    const feeds = await getFeedFollowsForUser(userId);

    if (feeds.length === 0) {
        console.log(`${user.name} doesn't follow any feed.`);
        return;
    }

    for (const feed of feeds) {
        console.log(feed.feed_name);
    }

};

export async function handlerUnfollow(cmdName: string, user: User, ...args: string[]) {
    if (args.length === 0) {
        throw new Error(`the ${cmdName} handler expects one argument, the url of the feed.`);
    }


    const userId = user.id;


    const url = args[0];
    const feedData = await getFeedByUrl(url);
    const feedId = feedData.id;
    if (!feedId) {
        throw new Error(`${url} not in db.`);
    }

    const feedFollow = await deleteFeedFollow(userId, feedId);
    if (!feedFollow) {
        throw new Error("deleteFeedFollow error.");
    }
    console.log(`${user.name} unfollow feed id: ${feedFollow.feedId}!`);


};

export function printFeedFollow(username: string, feedname: string) {
    console.log(`* User:          ${username}`);
    console.log(`* Feed:          ${feedname}`);
};