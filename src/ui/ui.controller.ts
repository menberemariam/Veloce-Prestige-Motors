import { Controller, Get, Header } from '@nestjs/common';
import { uiPage } from './ui-page';

@Controller('ui')
export class UiController {
  @Get()
  @Header('Content-Type', 'text/html')
  serveUi(): string {
    return uiPage;
  }
}
