export interface Holiday {
  date: string;
  localName: string;
  name: string;
}

export interface UserHolidayEvent {
  id: string;
  userId: string;
  countryCode: string;
  year: number;
  holidayName: string;
  date: string;
}
