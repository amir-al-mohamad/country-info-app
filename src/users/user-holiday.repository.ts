import { Injectable } from '@nestjs/common';
import { UserHolidayEvent } from './interfaces';

@Injectable()
export class UserHolidayRepository {
  private userHolidays: UserHolidayEvent[] = [];

  find(
    userId: string,
    countryCode: string,
    holidayName: string,
    date: string,
  ): UserHolidayEvent | undefined {
    return this.userHolidays.find(
      (h) =>
        h.userId === userId &&
        h.countryCode === countryCode &&
        h.holidayName === holidayName &&
        h.date === date,
    );
  }

  findByUser(userId: string): UserHolidayEvent[] {
    return this.userHolidays.filter((h) => h.userId === userId);
  }

  saveMany(events: UserHolidayEvent[]) {
    this.userHolidays.push(...events);
  }

  remove(userId: string, eventId: string): boolean {
    const initialLength = this.userHolidays.length;
    this.userHolidays = this.userHolidays.filter(
      (h) => !(h.userId === userId && h.id === eventId),
    );
    return this.userHolidays.length < initialLength;
  }
}
