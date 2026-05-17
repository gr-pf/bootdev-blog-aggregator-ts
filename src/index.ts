import { argv, exit } from 'node:process';

import { type CommandsRegistry, registerCommand, runCommand } from "./commands/commands.js";
import { handlerLogin, handlerRegister, handlerReset, handlerUsers } from "./commands/users.js";
import { handlerAgg } from './commands/aggregate.js';
import { handlerAddFeed } from './commands/feeds.js';


async function main() {
    const args = argv.slice(2);
    if (args.length === 0) {
        console.log("usage: cli <command> [args...]");
        exit(1);
    }
    const cmd = args[0];
    const cmdArgs = args.slice(1);

    const registry: CommandsRegistry = {};
    registerCommand(registry, "login", handlerLogin);
    registerCommand(registry, "register", handlerRegister);
    registerCommand(registry, "reset", handlerReset);
    registerCommand(registry, "users", handlerUsers);
    registerCommand(registry, "agg", handlerAgg);
    registerCommand(registry, "addfeed", handlerAddFeed);

    try {
        await runCommand(registry, cmd, ...cmdArgs);
    } catch (err) {
        if (err instanceof Error) {
            console.error(`Error running command ${cmd}: ${err.message}`);
        } else {
            console.error(`Error running command ${cmd}: ${err}`);
        }
        exit(1);
    }
    exit(0);

}

main();




