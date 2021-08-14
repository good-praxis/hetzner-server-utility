import { AxiosResponse } from 'axios';
import { HttpStatus } from '../http_status';
import { instance } from './common';
import { LocationResponse } from './types';

async function getLocations() {
  const { status, data }: AxiosResponse<LocationResponse> =
    await instance().get('/locations');
  if (status === HttpStatus.OK) {
    return data;
  }

  throw new Error(`${status}: ${data.toString()}`);
}

export async function getListOfAvailableLocations(): Promise<string[]> {
  const { locations } = await getLocations();
  return locations.map((location) => location.name);
}
