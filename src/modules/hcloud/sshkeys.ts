import { AxiosResponse } from 'axios';
import { parseKey } from 'sshpk';
import { HttpStatus } from '../http_status';
import { instance } from './common';
import { SSHKey, SSHKeysRequest, SSHKeysResponse } from './types';

export async function getKeys(page = 1) {
  const { status, data }: AxiosResponse<SSHKeysResponse> = await instance().get(
    `/ssh_keys?page=${page}`
  );
  if (status === HttpStatus.OK) {
    return data;
  }
  throw new Error(`${status}: ${data}`);
}

export async function createKey(request_data: SSHKeysRequest) {
  const { status, data }: AxiosResponse<SSHKey> = await instance()
    .post('/ssh_keys', {
      ...request_data,
      public_key: parseKey(request_data.public_key, 'pem').toString('ssh')
    })
    .catch((err) => {
      if (err.response.status === HttpStatus.Conflict) {
        console.log(
          `SSHKey of ${process.env.APP_NAME} already registered on Hetzner`
        );
        return err.response;
      }
      throw err;
    });

  if (status === HttpStatus.Created)
    console.log(`Created SSHKey for ${process.env.APP_NAME} on Hetzner`);

  if ([HttpStatus.Conflict, HttpStatus.Created].includes(status)) return;

  throw new Error(`${status}: ${data}`);
}

/**
 * Retrieves a single SSHKey by its name.
 * When no name is given, the App's key is returned.
 **/
export async function getKeyByName(name: string = process.env.APP_NAME) {
  const { status, data }: AxiosResponse<SSHKeysResponse> = await instance()
    .get(`/ssh_keys?name=${name}`)
    .catch((err) => {
      throw err;
    });
  if (status === HttpStatus.OK) {
    if (data.ssh_keys.length === 0) {
      console.error(`No SSHKey found on Hetzner for ${name}`);
    }
    return data.ssh_keys[0];
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
      if (err.response.status === HttpStatus.NotFound) {
        console.log(`No SSHKey for ${request_data.name} on Hetzner`);
        return err.response;
      }
      throw err;
    });
  if (status === HttpStatus.OK) {
    return;
  }

  throw new Error(`${status}: ${data}`);
}
