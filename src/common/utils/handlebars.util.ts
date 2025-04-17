import { Injectable } from '@nestjs/common';
import Handlebars from 'handlebars';
import { join } from 'path';
import { readFileSync } from 'fs';

@Injectable()
export class HandlebarsUtil {
  constructor() {}

  loadTemplate(template: string, context: object): string {
    const templatePath = join(
      __dirname,
      '../../assets/mail/',
      `${template}.hbs`,
    );
    const templateContent = readFileSync(templatePath, 'utf-8');
    const compiledTemplate = Handlebars.compile(templateContent);
    return compiledTemplate(context);
  }
}
