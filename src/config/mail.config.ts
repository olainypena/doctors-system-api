import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get('SMTP_HOST'),
          secure: false,
          auth: {
            user: configService.get('SMTP_USER'),
            pass: configService.get('SMTP_PASSWORD'),
          },
        },
        defaults: {
          from: `"Doctors System" <${configService.get('SMTP_USER')}>`,
        },
        template: {
          dir: join(__dirname, '../assets/mail'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
  ],
})
export class MailConfig {}
