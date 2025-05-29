import { Injectable, HttpException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import { Holiday, UserHolidayEvent } from './interfaces';
import { UserHolidayRepository } from './user-holiday.repository';

@Injectable()
export class UsersService {
  private dateNagerApi: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly userRepo: UserHolidayRepository,
  ) {
    const api = this.configService.get<string>('NAGER_API');
    if (!api) {
      throw new Error('dateNagerApi is not configured');
    }
    this.dateNagerApi = api;
  }

  async addHolidaysToUserCalendar(
    userId: string,
    countryCode: string,
    year: number,
    holidaysFilter?: string[],
  ): Promise<UserHolidayEvent[]> {
    const res = await fetch(
      `${this.dateNagerApi}/PublicHolidays/${year}/${countryCode}`,
    );
    if (!res.ok)
      throw new HttpException('Failed to fetch holidays', res.status);

    const holidays = (await res.json()) as Holiday[];

    const filtered = holidaysFilter?.length
      ? holidays.filter((h) => holidaysFilter.includes(h.name))
      : holidays;

    const newEvents: UserHolidayEvent[] = [];

    for (const holiday of filtered) {
      const exists = this.userRepo.find(
        userId,
        countryCode,
        holiday.name,
        holiday.date,
      );

      if (!exists) {
        newEvents.push({
          id: uuidv4(),
          userId,
          countryCode,
          year,
          holidayName: holiday.name,
          date: holiday.date,
        });
      }
    }

    this.userRepo.saveMany(newEvents);

    return newEvents;
  }

  getUserHolidays(userId: string): UserHolidayEvent[] {
    return this.userRepo.findByUser(userId);
  }

  removeUserHoliday(userId: string, eventId: string): boolean {
    return this.userRepo.remove(userId, eventId);
  }
}
