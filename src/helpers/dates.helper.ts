import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';

export class DatesHelper {
  constructor() {
    dayjs.extend(isBetween);
  }

  static checkIsDatesTheSame({
    startDate,
    endDate,
    targetStartDate,
    targetEndDate,
  }: {
    startDate: string;
    endDate: string;
    targetStartDate: string;
    targetEndDate: string;
  }) {
    return (
      (dayjs(targetStartDate).isSame(startDate) &&
        dayjs(targetEndDate).isSame(endDate)) ||
      dayjs(startDate).isSame(targetEndDate)
    );
  }

  static getDateRange(startDate: string, endDate: string): dayjs.Dayjs[] {
    let currentDate = dayjs(startDate);

    const createBookingDatesRange = [];

    while (currentDate.isBefore(endDate) || currentDate.isSame(endDate)) {
      currentDate = currentDate.add(1, 'day');
      createBookingDatesRange.push(currentDate);
    }

    return createBookingDatesRange;
  }
}
