export interface CountryName {
  common: string;
  official: string;
}

export interface Currency {
  name: string;
  symbol: string;
}

export interface InternationalDialing {
  root: string;
  suffixes: string[];
}

export interface Demonym {
  f: string;
  m: string;
}

export interface Maps {
  googleMaps: string;
  openStreetMaps: string;
}

export interface CarInfo {
  signs: string[];
  side: "left" | "right";
}

export interface FlagUrls {
  png: string;
  svg: string;
  alt: string;
}

export interface PostalCode {
  format: string;
  regex: string;
}

export type Region =
  | "Africa"
  | "Americas"
  | "Antarctic"
  | "Asia"
  | "Europe"
  | "Oceania";

export type Continent =
  | "Africa"
  | "Antarctica"
  | "Asia"
  | "Europe"
  | "North America"
  | "Oceania"
  | "South America";

export interface Country {
  name: CountryName;
  tld: string[];
  cca2: string;
  ccn3: string;
  cca3: string;
  independent: boolean | null;
  unMember: boolean;
  currencies: Record<string, Currency>;
  idd: InternationalDialing;
  capital: string[];
  altSpellings: string[];
  region: Region;
  subregion: string;
  languages: Record<string, string>;
  latlng: [number, number];
  landlocked: boolean;
  borders: string[];
  area: number;
  demonyms: Record<string, Demonym>;
  flag: string;
  maps: Maps;
  population: number;
  gini?: Record<string, number> | null;
  fifa?: string | null;
  car: CarInfo;
  timezones: string[];
  continents: Continent[];
  flags: FlagUrls;
  startOfWeek: string;
  postalCode: PostalCode | null;
}

export interface SearchResult {
  country: Country;
  score: number;
  matchedOn: string;
}

export interface SearchOptions {
  limit?: number;
  threshold?: number;
}

export interface FilterOptions {
  region?: Region;
  subregion?: string;
  continent?: Continent;
  language?: string;
  currency?: string;
  independent?: boolean;
  unMember?: boolean;
  landlocked?: boolean;
  drivingSide?: "left" | "right";
  timezone?: string;
}
