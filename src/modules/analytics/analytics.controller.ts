import { Controller, Post, Body, UseInterceptors, ClassSerializerInterceptor, Req } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { ApiBearerAuth, ApiOkResponse, ApiOperation } from '@nestjs/swagger';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  @ApiOperation({
    summary: 'Receive analytics data',
    description: 'Receive analytics data from the client',
  })
  @ApiOkResponse({
    description: 'Analytics data',
  })
  @ApiBearerAuth()
  receiveAnalytics(
    @Body() data: any,
  ) {
    console.log('data :>> ', data);
    this.analyticsService.processAnalytics(data);
    return { success: true };
  }
}