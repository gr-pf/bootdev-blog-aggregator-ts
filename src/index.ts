import { argv, exit } from 'node:process';

import { type CommandsRegistry, registerCommand, runCommand } from "./commands/commands.js";
import { handlerLogin, handlerRegister } from "./commands/users.js";


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

// import { createUser, getUser } from "./lib/db/queries/users.js";

// const data = await createUser("bob");
// console.log(data);


