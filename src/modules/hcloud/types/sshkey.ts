import { Meta } from './index';

export interface SSHKey {
  created: string;
  fingerpringt: string;
  id: number;
  labels: object;
  name: string;
  public_key: string;
}

export interface SSHKeysResponse {
  meta: Meta;
  ssh_keys: SSHKey[];
}

export interface SSHKeysRequest {
  labels?: {};
  name: string;
  public_key: string;
}
