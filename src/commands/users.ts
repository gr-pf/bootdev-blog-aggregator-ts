import { setUser } from "../config.js";
import { createUser, getUser } from "../lib/db/queries/users.js";


export async function handlerLogin(cmdName: string, ...args: string[]) {
    if (args.length === 0) {
        throw new Error(`the ${cmdName} handler expects a single argument, the username.`)
    }

    const userName = args[0];

    const checkUser = await getUser(userName);
    if (!checkUser) {
        throw new Error(`${userName} doesn't exist in the database!`)
    } else {
        setUser(userName);
        console.log(`Username: ${userName} successfully set!`)
    }
};

export async function handlerRegister(cmdName: string, ...args: string[]) {

    if (args.length === 0) {
        throw new Error(`the ${cmdName} handler expects a single argument, the username.`)
    }

    const userName = args[0];

    const user = await createUser(userName);
    if (!user) {
        throw new Error(`User ${userName} not found`);
    }

    setUser(userName);
    console.log(`Username: ${userName} successfully created and set!`)

};