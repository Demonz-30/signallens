import { CompanyFundamentalData, DataSourceMode } from "@/domain";

/**
 * DETERMINISTIC MOCK FIXTURES FOR SIGNALLENS
 *
 * NOTE: These fixtures are strictly marked with `sourceMode: DataSourceMode.MOCK`.
 * They reflect the exact normalized response schema returned by the Sectors REST v2 API:
 * `GET /v2/company/report/{symbol}/?sections=financials,overview`
 */

export const MOCK_BANKS_DATA: Record<string, CompanyFundamentalData> = {
  BBCA: {
    symbol: "BBCA",
    name: "PT Bank Central Asia Tbk.",
    sector: "Financials",
    subSector: "Banks",
    industry: "Banks",
    subIndustry: "Banks",
    sourceMode: DataSourceMode.MOCK,
    retrievedAt: "2026-10-05T00:00:00Z",
    yoyQuarterRevenueGrowth: 0.142,
    yoyQuarterEarningsGrowth: 0.158,
    historicalFinancials: [
      { year: 2022, revenue: 87400000000000, earnings: 40700000000000 },
      { year: 2023, revenue: 99300000000000, earnings: 48600000000000 },
      { year: 2024, revenue: 124125000000000, earnings: 58200000000000 }, // ~25.0% YoY growth (Outlier)
    ],
  },
  BBRI: {
    symbol: "BBRI",
    name: "PT Bank Rakyat Indonesia (Persero) Tbk.",
    sector: "Financials",
    subSector: "Banks",
    industry: "Banks",
    subIndustry: "Banks",
    sourceMode: DataSourceMode.MOCK,
    retrievedAt: "2026-10-05T00:00:00Z",
    yoyQuarterRevenueGrowth: 0.082,
    yoyQuarterEarningsGrowth: 0.071,
    historicalFinancials: [
      { year: 2022, revenue: 155800000000000, earnings: 51400000000000 },
      { year: 2023, revenue: 171200000000000, earnings: 60400000000000 },
      { year: 2024, revenue: 184896000000000, earnings: 62100000000000 }, // ~8.0% YoY growth
    ],
  },
  BMRI: {
    symbol: "BMRI",
    name: "PT Bank Mandiri (Persero) Tbk.",
    sector: "Financials",
    subSector: "Banks",
    industry: "Banks",
    subIndustry: "Banks",
    sourceMode: DataSourceMode.MOCK,
    retrievedAt: "2026-10-05T00:00:00Z",
    yoyQuarterRevenueGrowth: 0.091,
    yoyQuarterEarningsGrowth: 0.088,
    historicalFinancials: [
      { year: 2022, revenue: 120500000000000, earnings: 41200000000000 },
      { year: 2023, revenue: 135800000000000, earnings: 55100000000000 },
      { year: 2024, revenue: 147343000000000, earnings: 60100000000000 }, // ~8.5% YoY growth
    ],
  },
  BBNI: {
    symbol: "BBNI",
    name: "PT Bank Negara Indonesia (Persero) Tbk.",
    sector: "Financials",
    subSector: "Banks",
    industry: "Banks",
    subIndustry: "Banks",
    sourceMode: DataSourceMode.MOCK,
    retrievedAt: "2026-10-05T00:00:00Z",
    yoyQuarterRevenueGrowth: 0.075,
    yoyQuarterEarningsGrowth: 0.065,
    historicalFinancials: [
      { year: 2022, revenue: 62400000000000, earnings: 18300000000000 },
      { year: 2023, revenue: 68900000000000, earnings: 20900000000000 },
      { year: 2024, revenue: 73723000000000, earnings: 22100000000000 }, // ~7.0% YoY growth
    ],
  },
  BBTN: {
    symbol: "BBTN",
    name: "PT Bank Tabungan Negara (Persero) Tbk.",
    sector: "Financials",
    subSector: "Banks",
    industry: "Banks",
    subIndustry: "Banks",
    sourceMode: DataSourceMode.MOCK,
    retrievedAt: "2026-10-05T00:00:00Z",
    yoyQuarterRevenueGrowth: 0.061,
    yoyQuarterEarningsGrowth: 0.045,
    historicalFinancials: [
      { year: 2022, revenue: 25800000000000, earnings: 3040000000000 },
      { year: 2023, revenue: 28400000000000, earnings: 3500000000000 },
      { year: 2024, revenue: 30104000000000, earnings: 3620000000000 }, // ~6.0% YoY growth
    ],
  },
};

/**
 * Consumer staples fixtures: Clustered growth, demonstrating NO_MATERIAL_OUTLIER
 */
