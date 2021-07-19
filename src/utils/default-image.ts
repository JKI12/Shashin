import fs from 'fs/promises';
import path from 'path';

const defaultImage = (): Promise<Buffer> => {
  return fs.readFile(path.resolve('default.png'));
};

export default defaultImage;
