type CommandHandler = (cmdName: string, ...args: string[]) => void;

export type CommandsRegistry = {
    [cmdName: string]: CommandHandler;
};


export function registerCommand(registry: CommandsRegistry, cmdName: string, handler: CommandHandler) {
    registry[cmdName] = handler;
};

export function runCommand(registry: CommandsRegistry, cmdName: string, ...args: string[]) {
    if (cmdName in registry) {
        registry[cmdName](cmdName, ...args);
    } else {
        throw new Error(`<cmdName>: ${cmdName} is not in the registry!`)
    }
};