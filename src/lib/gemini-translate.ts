/**
 * Gemini Flash Translation Service
 * Client-side service to translate missing i18n keys using Gemini Flash API
 */

export interface TranslationRequest {
  keys: Record<string, string> // key -> source text
  targetLanguages: string[]
  sourceLanguage?: string
}

export interface TranslationResult {
  // key -> lang -> translated text
  translations: Record<string, Record<string, string>>
  errors: string[]
}

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent"

/**
 * Build prompt for Gemini translation
 */
function buildTranslationPrompt(
  keys: Record<string, string>,
  targetLanguages: string[],
  sourceLanguage?: string
): string {
  const langList = targetLanguages.join(", ")
  const sourceNote = sourceLanguage ? ` from ${sourceLanguage}` : ""
  
  return `You are a professional i18n translator. Translate the following keys${sourceNote} to these languages: ${langList}.

RULES:
- Return ONLY valid JSON, no markdown, no explanation
- Keep the exact same key names
- Translate the values accurately and naturally
- If a value contains placeholders like {name}, {count}, keep them unchanged
- If a value contains HTML tags, keep them unchanged
- Keep translations concise and appropriate for UI context

Input keys and their values:
${JSON.stringify(keys, null, 2)}

Return JSON in this exact format:
{
  "key1": { "${targetLanguages[0]}": "translated text", ${targetLanguages.slice(1).map(l => `"${l}": "translated text"`).join(", ")} },
  "key2": { "${targetLanguages[0]}": "translated text", ${targetLanguages.slice(1).map(l => `"${l}": "translated text"`).join(", ")} }
}`
}

/**
 * Call Gemini Flash API for translation
 */
export async function translateWithGemini(
  apiKey: string,
  request: TranslationRequest
): Promise<TranslationResult> {
  const errors: string[] = []
  
  if (!apiKey || !apiKey.trim()) {
    return { translations: {}, errors: ["API key is required"] }
  }

  if (Object.keys(request.keys).length === 0) {
    return { translations: {}, errors: ["No keys to translate"] }
  }

  if (request.targetLanguages.length === 0) {
    return { translations: {}, errors: ["No target languages specified"] }
  }

  const prompt = buildTranslationPrompt(
    request.keys,
    request.targetLanguages,
    request.sourceLanguage
  )

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.2,
          topP: 0.8,
          maxOutputTokens: 8192,
        },
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      const errorMessage = errorData?.error?.message || `API error: ${response.status}`
      return { translations: {}, errors: [errorMessage] }
    }

    const data = await response.json()
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text

    if (!text) {
      return { translations: {}, errors: ["Empty response from Gemini"] }
    }

    // Parse JSON from response (handle potential markdown wrapping)
    const jsonStr = text
      .replace(/```json\s*/g, "")
      .replace(/```\s*/g, "")
      .trim()

    try {
      const translations = JSON.parse(jsonStr)
      return { translations, errors }
    } catch {
      return { translations: {}, errors: [`Failed to parse Gemini response: ${text.substring(0, 200)}`] }
    }
  } catch (error: any) {
    return {
      translations: {},
      errors: [error?.message || "Network error calling Gemini API"],
    }
  }
}

/**
 * Store/retrieve API key from localStorage
 */
const GEMINI_API_KEY_STORAGE = "gemini-api-key"
const GEMINI_ENABLED_STORAGE = "gemini-auto-translate-enabled"

export function getStoredApiKey(): string {
  if (typeof window === "undefined") return ""
  return localStorage.getItem(GEMINI_API_KEY_STORAGE) || ""
}

export function setStoredApiKey(key: string): void {
  if (typeof window === "undefined") return
  localStorage.setItem(GEMINI_API_KEY_STORAGE, key)
}

export function removeStoredApiKey(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(GEMINI_API_KEY_STORAGE)
}

export function isAutoTranslateEnabled(): boolean {
  if (typeof window === "undefined") return false
  return localStorage.getItem(GEMINI_ENABLED_STORAGE) === "true"
}

export function setAutoTranslateEnabled(enabled: boolean): void {
  if (typeof window === "undefined") return
  localStorage.setItem(GEMINI_ENABLED_STORAGE, enabled ? "true" : "false")
}
