import { readConfig, setUser } from "./config";

function main() {
    setUser("Jane");
    console.log(readConfig());
}

main();