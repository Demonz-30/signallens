/**
 * Safe logging utility that redacts sensitive secrets (API keys, bearer tokens).
 */

const SECRET_PATTERNS = [
  /Authorization:\s*([^,\s]+)/gi,
  /SECTORS_API_KEY=([^\s]+)/gi,
  /api[_-]?key["']?\s*[:=]\s*["']?([^"',\s]+)/gi,
  /Bearer\s+([a-zA-Z0-9_\-\.]+)/gi,
];

export function redactSecrets(message: string): string {
  let clean = message;
  for (const pattern of SECRET_PATTERNS) {
    clean = clean.replace(pattern, (match, secret) => {
      if (!secret || secret.length < 4) return "[REDACTED]";
      return match.replace(secret, "[REDACTED]");
    });
  }
  return clean;
}

export const logger = {
  info: (msg: string, meta?: Record<string, unknown>) => {
    const metaStr = meta ? ` ${JSON.stringify(meta)}` : "";
    console.log(`[INFO] ${redactSecrets(msg)}${redactSecrets(metaStr)}`);
  },
  warn: (msg: string, meta?: Record<string, unknown>) => {
    const metaStr = meta ? ` ${JSON.stringify(meta)}` : "";
    console.warn(`[WARN] ${redactSecrets(msg)}${redactSecrets(metaStr)}`);
  },
  error: (msg: string, error?: unknown) => {
    const errStr = error instanceof Error ? ` - ${error.message}` : "";
    console.error(`[ERROR] ${redactSecrets(msg)}${redactSecrets(errStr)}`);
  },
};
