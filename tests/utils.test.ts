import { describe, it, expect } from "vitest";
import {
  getCountry,
  toEmojiFlag,
  getDistance,
  getRandomCountry,
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
