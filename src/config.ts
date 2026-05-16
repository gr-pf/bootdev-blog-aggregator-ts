import fs from "fs";
import os from "os";
import path from "path";

type Config = {
    dbUrl: string;
    currentUserName: string;
}

export function setUser(userName: string) {
    const cfg = readConfig();
    cfg.currentUserName = userName;
    console.log("cfg: ", cfg)
    writeConfig(cfg);
};

export function readConfig(): Config {
    const path = getConfigFilePath();
    const file = fs.readFileSync(path, "utf-8");
    const rawConfig = JSON.parse(file);
    const config = validateConfig(rawConfig);


    return config;
};

function getConfigFilePath(): string {

    return path.join(os.homedir(), "boot-dev", "bootdev-blog-aggregator-ts", ".gatorconfig.json")
}

function writeConfig(cfg: Config): void {
    const obj = {
        db_url: cfg.dbUrl,
        current_user_name: cfg.currentUserName
    }
    const data = JSON.stringify(obj, null, 2);
    const path = getConfigFilePath();
    fs.writeFileSync(path, data, { encoding: "utf-8" });
}

function validateConfig(rawConfig: any): Config {
    if (!rawConfig || typeof rawConfig !== "object") {
        throw new Error("Invalid rawConfig");
    }
    if (typeof rawConfig.db_url !== "string") {
        throw new Error("db_url is missing or invalid format");
    }
    if (typeof rawConfig.current_user_name !== "string") {
        throw new Error("current_user_name is missing or invalid format");
    }

    return {
        dbUrl: rawConfig.db_url,
        currentUserName: rawConfig.current_user_name
    };

}
