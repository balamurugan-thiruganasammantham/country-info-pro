/** Country groupings: political, economic, and regional organizations.
 *  Values are ISO 3166-1 alpha-2 codes. */

export type CountryGrouping =
  | "EU"
  | "NATO"
  | "G7"
  | "G20"
  | "BRICS"
  | "ASEAN"
  | "AU" // African Union
  | "ARAB_LEAGUE"
  | "COMMONWEALTH"
  | "SCHENGEN"
  | "EUROZONE"
  | "FIVE_EYES"
  | "OPEC"
  | "MERCOSUR"
  | "CARICOM"
  | "NORDIC"
  | "BENELUX"
  | "APEC";

export const GROUPINGS: Record<CountryGrouping, readonly string[]> = {
  EU: [
    "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR",
    "DE", "GR", "HU", "IE", "IT", "LV", "LT", "LU", "MT", "NL",
    "PL", "PT", "RO", "SK", "SI", "ES", "SE",
  ],
  NATO: [
    "AL", "BE", "BG", "CA", "HR", "CZ", "DK", "EE", "FI", "FR",
    "DE", "GR", "HU", "IS", "IT", "LV", "LT", "LU", "ME", "NL",
    "MK", "NO", "PL", "PT", "RO", "SK", "SI", "ES", "SE", "TR",
    "GB", "US",
  ],
  G7: ["CA", "FR", "DE", "IT", "JP", "GB", "US"],
  G20: [
    "AR", "AU", "BR", "CA", "CN", "FR", "DE", "IN", "ID", "IT",
    "JP", "KR", "MX", "RU", "SA", "ZA", "TR", "GB", "US",
  ],
  BRICS: ["BR", "RU", "IN", "CN", "ZA", "EG", "ET", "IR", "AE"],
  ASEAN: [
    "BN", "KH", "ID", "LA", "MY", "MM", "PH", "SG", "TH", "VN",
  ],
  AU: [
    "DZ", "AO", "BJ", "BW", "BF", "BI", "CV", "CM", "CF", "TD",
    "KM", "CG", "CD", "CI", "DJ", "EG", "GQ", "ER", "SZ", "ET",
    "GA", "GM", "GH", "GN", "GW", "KE", "LS", "LR", "LY", "MG",
    "MW", "ML", "MR", "MU", "MZ", "NA", "NE", "NG", "RW", "ST",
    "SN", "SC", "SL", "SO", "ZA", "SS", "SD", "TZ", "TG", "TN",
    "UG", "ZM", "ZW",
  ],
  ARAB_LEAGUE: [
    "DZ", "BH", "KM", "DJ", "EG", "IQ", "JO", "KW", "LB", "LY",
    "MR", "MA", "OM", "PS", "QA", "SA", "SO", "SD", "SY", "TN",
    "AE", "YE",
  ],
  COMMONWEALTH: [
    "AG", "AU", "BS", "BD", "BB", "BZ", "BW", "BN", "CM", "CA",
    "CY", "DM", "SZ", "FJ", "GM", "GH", "GD", "GY", "IN", "JM",
    "KE", "KI", "LS", "MW", "MY", "MV", "MT", "MU", "MZ", "NA",
    "NR", "NZ", "NG", "PK", "PG", "RW", "KN", "LC", "VC", "WS",
    "SC", "SL", "SG", "SB", "ZA", "LK", "TZ", "TO", "TT", "TV",
    "UG", "GB", "VU", "ZM",
  ],
  SCHENGEN: [
    "AT", "BE", "BG", "HR", "CZ", "DK", "EE", "FI", "FR", "DE",
    "GR", "HU", "IS", "IT", "LV", "LI", "LT", "LU", "MT", "NL",
    "NO", "PL", "PT", "RO", "SK", "SI", "ES", "SE", "CH",
  ],
  EUROZONE: [
    "AT", "BE", "HR", "CY", "EE", "FI", "FR", "DE", "GR", "IE",
    "IT", "LV", "LT", "LU", "MT", "NL", "PT", "SK", "SI", "ES",
  ],
  FIVE_EYES: ["AU", "CA", "NZ", "GB", "US"],
  OPEC: [
    "DZ", "AO", "CG", "GQ", "GA", "IR", "IQ", "KW", "LY", "NG",
    "SA", "AE", "VE",
  ],
  MERCOSUR: ["AR", "BR", "PY", "UY"],
  CARICOM: [
    "AG", "BS", "BB", "BZ", "DM", "GD", "GY", "HT", "JM", "KN",
    "LC", "VC", "SR", "TT",
  ],
  NORDIC: ["DK", "FI", "IS", "NO", "SE"],
  BENELUX: ["BE", "NL", "LU"],
  APEC: [
    "AU", "BN", "CA", "CL", "CN", "HK", "ID", "JP", "KR", "MY",
    "MX", "NZ", "PG", "PE", "PH", "RU", "SG", "TW", "TH", "US",
    "VN",
  ],
} as const;
