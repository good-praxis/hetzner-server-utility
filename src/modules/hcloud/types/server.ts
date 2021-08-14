import { Datacenter, Iso, Image, Meta } from './index';

interface PublicIp {
  blocked: boolean;
  dns_ptr: string;
  ip: string;
}

interface PublicNet {
  firewalls: { id: number; status: 'applied' | 'pending' }[];
  floating_ips: number[];
  ipv4: PublicIp;
  ipv6: PublicIp;
}

interface PrivateNet {
  alias_ips: string[];
  ip: string;
  mac_address: string;
  network: number;
}

enum SERVER_STATUS {
  RUNNING = 'running',
  INITALIZED = 'initialized',
  STARTING = 'starting',
  STOPPING = 'stopping',
  OFF = 'off',
  DELETING = 'deleting',
  MIGRATING = 'migrating',
  REBUILDING = 'rebuilding',
  UNKNOWN = 'unknown'
}

export interface Server {
  backup_window: string;
  created: string;
  datacenter: Datacenter;
  id: number;
  image: Image | null;
  included_traffic: number | null;
  ingoing_traffic: number | null;
  iso: Iso | null;
  labels: object;
  load_balancers: number[];
  locked: boolean;
  name: string;
  outgoing_traffic: number | null;
  primary_disk_size: number;
  private_net: PrivateNet;
  protection: { delete: boolean; rebuild: boolean };
  public_net: PublicNet;
  rescue_enabled: boolean;
  server_type: ServerType;
  status: SERVER_STATUS;
  volumes: number[];
}

interface ServerType {
  cores: number;
  cpu_type: 'shared' | 'dedicated';
  deprecated: boolean;
  description: string;
  disk: number;
  id: number;
  memory: number;
  name: string;
  prices: {
    location: string;
    price_hourly: { gross: string; net: string };
    price_monthly: { gross: string; net: string };
  };
  storage_type: 'local' | 'network';
}

export interface ServerCreateRequest {
  automount?: boolean;
  datacenter?: string;
  firewalls: number[];
  image: string;
  labels: object;
  location?: string;
  name: string;
  networks: number[];
  server_type: string;
  ssh_keys: number[];
  start_after_create?: boolean;
  user_data?: string;
  volumes: number[];
}

export interface ServerCreateResponse {
  action: Action;
  next_actions: Action[];
  root_password: string | null;
  server: Server;
}

export interface ServerTypesResponse {
  server_types: ServerType[];
  meta: Meta;
}
