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
  server_type: ServerSpecs;
  status: SERVER_STATUS;
  volumes: number[];
}

interface ServerSpecs {
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

interface Datacenter {
  desciption: string;
  id: number;
  location: Location;
  name: string;
  server_types: ServerTypes;
}

interface Iso {
  deprecated: string | null;
  description: string | null;
  id: number;
  name: string | null;
  type: 'public' | 'private';
}

enum IMAGE_TYPE {
  system = 'system',
  app = 'app',
  snapshot = 'snapshot',
  backup = 'backup',
  temporary = 'temporary'
}

enum OS_FLAVOR {
  ubuntu = 'ubuntu',
  centos = 'centos',
  debian = 'debian',
  fedora = 'fedora',
  unkown = 'unkown'
}

interface Image {
  bound_to: number | null;
  build_id: string | null;
  created: string;
  created_from: { id: number; name: string } | null;
  deleted: string | null;
  deprecated: string | null;
  description: string;
  disk_size: number;
  id: number;
  image_size: number | null;
  labels: object | null;
  name: string;
  os_flavor: OS_FLAVOR;
  os_type: string | null;
  protection: { delete: boolean };
  rapid_deploy: boolean;
  status: 'available' | 'creating' | 'unavailable';
  type: IMAGE_TYPE;
}

interface ServerTypes {
  available: number[];
  avaialble_from_migration: number[];
  supported: number[];
}
