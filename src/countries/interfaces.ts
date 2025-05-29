export interface CountryInfo {
  name: string;
  countryCode: string;
  borders: string[];
  population: PopulationData[];
  flagUrl: string;
}

interface PopulationData {
  year: number;
  value: number;
}

export interface Country {
  countryCode: string;
  name: string;
}

export interface CountryInfoNagerResponse {
  commonName: string;
  officialName: string;
  countryCode: string;
  region: string;
  borders?: CountryInfoNagerResponse[];
}

export interface PopulationDataCountriesNowResponse {
  data: {
    populationCounts: {
      year: number;
      value: number;
    }[];
  };
}

export interface FlagResponseCountriesNowResponse {
  data: {
    flag: string;
  };
}
