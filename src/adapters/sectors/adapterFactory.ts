import { SectorsAdapter } from "./sectorsAdapter";
import { SectorsMockAdapter } from "./mockAdapter";
import { SectorsRestAdapter } from "./restAdapter";

export interface AdapterOptions {
  mode?: "mock" | "live";
  apiKey?: string;
}

/**
 * Creates the appropriate Sectors Adapter based on requested mode or environment variables.
 */
export function createSectorsAdapter(options: AdapterOptions = {}): SectorsAdapter {
  const envMode = process.env.SECTORS_MODE?.toLowerCase();
  const selectedMode = options.mode || (envMode === "live" ? "live" : "mock");

  if (selectedMode === "live") {
    return new SectorsRestAdapter({ apiKey: options.apiKey });
  }

  return new SectorsMockAdapter();
}
