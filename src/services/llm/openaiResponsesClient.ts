import { logger } from "@/utils/logger";

export interface ResponsesApiRequestOptions {
  schemaName: string;
  jsonSchema: Record<string, unknown>;
  instructions: string;
  inputContent: string;
  timeoutMs?: number;
}

export interface ResponsesApiResponse<T> {
  success: boolean;
  data?: T;
  model: string;
  rawText?: string;
  error?: string;
}

/**
 * Native server-side client for OpenAI Responses API (POST /v1/responses).
 * Strictly avoids logging or exposing OPENAI_API_KEY.
 */
export class OpenAIResponsesClient {
  private apiKey: string | null;
  private model: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY || null;
    this.model = process.env.OPENAI_MODEL || "gpt-4o";
    const rawBaseUrl = process.env.OPENAI_BASE_URL || "https://api.openai.com/v1";
    this.baseUrl = rawBaseUrl.replace(/\/+$/, "");
  }

  public isAvailable(): boolean {
    return Boolean(this.apiKey && this.apiKey.trim().length > 0);
  }

  public getModel(): string {
    return this.model;
  }

  /**
   * Executes a structured query against the Responses API.
   * Returns parsed JSON typed as T, or failure details without sensitive data.
   */
  async generateStructuredResponse<T>(
    options: ResponsesApiRequestOptions
  ): Promise<ResponsesApiResponse<T>> {
    if (!this.apiKey) {
      return {
        success: false,
        model: this.model,
        error: "OPENAI_API_KEY is not configured.",
      };
    }

    const endpoint = `${this.baseUrl}/responses`;
    const timeoutMs = options.timeoutMs ?? 15000;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    const requestBody = {
      model: this.model,
      instructions: options.instructions,
      input: [
        {
          role: "user",
          content: options.inputContent,
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: options.schemaName,
          strict: true,
          schema: options.jsonSchema,
        },
      },
      temperature: 0.1,
    };

    try {
      logger.info(
        `[OpenAI Responses API] Dispatching structured request using model: ${this.model} to endpoint /responses`
      );

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text().catch(() => "");
        // Never log or echo sensitive auth headers
        logger.warn(
          `[OpenAI Responses API] Request failed with HTTP status ${response.status}.`
        );
        return {
          success: false,
          model: this.model,
          error: `OpenAI Responses API returned HTTP ${response.status}: ${errorText.substring(0, 120)}`,
        };
      }

      const resJson: unknown = await response.json();
      const extractedText = this.extractJsonText(resJson);

      if (!extractedText) {
        logger.warn(
          `[OpenAI Responses API] Failed to extract text from response structure.`
        );
        return {
          success: false,
          model: this.model,
          error: "No parseable text found in OpenAI response.",
        };
      }

      const parsed: T = JSON.parse(extractedText);
      return {
        success: true,
        data: parsed,
        model: this.model,
        rawText: extractedText,
      };
    } catch (err: unknown) {
      clearTimeout(timeoutId);
      const isAbort =
        err instanceof Error &&
        (err.name === "AbortError" || err.message.includes("abort"));
      const safeErrorMessage = isAbort
        ? `Request timed out after ${timeoutMs}ms.`
        : err instanceof Error
          ? err.message
          : "Unknown network error";

      logger.warn(
        `[OpenAI Responses API] Call failed safely: ${safeErrorMessage}`
      );
      return {
        success: false,
        model: this.model,
        error: safeErrorMessage,
      };
    }
  }

  /**
   * Robustly extracts JSON text from standard Responses API or compatible payload structures.
   */
  private extractJsonText(data: unknown): string | null {
    if (!data || typeof data !== "object") return null;
    const obj = data as Record<string, unknown>;

    if (typeof obj.output_text === "string" && obj.output_text.trim()) {
      return obj.output_text.trim();
    }

    if (Array.isArray(obj.output)) {
      for (const item of obj.output) {
        if (item && typeof item === "object") {
          const itemObj = item as Record<string, unknown>;
          if (Array.isArray(itemObj.content)) {
            for (const part of itemObj.content) {
              if (part && typeof part === "object") {
                const partObj = part as Record<string, unknown>;
                if (typeof partObj.text === "string" && partObj.text.trim()) {
                  return partObj.text.trim();
                }
              }
            }
          }
          if (typeof itemObj.text === "string" && itemObj.text.trim()) {
            return itemObj.text.trim();
          }
        }
      }
    }

    // Fallback if compatible proxy returns choices array
    if (Array.isArray(obj.choices) && obj.choices[0] && typeof obj.choices[0] === "object") {
      const choiceObj = obj.choices[0] as Record<string, unknown>;
      if (choiceObj.message && typeof choiceObj.message === "object") {
        const msgObj = choiceObj.message as Record<string, unknown>;
        if (typeof msgObj.content === "string" && msgObj.content.trim()) {
          return msgObj.content.trim();
        }
      }
    }

    return null;
  }
}
