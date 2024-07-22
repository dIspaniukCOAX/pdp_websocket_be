import { Injectable } from '@nestjs/common';

@Injectable()
export class AnalyticsService {
  processAnalytics(data: any) {
    console.log('Received analytics data:', data);
    // Here you can handle the data, e.g., save it to a database
  }
}
