import { AxiosResponse } from 'axios';
import { HttpStatus } from '../http_status';
import { instance } from './common';
import {
  CreateImageFromServerActionRequest,
  CreateImageFromServerActionResponse
} from './types';

export async function createImageFromServer(
  id: number,
  request: CreateImageFromServerActionRequest
) {
  const { status, data }: AxiosResponse<CreateImageFromServerActionResponse> =
    await instance()
      .post(`/servers/${id}/actions/create_image`, request)
      .catch((err) => {
        if (err.response.status === HttpStatus.Locked) {
          console.error(
            'Snapshot for this server is already in progress, error handling not implemented'
          );
        }
        throw new Error(err.message);
      });

  return data;
}
