import { Injectable, HttpException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as countries from 'i18n-iso-countries';
import type {
  Country,
  CountryInfoNagerResponse,
  CountryInfo,
  PopulationDataCountriesNowResponse,
  FlagResponseCountriesNowResponse,
} from './interfaces';

@Injectable()
export class CountriesService {
  private dateNagerApi: string;
  private countriesNowApi: string;

  constructor(private configService: ConfigService) {
    const dateNagerApi = this.configService.get<string>('NAGER_API');
    const countriesNowApi = this.configService.get<string>('COUNTRIESNOW_API');
    if (!dateNagerApi || !countriesNowApi) {
      throw new Error('API endpoints are not configured');
    }
    this.dateNagerApi = dateNagerApi;
    this.countriesNowApi = countriesNowApi;
  }

  async getAvailableCountries(): Promise<Country[]> {
    const res = await fetch(`${this.dateNagerApi}/AvailableCountries`);
    if (!res.ok)
      throw new HttpException('Failed to fetch countries', res.status);
    const data = (await res.json()) as Country[];
    return data;
  }

  async getCountryInfo(countryCode: string): Promise<CountryInfo> {
    const countryInfoRes = await fetch(
      `${this.dateNagerApi}/CountryInfo/${countryCode}`,
    );
    if (!countryInfoRes.ok)
      throw new HttpException(
        'Failed to fetch country info',
        countryInfoRes.status,
      );
    const countryInfoData =
      (await countryInfoRes.json()) as CountryInfoNagerResponse;

    const bordersData: CountryInfoNagerResponse[] =
      countryInfoData.borders || [];
    const borders = bordersData.map((border) => border.countryCode);

    const populationRes = await fetch(
      `${this.countriesNowApi}/countries/population`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          iso3: countries.alpha2ToAlpha3(countryInfoData.countryCode),
        }),
      },
    );
    if (!populationRes.ok)
      throw new HttpException(
        'Failed to fetch population',
        populationRes.status,
      );
    const populationData =
      (await populationRes.json()) as PopulationDataCountriesNowResponse;
    const population = populationData.data.populationCounts || [];

    const flagsRes = await fetch(
      `${this.countriesNowApi}/countries/flag/images`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          iso2: countryInfoData.countryCode,
        }),
      },
    );
    if (!flagsRes.ok)
      throw new HttpException('Failed to fetch flags', flagsRes.status);

    const flagsData =
      (await flagsRes.json()) as FlagResponseCountriesNowResponse;
    const flagUrl = flagsData.data.flag;

    return {
      name: countryInfoData.commonName,
      countryCode: countryInfoData.countryCode,
      borders,
      population,
      flagUrl,
    };
  }
}
