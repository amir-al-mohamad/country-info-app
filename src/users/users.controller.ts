import {
  Controller,
  Post,
  Param,
  Body,
  Get,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AddHolidaysDto } from './dto/add-holidays.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post(':userId/calendar/holidays')
  async addHolidaysToCalendar(
    @Param('userId') userId: string,
    @Body() body: AddHolidaysDto,
  ) {
    return this.usersService.addHolidaysToUserCalendar(
      userId,
      body.countryCode,
      +body.year,
      body.holidays,
    );
  }

  @Get(':userId/calendar/holidays')
  getUserHolidays(@Param('userId') userId: string) {
    return this.usersService.getUserHolidays(userId);
  }

  @Delete(':userId/calendar/holidays/:eventId')
  deleteUserHoliday(
    @Param('userId') userId: string,
    @Param('eventId', new ParseUUIDPipe()) eventId: string,
  ) {
    return this.usersService.removeUserHoliday(userId, eventId);
  }
}
