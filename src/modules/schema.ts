import fs from 'fs';
import { createNewServer as hcloudNewServer } from './hcloud';

export interface ServerObject {
  version: string;
  id: number;
  name: string;
  server: {
    id: number;
    props: ServerProps;
    ip?: string;
    state?: ServerState;
  };
  backup?: number;
}

export interface ServerProps {
  location: string;
  type: string;
}

export enum ServerState {
  CREATED,
  LIVE,
  OFFLINE,
  DESTROYED
}

export function initalize(): void {
  if (!jsonExist()) {
    createJson();
  }
}

export function saveData(server: ServerObject, path = process.env.JSON_PATH) {
  const store: RawStore = JSON.parse(fs.readFileSync(path, 'utf8'));
  fs.writeFileSync(
    path,
    JSON.stringify({ data: { ...store.data, [server.id]: server } })
  );
}

export function loadById(id: number): ServerObject | undefined {
  const server = loadDataFromJson().data[id];
  return server;
}

export async function createNewServer(name: string, props?: ServerProps) {
  const newServerProps: ServerProps = {
    type: props?.type || process.env.DEFAULT_SERVER_TYPE,
    location: props?.location || process.env.DEFAULT_SERVER_LOCATION
  };
  const server = await hcloudNewServer(name, newServerProps);

  return <ServerObject>{
    version: process.env.CURRENT_VERSION,
    id: getNewId(),
    name,
    server: {
      id: server.server.id,
      props: {
        location: newServerProps.location,
        type: newServerProps.type
      },
      ip: server.server.publicNet.ipv4.ip,
      state: ServerState.CREATED
    },
    backup: undefined
  };
}

interface RawStore {
  data: { [id: string]: ServerObject };
}

function loadDataFromJson(path = process.env.JSON_PATH): RawStore {
  return JSON.parse(fs.readFileSync(path, 'utf8'));
}

function jsonExist(path = process.env.JSON_PATH): boolean {
  return fs.existsSync(path);
}

function createJson(path = process.env.JSON_PATH): void {
  fs.writeFileSync(path, JSON.stringify({ data: {} }));
}

function getNewId(): number {
  return Object.keys(loadDataFromJson().data).length;
}
