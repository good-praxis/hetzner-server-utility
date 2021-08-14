import { AxiosResponse } from 'axios';
import { HttpStatus } from '../http_status';
import { instance } from './common';
import { ImageResponse } from './types';

export async function getImages() {
  const { status, data }: AxiosResponse<ImageResponse> = await instance().get(
    '/images'
  );
  if (status === HttpStatus.OK) {
    return data;
  }

  throw new Error(`${status}: ${data.toString()}`);
}
