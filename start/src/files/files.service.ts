import { Injectable } from '@nestjs/common';
import { FileElementResponse } from './dto/file-element.response';
import { format } from 'date-fns';
import { path } from 'app-root-path';
import { join } from 'path';
import { ensureDir, writeFile } from 'fs-extra';
import * as sharp from 'sharp';
import { MFile } from './MFile';

@Injectable()
export class FilesService {
  async saveFiles(files: MFile[]): Promise<FileElementResponse[]> {
    let dateFolder = format(new Date(), 'dd-MM-yy');
    let folder = join(path, 'uploads', dateFolder);
    await ensureDir(folder);
    let res: FileElementResponse[] = [];
    for (let file of files) {
      let url = join(folder, file.originalname);
      await writeFile(url, file.buffer);
      res.push({ url, name: file.originalname });
    }
    return res;
  }

  async convertToWebP(file: Express.Multer.File): Promise<Buffer> {
    return sharp(file.buffer).webp().toBuffer();
  }
}
