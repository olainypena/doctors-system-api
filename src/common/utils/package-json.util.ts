import { readFileSync } from 'fs';
import { join } from 'path';

export const packageJson = () => {
  const data = JSON.parse(
    readFileSync(join(process.cwd(), 'package.json')).toString(),
  );

  return {
    name: data.name,
    version: data.version,
    description: data.description,
  };
};
