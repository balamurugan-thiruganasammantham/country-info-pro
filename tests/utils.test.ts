import { describe, it, expect } from "vitest";
import {
  getCountry,
  toEmojiFlag,
  getDistance,
  getRandomCountry,
  getRandomCountries,
  getCountriesByPopulation,
  getCountriesByArea,
  getCountriesByBorderCount,
  sortCountries,
  getAllCurrencies,
  getAllLanguages,
  getAllTimezones,
  getAllCountries,
  formatCountry,
  filterCountries,
  compareCountries,
  validatePostalCode,
  getClosestCountries,
  getCountriesBySubregion,
  getCountriesByStartOfWeek,
} from "../src";

describe("toEmojiFlag", () => {
  it("generates correct emoji for US", () => {
    expect(toEmojiFlag("US")).toBe("🇺🇸");
  });

  it("generates correct emoji for India", () => {
    expect(toEmojiFlag("IN")).toBe("🇮🇳");
  });

  it("is case-insensitive", () => {
    expect(toEmojiFlag("gb")).toBe("🇬🇧");
  });

  it("returns empty string for invalid input", () => {
    expect(toEmojiFlag("X")).toBe("");
    expect(toEmojiFlag("ABC")).toBe("");
  });

  it("matches stored flag data", () => {
    const india = getCountry("IN")!;
    expect(toEmojiFlag(india.cca2)).toBe(india.flag);
  });
});

describe("getDistance", () => {
  it("calculates distance between India and Japan", () => {
    const india = getCountry("IN")!;
    const japan = getCountry("JP")!;
    const dist = getDistance(india, japan);
    // Roughly 5,800-6,200 km
    expect(dist).toBeGreaterThan(5500);
    expect(dist).toBeLessThan(6500);
  });

  it("returns 0 for same country", () => {
    const india = getCountry("IN")!;
    expect(getDistance(india, india)).toBe(0);
  });

  it("calculates distance between US and UK", () => {
    const us = getCountry("US")!;
    const uk = getCountry("UK")!;
    const dist = getDistance(us, uk);
    // Roughly 6,500-8,000 km
    expect(dist).toBeGreaterThan(6000);
    expect(dist).toBeLessThan(9000);
  });
});

describe("getRandomCountry", () => {
  it("returns a country object", () => {
    const country = getRandomCountry();
    expect(country).toBeDefined();
    expect(country.cca2).toBeDefined();
    expect(country.name.common).toBeDefined();
  });

  it("respects filter predicate", () => {
    const european = getRandomCountry((c) => c.region === "Europe");
    expect(european.region).toBe("Europe");
  });

  it("returns different results over multiple calls", () => {
    const results = new Set<string>();
    for (let i = 0; i < 20; i++) {
      results.add(getRandomCountry().cca2);
    }
    // Should get at least 2 different countries in 20 tries
    expect(results.size).toBeGreaterThan(1);
  });
});

describe("compareCountries", () => {
  it("compares India and Japan", () => {
    const india = getCountry("IN")!;
    const japan = getCountry("JP")!;
    const comparison = compareCountries(india, japan);

    expect(comparison.name.a).toBe("India");
    expect(comparison.name.b).toBe("Japan");
    expect(comparison.capital.a).toBe("New Delhi");
    expect(comparison.capital.b).toBe("Tokyo");
    expect(comparison.region.a).toBe("Asia");
    expect(comparison.region.b).toBe("Asia");
    expect(comparison.drivingSide.a).toBe("left");
    expect(comparison.drivingSide.b).toBe("left");
  });

  it("handles all comparison fields", () => {
    const us = getCountry("US")!;
    const de = getCountry("DE")!;
    const comparison = compareCountries(us, de);

    expect(comparison).toHaveProperty("population");
    expect(comparison).toHaveProperty("area");
    expect(comparison).toHaveProperty("languages");
    expect(comparison).toHaveProperty("currencies");
    expect(comparison).toHaveProperty("timezones");
    expect(comparison).toHaveProperty("landlocked");
  });
});

describe("validatePostalCode", () => {
  it("validates US zip code", () => {
    const us = getCountry("US")!;
    expect(validatePostalCode(us, "90210")).toBe(true);
    expect(validatePostalCode(us, "90210-1234")).toBe(true);
    expect(validatePostalCode(us, "ABCDE")).toBe(false);
  });

  it("validates Indian PIN code", () => {
    const india = getCountry("IN")!;
    expect(validatePostalCode(india, "110001")).toBe(true);
    expect(validatePostalCode(india, "1100")).toBe(false);
  });

  it("returns false for countries without postal codes", () => {
    const country = getCountry("AQ")!; // Antarctica
    expect(validatePostalCode(country, "12345")).toBe(false);
  });
});

