import {
  ServerCreateRequest,
  ServerCreateResponse,
  ServerTypesResponse,
  ServerResponse
} from './types';
import { instance } from './common';
import { AxiosResponse } from 'axios';
import { HttpStatus } from '../http_status';

export async function getServers(page = 1) {
  const { status, data }: AxiosResponse<ServerResponse> = await instance().get(
    `/servers?page=${page}`
  );
  if (status === HttpStatus.OK) {
    return data;
  }
  throw new Error(`${status}: ${data}`);
}

export async function createServer(request: ServerCreateRequest) {
  const { status, data }: AxiosResponse<ServerCreateResponse> = await instance()
    .post('/servers', request)
    .catch((err) => {
      if (err.response.status === HttpStatus.Conflict) {
        console.error(
          `Server creation failed: ${err.response.data.error.message}`
        );
        return err.response;
      }
      throw new Error(`${err}: ${err.response.data}`);
    });
  if (status !== HttpStatus.Created && status !== HttpStatus.Conflict) {
    console.error(status, data);
  }
  return data;
}

export async function getServerTypes(page: number = 1) {
  const { status, data }: AxiosResponse<ServerTypesResponse> = await instance()
    .get('/server_types?per_page=50')
    .catch((err) => {
      throw (err.response.data, err.response.status);
    });

  if (status === HttpStatus.OK) {
    return data;
  }
  throw new Error(`${status}: ${data.toString()}`);
}
