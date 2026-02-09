import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { IngestionService } from './ingestion.service';

@Controller('v1/ingestion')
export class IngestionController {
    constructor(private readonly ingestionService: IngestionService) { }

    @Post()
    @HttpCode(HttpStatus.ACCEPTED)
    async ingest(@Body() payload: any) {
        await this.ingestionService.processReadings(payload);
        return { status: 'accepted' };
    }
}
