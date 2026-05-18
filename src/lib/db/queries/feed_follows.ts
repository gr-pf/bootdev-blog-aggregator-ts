import { db } from "..";
import { feedFollows, feeds, users } from "../schema";
import { eq, and } from 'drizzle-orm';

export async function createFeedFollow(userId: string, feedId: string) {
    const [newFeedFollow] = await db
        .insert(feedFollows)
        .values({ userId, feedId })
        .returning();
    const feedFollowId = newFeedFollow.id;
    const [result] = await db
        .select({
            feed_follow_id: feedFollows.id,
            feed_follow_created_at: feedFollows.createdAt,
            feed_follow_updated_at: feedFollows.updatedAt,
            feed_follow_user_id: feedFollows.userId,
            feed_follow_feed_id: feedFollows.feedId,
            user_name: users.name,
            feed_name: feeds.name,
        })
        .from(feedFollows)
        .innerJoin(users, eq(feedFollows.userId, users.id))
        .innerJoin(feeds, eq(feedFollows.feedId, feeds.id))
        .where(eq(feedFollows.id, feedFollowId));
    return result;
}

export async function getFeedFollowsForUser(userId: string) {
    return await db
        .select({
            id: feedFollows.id,
            createdAt: feedFollows.createdAt,
            updatedAT: feedFollows.updatedAt,
            userId: feedFollows.userId,
            feedId: feedFollows.feedId,
            user_name: users.name,
            feed_name: feeds.name,
        })
        .from(users)
        .innerJoin(feedFollows, eq(users.id, feedFollows.userId))
        .innerJoin(feeds, eq(feedFollows.feedId, feeds.id))
        .where(eq(users.id, userId));
}

export async function deleteFeedFollow(userId: string, feedId: string) {
    const [result] = await db
        .delete(feedFollows)
        .where(and(
            eq(feedFollows.userId, userId),
            eq(feedFollows.feedId, feedId)
        ))
        .returning();

    return result;
}