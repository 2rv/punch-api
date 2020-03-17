import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ContactMessageDto } from './dto/contact-message.dto';
import { Translate } from 'src/utils';
import { Errors } from './enum/errors.enum';
import { ContactTemplate } from './templates';
import { sendMail, MailOptionsType } from '../utils/mail';

@Injectable()
export class MessageService {
  constructor() {}

  async sendContactMessage(
    contactMessageDto: ContactMessageDto,
  ): Promise<void> {
    const mailOptionsType: MailOptionsType = {
      subject: Translate(
        `Contact message. ${contactMessageDto.name}. ${contactMessageDto.type}`,
      ),
      html: ContactTemplate(contactMessageDto),
      to: null,
    };

    await sendMail(mailOptionsType, (error, data) => {
      if (error) {
        console.log(error);
      }
    });
  }
}
