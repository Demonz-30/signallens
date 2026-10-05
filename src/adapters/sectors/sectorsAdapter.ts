import { CompanyFundamentalData, DataSourceMode } from "@/domain";

/**
 * Universal interface for accessing Sectors data.
 * Decouples the application layer from HTTP and external transport mechanisms.
 */
export interface SectorsAdapter {
  /**
   * Retrieves fundamental company report data including historical annual financials.
   */
  getCompanyFundamentals(symbol: string): Promise<CompanyFundamentalData>;

  /**
   * Retrieves fundamental data for a group of peer companies.
   */
  getPeerGroupFundamentals(symbols: string[]): Promise<CompanyFundamentalData[]>;

  /**
   * Returns current active data source mode (MOCK or SECTORS_REST).
   */
  getMode(): DataSourceMode;
}
