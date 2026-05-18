import type { User } from "../lib/db/schema.js";
import type { CommandHandler, UserCommandHandler } from "./commands.js";
import { getUser } from "../lib/db/queries/users.js";
import { readConfig } from "../config.js";


export function middlewareLoggedIn(handler: UserCommandHandler): CommandHandler {
    return async (cmdName: string, ...args: string[]): Promise<void> => {

        const userName = readConfig().currentUserName;
        if (!userName) {
            throw new Error("User not logged in");
        }

        const user = await getUser(userName);
        if (!user) {
            throw new Error(`User ${userName} not found`);
        }

        await handler(cmdName, user, ...args);

    }
};