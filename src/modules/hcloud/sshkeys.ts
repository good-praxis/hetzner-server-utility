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
