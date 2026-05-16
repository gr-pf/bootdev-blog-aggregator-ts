import { setUser } from "../config.js";


export function handlerLogin(cmdName: string, ...args: string[]) {
    if (args.length === 0) {
        throw new Error(`the ${cmdName} handler expects a single argument, the username.`)
    }

    const userName = args[0];


    setUser(userName);
    console.log(`Username: ${userName} successfully set!`)

};