import { getPostsForUser } from "../lib/db/queries/posts";
import { User } from "../lib/db/schema";

export async function handlerBrowse(cmdName: string, user: User, ...args: string[]) {

    let limit = 2;
    if (args.length !== 0) {
        limit = Number(args[0]);
    }

    const posts = await getPostsForUser(user, limit);
    let index = 1;
    for (const { post } of posts) {
        console.log("Post number: #", index);
        console.log(post.title);
        console.log(post.description);
        console.log(post.url);
        console.log(post.publishedAt);
        index++;
    }
}