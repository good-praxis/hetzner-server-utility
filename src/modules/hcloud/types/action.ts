import { Image } from './image';

interface ActionError {
  code: string;
  message: string;
}

interface ActionResource {
  id: number;
  type: string;
}

export interface Action {
  command: string;
  error: ActionError | null;
  finished: string | null;
  id: number;
  progress: number;
  resources: ActionResource[];
  started: string;
  status: 'success' | 'running' | 'error';
}

export interface CreateImageFromServerActionRequest {
  description?: string;
  labels?: object;
  type?: 'snapshot' | 'backup';
}

export interface CreateImageFromServerActionResponse {
  action: Action;
  image: Image;
}