describe("getClosestCountries", () => {
  it("returns nearest countries to India", () => {
    const india = getCountry("IN")!;
    const closest = getClosestCountries(india, 3);

    expect(closest).toHaveLength(3);
    expect(closest[0].distance).toBeLessThan(closest[1].distance);
    expect(closest[1].distance).toBeLessThan(closest[2].distance);

    // Nepal and Sri Lanka should be among the closest
    const names = closest.map((c) => c.country.name.common);
    expect(
      names.includes("Nepal") || names.includes("Sri Lanka") || names.includes("Bangladesh")
    ).toBe(true);
  });

  it("excludes the country itself", () => {
    const india = getCountry("IN")!;
    const closest = getClosestCountries(india, 5);
    const codes = closest.map((c) => c.country.cca2);
    expect(codes).not.toContain("IN");
  });

  it("returns distances in kilometers", () => {
    const us = getCountry("US")!;
    const closest = getClosestCountries(us, 1);
    expect(closest[0].distance).toBeGreaterThan(0);
    expect(typeof closest[0].distance).toBe("number");
  });
});

describe("getRandomCountries", () => {
  it("returns the requested number of countries", () => {
    const countries = getRandomCountries(5);
    expect(countries).toHaveLength(5);
  });

  it("returns unique countries", () => {
    const countries = getRandomCountries(10);
    const codes = countries.map((c) => c.cca2);
    expect(new Set(codes).size).toBe(10);
  });

  it("respects filter predicate", () => {
    const countries = getRandomCountries(3, (c) => c.region === "Europe");
    expect(countries).toHaveLength(3);
    expect(countries.every((c) => c.region === "Europe")).toBe(true);
  });

  it("returns all if count exceeds pool", () => {
    const countries = getRandomCountries(999, (c) => c.cca2 === "IN");
    expect(countries).toHaveLength(1);
    expect(countries[0].cca2).toBe("IN");
  });
});

describe("getCountriesByPopulation", () => {
  it("returns countries above minimum population", () => {
    const countries = getCountriesByPopulation(1_000_000_000);
    const codes = countries.map((c) => c.cca2);
    expect(codes).toContain("IN");
    expect(codes).toContain("CN");
    expect(countries.length).toBeGreaterThanOrEqual(2);
  });

  it("returns countries in population range", () => {
    const countries = getCountriesByPopulation(50_000_000, 100_000_000);
    expect(countries.length).toBeGreaterThan(5);
    expect(countries.every((c) => c.population >= 50_000_000 && c.population <= 100_000_000)).toBe(true);
  });

  it("returns all with no limits", () => {
    const countries = getCountriesByPopulation();
    expect(countries.length).toBe(250);
  });
});

describe("getCountriesByArea", () => {
  it("returns large countries", () => {
    const countries = getCountriesByArea(5_000_000);
    const codes = countries.map((c) => c.cca2);
    expect(codes).toContain("RU");
    expect(codes).toContain("CN");
    expect(codes).toContain("US");
  });

  it("returns small countries", () => {
    const countries = getCountriesByArea(0, 1000);
    expect(countries.length).toBeGreaterThan(10);
    expect(countries.every((c) => c.area <= 1000)).toBe(true);
  });
});

describe("formatCountry", () => {
  it("returns a flat summary for India", () => {
    const india = getCountry("IN")!;
    const summary = formatCountry(india);

    expect(summary.name).toBe("India");
    expect(summary.officialName).toBe("Republic of India");
    expect(summary.iso2).toBe("IN");
    expect(summary.iso3).toBe("IND");
    expect(summary.numericCode).toBe("356");
    expect(summary.capital).toBe("New Delhi");
    expect(summary.region).toBe("Asia");
    expect(summary.subregion).toBe("Southern Asia");
    expect(summary.continent).toBe("Asia");
    expect(summary.population).toBeGreaterThan(0);
    expect(summary.area).toBeGreaterThan(0);
    expect(summary.currency).toBeDefined();
    expect(summary.currency!.code).toBe("INR");
    expect(summary.currency!.symbol).toBe("₹");
    expect(summary.phoneCode).toBe("+91");
    expect(summary.flag).toBe("🇮🇳");
    expect(summary.flagUrl).toContain("flagcdn.com");
    expect(summary.mapUrl).toContain("google");
    expect(summary.languages).toContain("Hindi");
    expect(summary.timezones).toContain("UTC+05:30");
    expect(summary.borders).toContain("PAK");
    expect(summary.drivingSide).toBe("left");
    expect(summary.tld).toBe(".in");
    expect(summary.landlocked).toBe(false);
    expect(summary.independent).toBe(true);
    expect(summary.latlng).toHaveLength(2);
  });

  it("handles country without currency", () => {
    const aq = getCountry("AQ")!; // Antarctica
    const summary = formatCountry(aq);
    expect(summary.name).toBe("Antarctica");
    expect(summary.currency).toBeNull();
  });
});

