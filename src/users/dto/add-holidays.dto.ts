import { IsString, IsNumber, IsArray, ArrayNotEmpty } from 'class-validator';

export class AddHolidaysDto {
  @IsString()
  countryCode: string;

  @IsNumber()
  year: number;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  holidays: string[];
}
