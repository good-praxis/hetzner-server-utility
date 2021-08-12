import {
  ServerTypesResponse
} from './types';
import { instance } from './common';
import { AxiosResponse } from 'axios';

export async function getServerTypes(page: number = 1) {
  const { status, data }: AxiosResponse<ServerTypesResponse> = await instance()
    .get('/server_types?per_page=50')
    .catch((err) => {
      throw (err.response.data, err.response.status);
    });

  if (status === 200) {
    return data;
  }
  throw new Error(`${status}: ${data.toString()}`);
}
