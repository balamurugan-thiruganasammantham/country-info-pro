import { describe, it, expect } from "vitest";
import {
  getCountriesByRegion,
  getCountriesByContinent,
  getCountriesByLanguage,
  getCountriesByCurrency,
  getCountriesByCallingCode,
  getCountriesByGrouping,
  getCountriesByDrivingSide,
  getCountriesByTimezone,
  getGroupings,
  getAvailableGroupings,
  filterCountries,
  getAllCountries,
  getNeighbors,
  getCountry,
} from "../src";

describe("getAllCountries", () => {
  it("returns 250 countries", () => {
    expect(getAllCountries().length).toBe(250);
  });
});

describe("getCountriesByRegion", () => {
  it("returns European countries", () => {
    const countries = getCountriesByRegion("Europe");
    expect(countries.length).toBeGreaterThan(30);
    expect(countries.every((c) => c.region === "Europe")).toBe(true);
  });
});

describe("getCountriesByContinent", () => {
  it("returns Asian countries", () => {
    const countries = getCountriesByContinent("Asia");
    expect(countries.length).toBeGreaterThan(30);
    expect(countries.every((c) => c.continents.includes("Asia"))).toBe(true);
  });
});

describe("getCountriesByLanguage", () => {
  it("finds countries by language name", () => {
    const countries = getCountriesByLanguage("English");
    expect(countries.length).toBeGreaterThan(10);
  });

  it("finds countries by language code", () => {
    const countries = getCountriesByLanguage("eng");
    expect(countries.length).toBeGreaterThan(10);
  });
});

describe("getCountriesByCurrency", () => {
  it("finds countries using EUR", () => {
    const countries = getCountriesByCurrency("EUR");
    expect(countries.length).toBeGreaterThan(10);
  });

  it("is case-insensitive", () => {
    const countries = getCountriesByCurrency("eur");
    expect(countries.length).toBeGreaterThan(10);
  });
});

describe("getCountriesByCallingCode", () => {
  it("finds US and Canada by +1", () => {
    const countries = getCountriesByCallingCode("+1");
    const codes = countries.map((c) => c.cca2);
    expect(codes).toContain("US");
  });

  it("finds India by +91", () => {
    const countries = getCountriesByCallingCode("+91");
    const codes = countries.map((c) => c.cca2);
    expect(codes).toContain("IN");
  });
});

describe("filterCountries", () => {
  it("filters by region and language", () => {
    const countries = filterCountries({
      region: "Europe",
      language: "French",
    });
    expect(countries.length).toBeGreaterThan(0);
    expect(countries.every((c) => c.region === "Europe")).toBe(true);
  });

  it("filters by landlocked", () => {
    const countries = filterCountries({ landlocked: true });
    expect(countries.every((c) => c.landlocked === true)).toBe(true);
  });

  it("returns all countries with empty options", () => {
    const countries = filterCountries({});
    expect(countries.length).toBe(250);
  });
});

describe("getNeighbors", () => {
  it("returns neighboring countries for India", () => {
    const india = getCountry("IN")!;
    const neighbors = getNeighbors(india);
    const names = neighbors.map((c) => c.name.common);
    expect(names).toContain("Pakistan");
    expect(names).toContain("China");
    expect(names).toContain("Nepal");
  });

  it("returns empty array for island nations", () => {
    const japan = getCountry("JP")!;
    const neighbors = getNeighbors(japan);
    expect(neighbors).toEqual([]);
  });
});

