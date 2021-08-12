import { Meta } from './index';

interface Location {
  city: string;
  country: string;
  description: string;
  id: number;
  latitude: number;
  longitude: number;
  name: string;
  network_zone: string;
}

export interface Datacenter {
  desciption: string;
  id: number;
  location: Location;
  name: string;
  server_types: ServerTypesLists;
}

interface ServerTypesLists {
  available: number[];
  avaialble_from_migration: number[];
  supported: number[];
}

export interface LocationResponse {
  locations: Location[];
  meta: Meta;
}