export const MOCK_CONSUMER_DATA: Record<string, CompanyFundamentalData> = {
  ICBP: {
    symbol: "ICBP",
    name: "PT Indofood CBP Sukses Makmur Tbk.",
    sector: "Consumer Non-Cyclicals",
    subSector: "Food & Beverage",
    industry: "Processed Foods",
    sourceMode: DataSourceMode.MOCK,
    retrievedAt: "2026-10-05T00:00:00Z",
    historicalFinancials: [
      { year: 2023, revenue: 67910000000000 },
      { year: 2024, revenue: 71712960000000 }, // 5.6%
    ],
  },
  INDF: {
    symbol: "INDF",
    name: "PT Indofood Sukses Makmur Tbk.",
    sector: "Consumer Non-Cyclicals",
    subSector: "Food & Beverage",
    industry: "Processed Foods",
    sourceMode: DataSourceMode.MOCK,
    retrievedAt: "2026-10-05T00:00:00Z",
    historicalFinancials: [
      { year: 2023, revenue: 111700000000000 },
      { year: 2024, revenue: 117621800000000 }, // 5.3%
    ],
  },
  MYOR: {
    symbol: "MYOR",
    name: "PT Mayora Indah Tbk.",
    sector: "Consumer Non-Cyclicals",
    subSector: "Food & Beverage",
    industry: "Packaged Food",
    sourceMode: DataSourceMode.MOCK,
    retrievedAt: "2026-10-05T00:00:00Z",
    historicalFinancials: [
      { year: 2023, revenue: 31480000000000 },
      { year: 2024, revenue: 33305840000000 }, // 5.8%
    ],
  },
  CMRY: {
    symbol: "CMRY",
    name: "PT Cisarua Mountain Dairy Tbk.",
    sector: "Consumer Non-Cyclicals",
    subSector: "Food & Beverage",
    industry: "Dairy Products",
    sourceMode: DataSourceMode.MOCK,
    retrievedAt: "2026-10-05T00:00:00Z",
    historicalFinancials: [
      { year: 2023, revenue: 7770000000000 },
      { year: 2024, revenue: 8228430000000 }, // 5.9%
    ],
  },
  UNVR: {
    symbol: "UNVR",
    name: "PT Unilever Indonesia Tbk.",
    sector: "Consumer Non-Cyclicals",
    subSector: "Household Products",
    industry: "Personal Care",
    sourceMode: DataSourceMode.MOCK,
    retrievedAt: "2026-10-05T00:00:00Z",
    historicalFinancials: [
      { year: 2023, revenue: 38610000000000 },
      { year: 2024, revenue: 40579110000000 }, // 5.1%
    ],
  },
};

/**
 * Period Mismatch fixtures: Demonstrating INCOMPARABLE_DATA
 * One company has missing historical years, or reports an entirely different fiscal period.
 */
export const MOCK_MISMATCH_DATA: Record<string, CompanyFundamentalData> = {
  TECH_A: {
    symbol: "TECH_A",
    name: "Tech Alpha Tbk.",
    sector: "Technology",
    subSector: "Software & IT Services",
    sourceMode: DataSourceMode.MOCK,
    retrievedAt: "2026-10-05T00:00:00Z",
    historicalFinancials: [
      // Only 2022 and 2023 available; 2024 missing due to fiscal year change
      { year: 2022, revenue: 1000000000000 },
      { year: 2023, revenue: 1800000000000 },
    ],
  },
  PEER_B: {
    symbol: "PEER_B",
    name: "Peer Beta Tbk.",
    sector: "Technology",
    subSector: "Software & IT Services",
    sourceMode: DataSourceMode.MOCK,
    retrievedAt: "2026-10-05T00:00:00Z",
    historicalFinancials: [
      { year: 2023, revenue: 5000000000000 },
      { year: 2024, revenue: 5500000000000 },
    ],
  },
  PEER_C: {
    symbol: "PEER_C",
    name: "Peer Gamma Tbk.",
    sector: "Technology",
    subSector: "Software & IT Services",
    sourceMode: DataSourceMode.MOCK,
    retrievedAt: "2026-10-05T00:00:00Z",
    historicalFinancials: [
      { year: 2023, revenue: 3000000000000 },
      { year: 2024, revenue: 3300000000000 },
    ],
  },
  PEER_D: {
    symbol: "PEER_D",
    name: "Peer Delta Tbk.",
    sector: "Technology",
    subSector: "Software & IT Services",
    sourceMode: DataSourceMode.MOCK,
    retrievedAt: "2026-10-05T00:00:00Z",
    historicalFinancials: [
      { year: 2023, revenue: 4000000000000 },
      { year: 2024, revenue: 4400000000000 },
    ],
  },
};

/**
 * Malformed / Null Data fixtures: Demonstrating DATA_QUALITY_RISK
 */
export const MOCK_CORRUPT_DATA: Record<string, CompanyFundamentalData> = {
  CORRUPT_A: {
    symbol: "CORRUPT_A",
    name: "Anomalous Reporting Tbk.",
    sector: "Energy",
    sourceMode: DataSourceMode.MOCK,
    retrievedAt: "2026-10-05T00:00:00Z",
    historicalFinancials: [
      { year: 2023, revenue: null }, // Null revenue prevents deterministic division
      { year: 2024, revenue: 5000000000000 },
    ],
  },
  PEER_X: {
    symbol: "PEER_X",
    name: "Energy Peer X Tbk.",
    sector: "Energy",
    sourceMode: DataSourceMode.MOCK,
    retrievedAt: "2026-10-05T00:00:00Z",
    historicalFinancials: [
      { year: 2023, revenue: 10000000000000 },
      { year: 2024, revenue: 11000000000000 },
    ],
  },
  PEER_Y: {
    symbol: "PEER_Y",
    name: "Energy Peer Y Tbk.",
    sector: "Energy",
    sourceMode: DataSourceMode.MOCK,
    retrievedAt: "2026-10-05T00:00:00Z",
    historicalFinancials: [
      { year: 2023, revenue: 8000000000000 },
      { year: 2024, revenue: 8800000000000 },
    ],
  },
  PEER_Z: {
    symbol: "PEER_Z",
    name: "Energy Peer Z Tbk.",
    sector: "Energy",
    sourceMode: DataSourceMode.MOCK,
    retrievedAt: "2026-10-05T00:00:00Z",
    historicalFinancials: [
      { year: 2023, revenue: 9000000000000 },
      { year: 2024, revenue: 9900000000000 },
    ],
  },
};
