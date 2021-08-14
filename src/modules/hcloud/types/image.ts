import { Meta } from '.';

export interface Iso {
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

export interface Image {
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
  os_version: string | null;
  protection: { delete: boolean };
  rapid_deploy: boolean;
  status: 'available' | 'creating' | 'unavailable';
  type: IMAGE_TYPE;
}

export interface ImageResponse {
  images: Image[];
  meta: Meta;
}
