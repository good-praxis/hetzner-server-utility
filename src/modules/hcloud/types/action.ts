interface ActionError {
  code: string;
  message: string;
}

interface ActionResource {
  id: number;
  type: string;
}

interface Action {
  command: string;
  error: ActionError | null;
  finished: string | null;
  id: number;
  progress: number;
  resources: ActionResource[];
  started: string;
  status: 'success' | 'running' | 'error';
}
