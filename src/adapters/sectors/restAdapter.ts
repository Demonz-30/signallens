import {
  CompanyFundamentalData,
  DataSourceMode,
  HistoricalFinancialRecord,
} from "@/domain";
import { SectorsAdapter } from "./sectorsAdapter";
import { logger } from "@/utils/logger";

export interface SectorsRestAdapterOptions {
  apiKey?: string;
  baseUrl?: string;
  timeoutMs?: number;
}

interface RawSectorsReportResponse {
  symbol?: string;
  company_name?: string;
  overview?: {
    industry?: string;
    sub_industry?: string;
    sector?: string;
    sub_sector?: string;
    market_cap?: number;
  };
  financials?: {
    historical_financials?: Array<{
      year?: number;
      revenue?: number | null;
      earnings?: number | null;
      total_assets?: number | null;
      total_equity?: number | null;
    }>;
    yoy_quarter_revenue_growth?: number | null;
    yoy_quarter_earnings_growth?: number | null;
  };
}

/**
 * Production Sectors REST API v2 Adapter.
 * Communicates with https://api.sectors.app/v2/company/report/{symbol}/
 * strictly requesting sections=overview,financials to conserve API credits.
 */
export class SectorsRestAdapter implements SectorsAdapter {
  private apiKey: string;
  private baseUrl: string;
  private timeoutMs: number;

  constructor(options: SectorsRestAdapterOptions = {}) {
    this.apiKey = options.apiKey || process.env.SECTORS_API_KEY || "";
    this.baseUrl = options.baseUrl || "https://api.sectors.app/v2";
    this.timeoutMs = options.timeoutMs || 8000;
  }

  getMode(): DataSourceMode {
    return DataSourceMode.SECTORS_REST;
  }

  async getCompanyFundamentals(symbol: string): Promise<CompanyFundamentalData> {
    if (!this.apiKey) {
      throw new Error(
        "SECTORS_API_KEY environment variable is not configured. Configure it in .env.local or switch to mock mode."
      );
    }

    const cleanSymbol = symbol.toUpperCase().replace(/\.JK$/, "");
    const url = `${this.baseUrl}/company/report/${cleanSymbol}/?sections=overview,financials`;

    logger.info(`Fetching Sectors report for ${cleanSymbol} via REST v2`);

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          // Official v2 REST requires the raw key without Bearer prefix
          Authorization: this.apiKey,
          Accept: "application/json",
        },
        signal: AbortSignal.timeout(this.timeoutMs),
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new Error("Sectors API authentication failed: Invalid or expired API key.");
        }
        if (response.status === 404) {
          throw new Error(`Symbol '${cleanSymbol}' was not found in Sectors universe.`);
        }
        if (response.status === 429) {
          throw new Error("Sectors API rate limit or credit quota exceeded.");
        }
        throw new Error(`Sectors API responded with HTTP status ${response.status}.`);
      }

      const data: RawSectorsReportResponse = await response.json();

      const rawHist = data.financials?.historical_financials || [];
      const historicalFinancials: HistoricalFinancialRecord[] = rawHist
        .filter((h) => typeof h.year === "number")
        .map((h) => ({
          year: h.year!,
          revenue: typeof h.revenue === "number" ? h.revenue : null,
          earnings: typeof h.earnings === "number" ? h.earnings : null,
          totalAssets: typeof h.total_assets === "number" ? h.total_assets : null,
          totalEquity: typeof h.total_equity === "number" ? h.total_equity : null,
        }));

      return {
        symbol: cleanSymbol,
        name: data.company_name || cleanSymbol,
        industry: data.overview?.industry,
        subIndustry: data.overview?.sub_industry,
        sector: data.overview?.sector,
        subSector: data.overview?.sub_sector,
        historicalFinancials,
        yoyQuarterRevenueGrowth: data.financials?.yoy_quarter_revenue_growth,
        yoyQuarterEarningsGrowth: data.financials?.yoy_quarter_earnings_growth,
        sourceMode: DataSourceMode.SECTORS_REST,
        retrievedAt: new Date().toISOString(),
      };
    } catch (err: unknown) {
      logger.error(`Failed to fetch Sectors fundamentals for ${cleanSymbol}`, err);
      throw err;
    }
  }

  async getPeerGroupFundamentals(symbols: string[]): Promise<CompanyFundamentalData[]> {
    // Sequentially retrieve to prevent rapid burst rate limits
    const results: CompanyFundamentalData[] = [];
    for (const sym of symbols) {
      const data = await this.getCompanyFundamentals(sym);
      results.push(data);
    }
    return results;
  }
}
