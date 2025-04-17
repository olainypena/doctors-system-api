import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

interface File {
  name: string;
  buffer: Buffer | Uint8Array | string;
}

@Injectable()
export class FileUtil {
  /**
   * Create a directory if it does not exist.
   * @param dir - The directory to create.
   * @example
   * createDir('src/common/utils');
   */
  createDir = (dir: string): void => {
    const cwd = path.join(process.cwd(), dir);

    if (!fs.existsSync(cwd)) {
      fs.mkdirSync(cwd, { recursive: true });
    }
  };

  /**
   * Saves a file to the specified directory.
   *
   * @param dir - The directory where the file will be saved.
   * @param file - An object containing the file name and its content (buffer or string).
   * @returns A Promise that resolves when the file is successfully saved or rejects on an error.
   * @example
   * const file = {
   *  name: 'file.util.ts',
   * buffer: Buffer.from('export const saveFile = async (dir: string, file: File): Promise<void> => { ... }')
   * };
   * await saveFile('src/common/utils', file);
   */
  save = async (dir: string, file: File): Promise<void> => {
    const cwd = path.join(process.cwd(), dir);

    if (!fs.existsSync(cwd)) {
      fs.mkdirSync(cwd, { recursive: true });
    }

    return new Promise((resolve, reject) => {
      const ws = fs.createWriteStream(`${cwd}/${file.name}`);
      ws.on('finish', () => {
        resolve();
      });
      ws.on('error', (error) => {
        reject(error);
      });
      ws.write(file.buffer);
      ws.end();
    });
  };

  /**
   * Get all files in a directory.
   *
   * @param dir - The directory to search.
   * @returns A Promise that resolves to an array of file names or rejects on an error.
   * @example
   * const files = await getFiles('src/common/utils'); // ['file.util.ts', 'index.ts']
   */
  get = async (dir: string): Promise<string[]> => {
    const cwd = path.join(process.cwd(), dir);
    return new Promise((resolve, reject) => {
      fs.readdir(cwd, (error, files) => {
        if (error) {
          reject(error);
        }
        resolve(files);
      });
    });
  };

  /**
   * Get the content of a file.
   *
   * @param dir - The directory where the file is located.
   * @param file - The file name.
   * @param encode - The encoding of the file.
   * @returns A Promise that resolves to the file content or rejects on an error.
   * @example
   * const content = await getFileContent('src/common/utils', 'file.util.ts');
   */
  getContent = async (
    dir: string,
    file: string,
    encode: BufferEncoding = 'utf-8',
  ): Promise<string> => {
    const cwd = path.join(process.cwd(), dir);

    return new Promise((resolve, reject) => {
      fs.readFile(`${cwd}/${file}`, encode, (error, content) => {
        if (error) {
          reject(error);
        }
        resolve(content);
      });
    });
  };
}
