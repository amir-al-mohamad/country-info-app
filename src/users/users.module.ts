import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserHolidayRepository } from './user-holiday.repository';

@Module({
  controllers: [UsersController],
  providers: [UsersService, UserHolidayRepository],
  exports: [UsersService],
})
export class UsersModule {}