describe("filterCountries with population/area ranges", () => {
  it("filters by population range", () => {
    const countries = filterCountries({
      populationMin: 100_000_000,
      region: "Asia",
    });
    expect(countries.length).toBeGreaterThan(2);
    expect(countries.every((c) => c.population >= 100_000_000 && c.region === "Asia")).toBe(true);
  });

  it("filters by area range", () => {
    const countries = filterCountries({
      areaMax: 500,
      independent: true,
    });
    expect(countries.length).toBeGreaterThan(0);
    expect(countries.every((c) => c.area <= 500)).toBe(true);
  });
});

describe("sortCountries", () => {
  it("sorts by name ascending", () => {
    const all = getAllCountries();
    const sorted = sortCountries(all, "name", "asc");
    expect(sorted[0].name.common.localeCompare(sorted[1].name.common)).toBeLessThanOrEqual(0);
    expect(sorted.length).toBe(250);
  });

  it("sorts by population descending", () => {
    const all = getAllCountries();
    const sorted = sortCountries(all, "population", "desc");
    expect(sorted[0].population).toBeGreaterThan(sorted[1].population);
    // China or India should be first
    expect(["CN", "IN"]).toContain(sorted[0].cca2);
  });

  it("sorts by area ascending", () => {
    const all = getAllCountries();
    const sorted = sortCountries(all, "area", "asc");
    expect(sorted[0].area).toBeLessThanOrEqual(sorted[1].area);
  });

  it("does not mutate original array", () => {
    const all = getAllCountries();
    const first = all[0].cca2;
    sortCountries(all, "population", "desc");
    expect(all[0].cca2).toBe(first);
  });
});

describe("getCountriesByBorderCount", () => {
  it("returns island nations (0 borders)", () => {
    const islands = getCountriesByBorderCount(0);
    expect(islands.length).toBeGreaterThan(50);
    const codes = islands.map((c) => c.cca2);
    expect(codes).toContain("JP");
    expect(codes).toContain("AU");
    expect(codes).not.toContain("IN"); // India has 6 borders
  });

  it("returns countries with exactly 1 border", () => {
    const one = getCountriesByBorderCount(1);
    expect(one.length).toBeGreaterThan(3);
    const codes = one.map((c) => c.cca2);
    expect(codes).toContain("PT"); // Portugal borders only Spain
  });
});

describe("getAllCurrencies", () => {
  it("returns all unique currencies", () => {
    const currencies = getAllCurrencies();
    expect(currencies.length).toBeGreaterThan(100);
    const usd = currencies.find((c) => c.code === "USD");
    expect(usd).toBeDefined();
    expect(usd!.name).toBe("United States dollar");
    expect(usd!.symbol).toBe("$");
    expect(usd!.countries).toContain("US");
  });

  it("is sorted by code", () => {
    const currencies = getAllCurrencies();
    for (let i = 1; i < currencies.length; i++) {
      expect(currencies[i - 1].code.localeCompare(currencies[i].code)).toBeLessThanOrEqual(0);
    }
  });
});

describe("getAllLanguages", () => {
  it("returns all unique languages", () => {
    const languages = getAllLanguages();
    expect(languages.length).toBeGreaterThan(100);
    const eng = languages.find((l) => l.code === "eng");
    expect(eng).toBeDefined();
    expect(eng!.name).toBe("English");
    expect(eng!.countries.length).toBeGreaterThan(10);
  });
});

describe("getAllTimezones", () => {
  it("returns all unique timezones", () => {
    const timezones = getAllTimezones();
    expect(timezones.length).toBeGreaterThan(30);
    const utc530 = timezones.find((t) => t.timezone === "UTC+05:30");
    expect(utc530).toBeDefined();
    expect(utc530!.countries).toContain("IN");
  });
});

describe("getCountriesBySubregion", () => {
  it("returns Southern Asian countries", () => {
    const countries = getCountriesBySubregion("Southern Asia");
    expect(countries.length).toBeGreaterThan(5);
    const codes = countries.map((c) => c.cca2);
    expect(codes).toContain("IN");
    expect(codes).toContain("PK");
  });

  it("is case-insensitive", () => {
    const a = getCountriesBySubregion("western europe");
    const b = getCountriesBySubregion("Western Europe");
    expect(a.length).toBe(b.length);
  });

  it("returns empty for invalid subregion", () => {
    expect(getCountriesBySubregion("Narnia")).toEqual([]);
  });
});

describe("getCountriesByStartOfWeek", () => {
  it("returns countries starting week on monday", () => {
    const countries = getCountriesByStartOfWeek("monday");
    expect(countries.length).toBeGreaterThan(100);
  });

  it("returns countries starting week on sunday", () => {
    const countries = getCountriesByStartOfWeek("sunday");
    expect(countries.length).toBeGreaterThan(20);
    const codes = countries.map((c) => c.cca2);
    expect(codes).toContain("US");
    expect(codes).toContain("IN");
  });
});
