import { AxiosResponse } from 'axios';
import { parseKey } from 'sshpk';
import { instance } from './common';
import { SSHKey, SSHKeysRequest, SSHKeysResponse } from './types';

export async function getAllKeys() {
  const { status, data }: AxiosResponse<SSHKeysResponse> = await instance().get(
    '/ssh_keys'
  );
  if (status !== 200) {
    throw new Error(`${status}: ${data}`);
  }
  const {
    ssh_keys,
    meta: {
      pagination: { next_page }
    }
  } = data;

  let keys: SSHKey[] = [...ssh_keys];
  async function getNextPage(page: number) {
    const { status, data }: AxiosResponse<SSHKeysResponse> =
      await instance().get('/ssh_keys', {
        data: { meta: { pagination: { page: page } } }
      });
    if (status !== 200) {
      throw new Error(`${status}: ${data}`);
    }
    keys = [...keys, ...data.ssh_keys];
    if (data.meta.pagination.next_page) {
      keys = [...keys, ...(await getNextPage(data.meta.pagination.next_page))];
    }
    return keys;
  }
  if (next_page) {
    await getNextPage(next_page);
  }

  return keys;
}

export async function createKey(request_data: SSHKeysRequest) {
  const { status, data }: AxiosResponse<SSHKey> = await instance()
    .post('/ssh_keys', {
      ...request_data,
      public_key: parseKey(request_data.public_key, 'pem').toString('ssh')
    })
    .catch((err) => {
      if (err.response.status === 409) {
        console.log(
          `SSHKey of ${process.env.APP_NAME} already registered on Hetzner`
        );
        return err.response;
      }
      throw err;
    });
  if (status === 201) {
    console.log(`Created SSHKey for ${process.env.APP_NAME} on Hetzner`);
    return;
  } else if (status === 409) {
    return;
  }

  throw new Error(`${status}: ${data}`);
}

/**
 * Retrieves a single SSHKey by its name.
 * When no name is given, the App's key is returned.
 **/
export async function getKeyByName(name: string = process.env.APP_NAME) {
  const { status, data }: AxiosResponse<SSHKey> = await instance()
    .get(`/ssh_keys?name=${name}`)
    .catch((err) => {
      if (err.response.status === 404) {
        console.log(`No SSHKey for ${name} on Hetzner`);
        return err.response;
      }
      throw err;
    });
  if (status === 200) {
    return data;
  }

  throw new Error(`${status}: ${data}`);
}

export async function updateKey(request_data: SSHKeysRequest) {
  const id = await getKeyByName(request_data.name).then((key) => key.id);

  const { status, data }: AxiosResponse<SSHKey> = await instance()
    .put(`/ssh_keys/${id}`, {
      ...request_data,
      public_key: parseKey(request_data.public_key, 'pem').toString('ssh')
    })
    .catch((err) => {
      if (err.response.status === 404) {
        console.log(`No SSHKey for ${request_data.name} on Hetzner`);
        return err.response;
      }
      throw err;
    });
  if (status === 200) {
    return;
  }

  throw new Error(`${status}: ${data}`);
}
