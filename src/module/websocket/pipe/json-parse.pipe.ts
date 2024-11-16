import { Injectable, Logger, PipeTransform } from '@nestjs/common';

@Injectable()
export class JsonParsePipe implements PipeTransform {
  private readonly logger = new Logger(JsonParsePipe.name);

  transform(value: any) {
    try {
      return typeof value === 'string' ? JSON.parse(value) : value;
    } catch (error) {
      this.logger.error('Error parsing WebSocket data to JSON:', error);
      return value;
    }
  }
}
