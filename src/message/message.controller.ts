import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { MessageService } from './message.service';
import { ContactMessageDto } from './dto/contact-message.dto';

@Controller('message')
export class MessageController {
  constructor(private messageService: MessageService) {}

  @Post('/contact')
  async sendContactMessage(
    @Body(ValidationPipe) contactMessageDto: ContactMessageDto,
  ): Promise<void> {
    return this.messageService.sendContactMessage(contactMessageDto);
  }
}