describe("getCountriesByGrouping", () => {
  it("returns EU member countries", () => {
    const eu = getCountriesByGrouping("EU");
    expect(eu.length).toBe(27);
    const codes = eu.map((c) => c.cca2);
    expect(codes).toContain("FR");
    expect(codes).toContain("DE");
    expect(codes).toContain("IT");
    expect(codes).not.toContain("GB"); // Brexit
    expect(codes).not.toContain("US");
  });

  it("returns NATO members", () => {
    const nato = getCountriesByGrouping("NATO");
    expect(nato.length).toBe(32);
    const codes = nato.map((c) => c.cca2);
    expect(codes).toContain("US");
    expect(codes).toContain("GB");
    expect(codes).toContain("TR");
  });

  it("returns G7 members", () => {
    const g7 = getCountriesByGrouping("G7");
    expect(g7.length).toBe(7);
  });

  it("returns BRICS members", () => {
    const brics = getCountriesByGrouping("BRICS");
    const codes = brics.map((c) => c.cca2);
    expect(codes).toContain("BR");
    expect(codes).toContain("IN");
    expect(codes).toContain("CN");
  });

  it("returns ASEAN members", () => {
    const asean = getCountriesByGrouping("ASEAN");
    expect(asean.length).toBe(10);
  });

  it("returns FIVE_EYES members", () => {
    const fiveEyes = getCountriesByGrouping("FIVE_EYES");
    expect(fiveEyes.length).toBe(5);
    const codes = fiveEyes.map((c) => c.cca2);
    expect(codes).toContain("US");
    expect(codes).toContain("GB");
    expect(codes).toContain("AU");
  });
});

describe("getGroupings", () => {
  it("returns groupings for India", () => {
    const india = getCountry("IN")!;
    const groups = getGroupings(india);
    expect(groups).toContain("G20");
    expect(groups).toContain("BRICS");
    expect(groups).toContain("COMMONWEALTH");
    expect(groups).not.toContain("EU");
    expect(groups).not.toContain("NATO");
  });

  it("returns groupings for France", () => {
    const france = getCountry("FR")!;
    const groups = getGroupings(france);
    expect(groups).toContain("EU");
    expect(groups).toContain("NATO");
    expect(groups).toContain("G7");
    expect(groups).toContain("SCHENGEN");
  });
});

describe("getCountriesByDrivingSide", () => {
  it("returns left-driving countries", () => {
    const countries = getCountriesByDrivingSide("left");
    expect(countries.length).toBeGreaterThan(20);
    const codes = countries.map((c) => c.cca2);
    expect(codes).toContain("IN");
    expect(codes).toContain("GB");
    expect(codes).toContain("JP");
  });

  it("returns right-driving countries", () => {
    const countries = getCountriesByDrivingSide("right");
    expect(countries.length).toBeGreaterThan(100);
    const codes = countries.map((c) => c.cca2);
    expect(codes).toContain("US");
    expect(codes).toContain("FR");
    expect(codes).toContain("DE");
  });
});

describe("getCountriesByTimezone", () => {
  it("finds countries in UTC+05:30", () => {
    const countries = getCountriesByTimezone("UTC+05:30");
    const codes = countries.map((c) => c.cca2);
    expect(codes).toContain("IN");
    expect(codes).toContain("LK");
  });

  it("is case-insensitive", () => {
    const a = getCountriesByTimezone("utc+05:30");
    const b = getCountriesByTimezone("UTC+05:30");
    expect(a.length).toBe(b.length);
  });

  it("returns empty for invalid timezone", () => {
    expect(getCountriesByTimezone("UTC+99:99")).toEqual([]);
  });
});

describe("filterCountries with new options", () => {
  it("filters by driving side", () => {
    const countries = filterCountries({ drivingSide: "left", region: "Asia" });
    expect(countries.length).toBeGreaterThan(3);
    expect(countries.every((c) => c.car.side === "left")).toBe(true);
  });

  it("filters by timezone", () => {
    const countries = filterCountries({ timezone: "UTC+05:30" });
    const codes = countries.map((c) => c.cca2);
    expect(codes).toContain("IN");
  });
});

describe("getAvailableGroupings", () => {
  it("returns all grouping names", () => {
    const groupings = getAvailableGroupings();
    expect(groupings.length).toBe(18);
    expect(groupings).toContain("EU");
    expect(groupings).toContain("NATO");
    expect(groupings).toContain("BRICS");
  });
});
