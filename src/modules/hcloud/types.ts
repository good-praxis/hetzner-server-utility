export interface Meta {
  pagination: {
    page: number;
    per_page: number;
    previous_page: number | null;
    next_page: number | null;
    last_page: number | null;
    total_entries: number | null;
  };
}

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
