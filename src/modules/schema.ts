import fs from "fs";

export interface ServerObject {
    version: string;
    id: string;
    name: string;
    server: {
        name?: string;
        props: {
            location: string;
            type: string;
        };
        ip?: string;
        state?: ServerState;
    };
    backup?: string;
}

export enum ServerState {
    CREATED,
    LIVE,
    OFFLINE,
    DESTROYED,
}

export function initalize(): void {
    if (!jsonExist()) {
        createJson();
    }
}

export function saveData(server: ServerObject, path = process.env.JSON_PATH) {
    const store: RawStore = JSON.parse(fs.readFileSync(path, "utf8"));
    fs.writeFileSync(
        path,
        JSON.stringify({ data: { ...store.data, [server.id]: server } })
    );
}

export function loadById(id: string): ServerObject | undefined {
    const server = loadDataFromJson().data[id];
    if (!server) {
        return newServer(id);
    }
}

interface RawStore {
    data: { [id: string]: ServerObject };
}

function loadDataFromJson(path = process.env.JSON_PATH): RawStore {
    return JSON.parse(fs.readFileSync(path, "utf8"));
}

function jsonExist(path = process.env.JSON_PATH): boolean {
    return fs.existsSync(path);
}

function createJson(path = process.env.JSON_PATH): void {
    fs.writeFileSync(path, JSON.stringify({ data: {} }));
}

function newServer(id: string): ServerObject {
    return {
        version: "1.0.0",
        id,
        name: undefined,
        server: {
            name: undefined,
            props: {
                location: "nbg1",
                type: "ccx22",
            },
            ip: undefined,
            state: undefined,
        },
        backup: undefined,
    };
}
