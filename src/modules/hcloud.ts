import { ServerObject, ServerProps } from './server';

const HetznerCloud = require('hcloud-js');

export let client: any;

export function initalizeApi() {
  client = new HetznerCloud.Client({
    token: process.env.HCLOUD_SECRET,
    timeout: 1000 * 20
  });
}

export async function createNewServer(name: string, props: ServerProps) {
  return await client.servers
    .build(name)
    .serverType(props.type)
    .location(props.location)
    .image(process.env.HCLOUD_DEFAULT_IMAGE)
    .create();
}

export async function deleteServer(server: ServerObject) {
  return await client.servers.delete(server.server.id);
}

export async function createSnapshotFromServer(server: ServerObject) {
  const remote_server = await client.servers.get(server.server.id);
  const snapshot = await remote_server.createImage('snapshot');
  server['backup'] = snapshot.image.id;
  return server;
}

export async function getSnapshotStatus(server: ServerObject): Promise<string> {
  return client.images.get(server.backup).then((image: any) => image.status);
}
