import {
  Controller,
  HttpCode,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileElementResponse } from './dto/file-element.response';
import { FilesService } from './files.service';
import { MFile } from './MFile';
import { parse } from 'path';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload|add')
  @HttpCode(200)
  @UseInterceptors(FileInterceptor('files'))
  async uploadFiles(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<FileElementResponse[]> {
    file.originalname = Buffer.from(file.originalname, 'latin1').toString(
      'utf8',
    );
    let saveFiles: MFile[] = [file];
    if (file.mimetype.includes('image'))
      saveFiles.push({
        originalname: `${parse(file.originalname).name}.webp`,
        buffer: await this.filesService.convertToWebP(file),
      });
    return this.filesService.saveFiles(saveFiles);
  }
}
