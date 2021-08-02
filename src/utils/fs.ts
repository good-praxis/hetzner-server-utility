import fs from 'fs';

export function createFolderIfNotExists(path: string) {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
  }
}
