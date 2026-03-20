import { describe, it, expect } from "vitest";
import {
  getCountry,
  getCountryByAlpha2,
  getCountryByAlpha3,
  getCountryByNumericCode,
  getCountryByName,
  getCountryByCapital,
  getCountryByTLD,
  getPhoneCode,
  getCurrencyInfo,
  isValidCountryCode,
  searchCountry,
} from "../src";

describe("getCountryByAlpha2", () => {
  it("finds India by alpha-2 code", () => {
    const country = getCountryByAlpha2("IN");
    expect(country).toBeDefined();
    expect(country!.name.common).toBe("India");
  });

  it("is case-insensitive", () => {
    const country = getCountryByAlpha2("us");
    expect(country).toBeDefined();
    expect(country!.name.common).toBe("United States");
  });

  it("returns undefined for invalid code", () => {
    expect(getCountryByAlpha2("XX")).toBeUndefined();
  });
});

describe("getCountryByAlpha3", () => {
  it("finds Germany by alpha-3 code", () => {
    const country = getCountryByAlpha3("DEU");
    expect(country).toBeDefined();
    expect(country!.name.common).toBe("Germany");
  });

  it("is case-insensitive", () => {
    const country = getCountryByAlpha3("deu");
    expect(country).toBeDefined();
    expect(country!.name.common).toBe("Germany");
  });
});

describe("getCountryByNumericCode", () => {
  it("finds US by numeric code", () => {
    const country = getCountryByNumericCode("840");
    expect(country).toBeDefined();
    expect(country!.name.common).toBe("United States");
  });
});

describe("getCountryByName", () => {
  it("finds country by common name", () => {
    const country = getCountryByName("France");
    expect(country).toBeDefined();
    expect(country!.cca2).toBe("FR");
  });

  it("finds country by official name", () => {
    const country = getCountryByName("Republic of India");
    expect(country).toBeDefined();
    expect(country!.cca2).toBe("IN");
  });

  it("is case-insensitive", () => {
    const country = getCountryByName("JAPAN");
    expect(country).toBeDefined();
    expect(country!.cca2).toBe("JP");
  });

  it("returns undefined for unknown name", () => {
    expect(getCountryByName("Narnia")).toBeUndefined();
  });
});

describe("getCountry (smart lookup)", () => {
  it("detects 2-char as alpha-2", () => {
    const country = getCountry("IN");
    expect(country).toBeDefined();
    expect(country!.name.common).toBe("India");
  });

  it("detects 3-char letters as alpha-3", () => {
    const country = getCountry("USA");
    expect(country).toBeDefined();
    expect(country!.name.common).toBe("United States");
  });

  it("detects 3-digit as numeric code", () => {
    const country = getCountry("356");
    expect(country).toBeDefined();
    expect(country!.name.common).toBe("India");
  });

  it("falls back to name for longer strings", () => {
    const country = getCountry("India");
    expect(country).toBeDefined();
    expect(country!.cca2).toBe("IN");
  });

  it("returns undefined for empty string", () => {
    expect(getCountry("")).toBeUndefined();
  });

  it("returns undefined for whitespace only", () => {
    expect(getCountry("   ")).toBeUndefined();
  });

  it("resolves common aliases", () => {
    expect(getCountry("UK")!.cca2).toBe("GB");
    expect(getCountry("USA")!.cca2).toBe("US");
    expect(getCountry("America")!.cca2).toBe("US");
    expect(getCountry("Holland")!.cca2).toBe("NL");
    expect(getCountry("Burma")!.cca2).toBe("MM");
    expect(getCountry("UAE")!.cca2).toBe("AE");
  });
});

describe("country data completeness", () => {
  it("India has all expected fields", () => {
    const india = getCountry("IN")!;
    expect(india.name.common).toBe("India");
    expect(india.name.official).toBe("Republic of India");
    expect(india.cca2).toBe("IN");
    expect(india.cca3).toBe("IND");
    expect(india.ccn3).toBe("356");
    expect(india.capital).toContain("New Delhi");
    expect(india.region).toBe("Asia");
    expect(india.subregion).toBe("Southern Asia");
    expect(india.currencies.INR).toBeDefined();
    expect(india.currencies.INR.symbol).toBe("₹");
    expect(india.idd.root).toBe("+9");
    expect(india.idd.suffixes).toContain("1");
    expect(india.timezones).toContain("UTC+05:30");
    expect(india.languages.hin).toBe("Hindi");
    expect(india.population).toBeGreaterThan(0);
    expect(india.area).toBeGreaterThan(0);
    expect(india.flag).toBe("🇮🇳");
    expect(india.flags.svg).toContain("flagcdn.com");
    expect(india.maps.googleMaps).toContain("google.com/maps");
    expect(india.demonyms.eng.m).toBe("Indian");
    expect(india.borders).toContain("PAK");
    expect(india.car.side).toBe("left");
    expect(india.tld).toContain(".in");
    expect(india.continents).toContain("Asia");
    expect(india.latlng).toHaveLength(2);
    expect(india.postalCode).toBeDefined();
    expect(india.postalCode!.format).toBe("######");
  });
});

describe("getCountryByCapital", () => {
  it("finds India by capital", () => {
    const country = getCountryByCapital("New Delhi");
    expect(country).toBeDefined();
    expect(country!.cca2).toBe("IN");
  });

  it("is case-insensitive", () => {
    const country = getCountryByCapital("TOKYO");
    expect(country).toBeDefined();
    expect(country!.cca2).toBe("JP");
  });

  it("returns undefined for unknown capital", () => {
    expect(getCountryByCapital("Atlantis")).toBeUndefined();
  });
});

describe("getCountryByTLD", () => {
  it("finds India by .in", () => {
    const country = getCountryByTLD(".in");
    expect(country).toBeDefined();
    expect(country!.cca2).toBe("IN");
  });

  it("works without leading dot", () => {
    const country = getCountryByTLD("uk");
    expect(country).toBeDefined();
    expect(country!.cca2).toBe("GB");
  });
});

describe("getPhoneCode", () => {
  it("returns +91 for India", () => {
    const india = getCountry("IN")!;
    expect(getPhoneCode(india)).toBe("+91");
  });

  it("returns +1 for US (root only, many suffixes)", () => {
    const us = getCountry("US")!;
    expect(getPhoneCode(us)).toBe("+1");
  });
});

describe("getCurrencyInfo", () => {
  it("returns INR info for India", () => {
    const india = getCountry("IN")!;
    const info = getCurrencyInfo(india);
    expect(info).toBeDefined();
    expect(info!.code).toBe("INR");
    expect(info!.symbol).toBe("₹");
    expect(info!.name).toBe("Indian rupee");
  });
});

describe("isValidCountryCode", () => {
  it("validates alpha-2 codes", () => {
    expect(isValidCountryCode("US")).toBe(true);
    expect(isValidCountryCode("XX")).toBe(false);
  });

  it("validates alpha-3 codes", () => {
    expect(isValidCountryCode("USA")).toBe(true);
    expect(isValidCountryCode("XXX")).toBe(false);
  });

  it("returns false for non-code strings", () => {
    expect(isValidCountryCode("India")).toBe(false);
    expect(isValidCountryCode("123")).toBe(false);
  });
});

describe("searchCountry (singular)", () => {
  it("returns top result for good query", () => {
    const result = searchCountry("India");
    expect(result).toBeDefined();
    expect(result!.cca2).toBe("IN");
  });

  it("returns undefined for garbage query", () => {
    expect(searchCountry("xyzxyzxyz")).toBeUndefined();
  });
});
