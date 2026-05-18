import { db } from "..";
import { eq, desc } from 'drizzle-orm';
import { feedFollows, posts, type PostInsert, PostSelect, type User } from "../schema";


export async function createPost(post: PostInsert) {
    const [result] = await db.insert(posts).values(post).onConflictDoNothing().returning();
    return result;
}

export async function getPostsForUser(user: User, numberOfPosts: number = 2) {
    return db
        .select({ post: posts })
        .from(feedFollows)
        .innerJoin(posts, eq(feedFollows.feedId, posts.feedId))
        .where(eq(feedFollows.userId, user.id))
        .orderBy(desc(posts.publishedAt))
        .limit(numberOfPosts);

}