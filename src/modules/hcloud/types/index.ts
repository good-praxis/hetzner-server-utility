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

export * from './sshkey';
export * from './server';
export * from './image';
