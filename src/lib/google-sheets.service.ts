import { GoogleSpreadsheet, GoogleSpreadsheetRow } from "google-spreadsheet"
import { JWT } from "google-auth-library"
import { SpreadsheetResponse } from "@/models"

export interface SheetRow {
  rowNumber: number
  key: string
  data: Record<string, string>
}

export interface SheetData {
  sheetId: number
  title: string
  rows: SheetRow[]
}

// Simple in-memory cache with TTL
interface CacheEntry {
  data: any
  timestamp: number
  ttl: number
}

class SimpleCache {
  private cache = new Map<string, CacheEntry>()

  set(key: string, data: any, ttlMs: number = 10 * 60 * 1000) {
    // 10 phút default - tăng cache time để giảm API calls
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlMs,
    })
  }

  get(key: string): any | null {
    const entry = this.cache.get(key)
    if (!entry) return null

    // Check if expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key)
      return null
    }

    return entry.data
  }

  clear() {
    this.cache.clear()
  }

  // Clean expired entries
  cleanup() {
    const now = Date.now()
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key)
      }
    }
  }
}

// Rate limiting để tránh Google API quota exceeded
class RateLimiter {
  private requestTimes: number[] = []
  private readonly maxRequests = 40 
  private readonly windowMs = 60 * 1000 // 1 phút
  private lastRequestTime = 0 // Thời điểm yêu cầu cuối cùng được thông qua
  private readonly minInterval = 250 // Khoảng cách tối thiểu giữa 2 yêu cầu (4 req/s max)
  private totalRequestsCount = 0 
  private isProcessing = false // Để lock đồng bộ các check song song

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  async checkLimit(): Promise<void> {
    // Nếu có một check đang ngủ/xử lý, check khác phải đợi sau (FIFO)
    while (this.isProcessing) {
      await this.sleep(100)
    }

    try {
      this.isProcessing = true
      const now = Date.now()

      // 1. Kiểm tra burst interval (dãn cách các request song song)
      const timeSinceLast = now - this.lastRequestTime
      if (timeSinceLast < this.minInterval) {
        const waitInterval = this.minInterval - timeSinceLast
        await this.sleep(waitInterval)
        return this.checkLimit()
      }

      // 2. Kiểm tra quota 1 phút
      this.requestTimes = this.requestTimes.filter(
        (time) => now - time < this.windowMs
      )

      if (this.requestTimes.length >= this.maxRequests) {
        const oldestRequest = Math.min(...this.requestTimes)
        const waitTime = this.windowMs - (now - oldestRequest)

        console.log(
          `⏱️ Quota limit reached (${this.maxRequests}). Waiting ${Math.round(waitTime / 1000)}s...`
        )
        await this.sleep(waitTime)
        return this.checkLimit()
      }

      // Record request
      const approvalTime = Date.now()
      this.requestTimes.push(approvalTime)
      this.lastRequestTime = approvalTime
      this.totalRequestsCount++

      // Log periodically
      if (this.totalRequestsCount % 10 === 0) {
        console.log(`📈 API Usage: ${this.totalRequestsCount} total calls, ${this.requestTimes.length}/${this.maxRequests} in last minute`)
      }
    } finally {
      this.isProcessing = false
    }
  }
}

// Progress tracking interface
export interface LoadingProgress {
  spreadsheetId: string
  totalSheets: number
  loadedSheets: number
  currentSheet?: string
  percentage: number
  status: "loading" | "completed" | "error"
  message?: string
}

export class GoogleSheetsService {
  protected readonly auth: JWT
  private readonly cache = new SimpleCache()
  protected readonly rateLimiter = new RateLimiter()
  // Request deduplication để tránh multiple concurrent requests cho cùng data
  private readonly pendingRequests = new Map<string, Promise<any>>()
  // Progress tracking cho loading process
  private readonly progressMap = new Map<string, LoadingProgress>()

  constructor() {
    this.auth = new JWT({
      email: process.env.GOOGLE_CLIENT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    })

    // Cleanup expired cache entries mỗi 10 phút
    setInterval(() => {
      this.cache.cleanup()
    }, 10 * 60 * 1000)
  }

  // Helper method để invalidate cache cho spreadsheet
  private invalidateSpreadsheetCache(spreadsheetId: string) {
    this.cache.clear() // For simplicity, clear all cache. Could be more granular
    console.log(`🗑️ Cache invalidated for spreadsheet: ${spreadsheetId}`)
  }

  protected async getDocument(
    spreadsheetId: string
  ): Promise<GoogleSpreadsheet> {
    return this.withRetry(async () => {
      // Apply rate limiting before API call
      await this.rateLimiter.checkLimit()

      const doc = new GoogleSpreadsheet(spreadsheetId, this.auth)
      await doc.loadInfo()
      return doc
    })
  }

  // Retry mechanism với exponential backoff cho Google API errors
  protected async withRetry<T>(
    apiCall: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 2000 // Tăng base delay từ 1s lên 2s
  ): Promise<T> {
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await apiCall()
      } catch (error: any) {
        const isQuotaError =
          error.response?.status === 429 ||
          error.message?.includes("quota") ||
          error.message?.includes("rate limit") ||
          error.message?.includes("Quota exceeded")

        if (isQuotaError && attempt < maxRetries) {
          // Quota errors cần delay lâu hơn - tối thiểu 30s
          const exponentialDelay = baseDelay * Math.pow(2, attempt)
          const quotaDelay = Math.max(exponentialDelay, 30000) // Tối thiểu 30s cho quota errors

          console.log(
            `🔄 Google API quota error. Retrying in ${quotaDelay / 1000
            }s... (Attempt ${attempt + 1}/${maxRetries + 1})`
          )
          await this.sleep(quotaDelay)
          continue
        }

        // Re-throw if not quota error or max retries reached
        throw error
      }
    }

    throw new Error("Max retries reached")
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  private parseSheetRows(
    sheet: any,
    rows: GoogleSpreadsheetRow<Record<string, any>>[]
  ): SheetRow[] {
    return rows.map((row) => {
      const obj: Record<string, string> = {}
      let key = ""
      const rowNumber = row.rowNumber

      sheet.headerValues.forEach((header: string) => {
        const normalized = header.toLowerCase()
        if (normalized === "key") {
          key = row.get(header)
        } else {
          obj[header] = row.get(header) ?? ""
        }
      })

      return { rowNumber, key, data: obj }
    })
  }

  async getSpreadsheet(spreadsheetId: string): Promise<SpreadsheetResponse> {
    // Check cache first
    const cacheKey = `spreadsheet:${spreadsheetId}`
    const cached = this.cache.get(cacheKey)
    if (cached) {
      return cached
    }

    // Check if request is already in progress (deduplication)
    if (this.pendingRequests.has(cacheKey)) {
      console.log(`🔄 Deduplicating request for ${spreadsheetId}`)
      return this.pendingRequests.get(cacheKey)!
    }

    // Start new request and store promise
    const requestPromise = this._fetchSpreadsheetData(spreadsheetId, cacheKey)
    this.pendingRequests.set(cacheKey, requestPromise)

    try {
      const result = await requestPromise
      return result
    } finally {
      // Clean up pending request
      this.pendingRequests.delete(cacheKey)
    }
  }

  private async _fetchSpreadsheetData(
    spreadsheetId: string,
    cacheKey: string
  ): Promise<SpreadsheetResponse> {
    const doc = await this.getDocument(spreadsheetId)

    const tabCount = doc.sheetsByIndex.length
    console.log(`📊 Processing spreadsheet with ${tabCount} tabs`)

    // Initialize progress tracking
    this.initializeProgress(spreadsheetId, tabCount)

    let sheets: any[]

    // OPTIMIZATION: Chọn strategy dựa vào size và user preference
    const aggressiveMode = process.env.AGGRESSIVE_LOADING === "true" // Env var to control

    if (tabCount > 25 && !aggressiveMode) {
      console.log(
        `⚡ Very large spreadsheet (${tabCount} tabs). Using batch processing...`
      )
      sheets = await this.processLargeSpreadsheetSequentially(
        doc.sheetsByIndex,
        spreadsheetId
      )
    } else if (tabCount > 10) {
      console.log(
        `🚀 Medium-large spreadsheet (${tabCount} tabs). Using aggressive parallel with strong retry...`
      )
      sheets = await this.processSpreadsheetAggressiveParallel(
        doc.sheetsByIndex,
        spreadsheetId
      )
    } else {
      console.log(
        `⚡ Small spreadsheet (${tabCount} tabs). Using normal parallel processing...`
      )
      sheets = await this.processSmallSpreadsheetParallel(
        doc.sheetsByIndex,
        spreadsheetId
      )
    }

    // Update progress to completed
    this.updateProgress(spreadsheetId, {
      loadedSheets: tabCount,
      status: "completed",
      percentage: 100,
      message: `Successfully loaded all ${tabCount} sheets`,
    })

    const result = {
      title: doc.title,
      id: spreadsheetId,
      sheets,
    }

    // Cache for 10 minutes - tăng thời gian cache để giảm API calls
    this.cache.set(cacheKey, result, 10 * 60 * 1000)

    // Clean up progress after successful completion
    setTimeout(() => this.progressMap.delete(spreadsheetId), 5000) // Keep for 5s for final display

    return result
  }

  // Initialize progress tracking
  private initializeProgress(spreadsheetId: string, totalSheets: number): void {
    this.progressMap.set(spreadsheetId, {
      spreadsheetId,
      totalSheets,
      loadedSheets: 0,
      percentage: 0,
      status: "loading",
      message: `Starting to load ${totalSheets} sheets...`,
    })
  }

  // Update progress
  private updateProgress(
    spreadsheetId: string,
    updates: Partial<LoadingProgress>
  ): void {
    const current = this.progressMap.get(spreadsheetId)
    if (current) {
      const updated = { ...current, ...updates }
      if (updates.loadedSheets !== undefined) {
        updated.percentage = Math.round(
          (updates.loadedSheets / updated.totalSheets) * 100
        )
      }
      this.progressMap.set(spreadsheetId, updated)
    }
  }

  // Get current progress
  getProgress(spreadsheetId: string): LoadingProgress | null {
    return this.progressMap.get(spreadsheetId) || null
  }

  // 🚀 LAZY LOADING cho spreadsheets lớn
  async getSpreadsheetLazy(
    spreadsheetId: string,
    options: {
      mode: "lazy" | "first-only"
      specificSheet?: string
    }
  ): Promise<SpreadsheetResponse> {
    const cacheKey = `lazy:${spreadsheetId}:${options.mode}:${options.specificSheet || "all"
      }`
    const cached = this.cache.get(cacheKey)
    if (cached) {
      return cached
    }

    const doc = await this.getDocument(spreadsheetId)
    const tabCount = doc.sheetsByIndex.length

    console.log(`🚀 Lazy loading mode: ${options.mode} for ${tabCount} tabs`)

    let sheets: any[]

    if (options.mode === "first-only") {
      // Chỉ load sheet đầu tiên
      console.log(`📄 Loading only first sheet: ${doc.sheetsByIndex[0]?.title}`)
      const firstSheet = doc.sheetsByIndex[0]
      if (firstSheet) {
        const processedSheet = await this.processSingleSheet(firstSheet)
        sheets = [processedSheet]
      } else {
        sheets = []
      }
    } else if (options.specificSheet) {
      // Load sheet cụ thể theo tên
      console.log(`📄 Loading specific sheet: ${options.specificSheet}`)
      const targetSheet = doc.sheetsByTitle[options.specificSheet]
      if (targetSheet) {
        const processedSheet = await this.processSingleSheet(targetSheet)
        sheets = [processedSheet]
      } else {
        throw new Error(`Sheet "${options.specificSheet}" not found`)
      }
    } else {
      // Lazy mode: Load metadata của tất cả sheets, chỉ load data của sheet đầu tiên
      console.log(
        `📋 Lazy mode: Loading metadata for all sheets, data for first sheet only`
      )
      sheets = await this.loadSheetsMetadataWithFirstSheetData(
        doc.sheetsByIndex
      )
    }

    const result = {
      title: doc.title,
      id: spreadsheetId,
      sheets,
      _lazyMode: options.mode,
      _totalSheets: tabCount,
      _loadedSheets: sheets.length,
    }

    // Cache lazy results for shorter time
    this.cache.set(cacheKey, result, 5 * 60 * 1000) // 5 minutes

    return result
  }

  // Load metadata cho tất cả sheets, chỉ load data cho sheet đầu tiên
  private async loadSheetsMetadataWithFirstSheetData(
    sheetsByIndex: any[]
  ): Promise<any[]> {
    const sheets: any[] = []

    for (let i = 0; i < sheetsByIndex.length; i++) {
      const sheet = sheetsByIndex[i]

      if (i === 0) {
        // Sheet đầu tiên: load full data
        console.log(`📊 Loading full data for first sheet: ${sheet.title}`)
        const fullSheet = await this.processSingleSheet(sheet)
        sheets.push(fullSheet)
      } else {
        // Các sheet khác: chỉ load metadata
        console.log(`📋 Loading metadata only for sheet: ${sheet.title}`)
        try {
          // Metadata only - load headers (Rate limited)
          await this.rateLimiter.checkLimit()
          await sheet.loadHeaderRow()
          sheets.push({
            sheetId: sheet.sheetId,
            title: sheet.title,
            rows: [], // Empty - sẽ load on-demand
            _isLazyLoaded: true,
            _headerValues: sheet.headerValues || [],
          })
        } catch (error) {
          // If can't load headers, still include basic info
          sheets.push({
            sheetId: sheet.sheetId,
            title: sheet.title,
            rows: [],
            _isLazyLoaded: true,
            _headerValues: [],
            _error: "Could not load headers",
          })
        }
      }
    }

    return sheets
  }

  // Xử lý sequential cho spreadsheets lớn để tránh quota limits
  private async processLargeSpreadsheetSequentially(
    sheetsByIndex: any[],
    spreadsheetId?: string
  ): Promise<any[]> {
    const sheets: any[] = []
    const batchSize = 5 // Process 5 tabs at a time để không hit rate limit

    for (let i = 0; i < sheetsByIndex.length; i += batchSize) {
      const batch = sheetsByIndex.slice(i, i + batchSize)
      const batchNumber = Math.floor(i / batchSize) + 1
      const totalBatches = Math.ceil(sheetsByIndex.length / batchSize)

      console.log(
        `📝 Processing batch ${batchNumber}/${totalBatches} (tabs ${i + 1
        }-${Math.min(i + batchSize, sheetsByIndex.length)})`
      )

      if (spreadsheetId) {
        this.updateProgress(spreadsheetId, {
          message: `Processing batch ${batchNumber}/${totalBatches}...`,
        })
      }

      // Process batch in parallel (5 tabs at once max)
      const batchResults = await Promise.all(
        batch.map(async (sheet, batchIndex) => {
          const globalIndex = i + batchIndex
          const result = await this.processSingleSheet(sheet)

          // Update progress after each sheet in batch
          if (spreadsheetId) {
            this.updateProgress(spreadsheetId, {
              loadedSheets: globalIndex + 1,
              currentSheet: sheet.title,
              message: `Completed sheet: ${sheet.title} (batch ${batchNumber}/${totalBatches})`,
            })
          }

          return result
        })
      )

      sheets.push(...batchResults)

      // Brief pause between batches để respect rate limits
      if (i + batchSize < sheetsByIndex.length) {
        console.log(`⏳ Brief pause between batches...`)

        if (spreadsheetId) {
          this.updateProgress(spreadsheetId, {
            message: `Pausing between batches... (${sheets.length}/${sheetsByIndex.length} completed)`,
          })
        }

        await this.sleep(1000) // 1 second pause
      }
    }

    return sheets
  }

  // Xử lý parallel cho spreadsheets nhỏ (giữ nguyên logic cũ)
  private async processSmallSpreadsheetParallel(
    sheetsByIndex: any[],
    spreadsheetId?: string
  ): Promise<any[]> {
    let completedSheets = 0

    return Promise.all(
      sheetsByIndex.map(async (sheet, index) => {
        if (spreadsheetId) {
          this.updateProgress(spreadsheetId, {
            currentSheet: sheet.title,
            message: `Loading sheet: ${sheet.title}`,
          })
        }

        const result = await this.processSingleSheet(sheet)

        // Update progress after each sheet completes
        completedSheets++
        if (spreadsheetId) {
          this.updateProgress(spreadsheetId, {
            loadedSheets: completedSheets,
            currentSheet: sheet.title,
            message: `Completed sheet: ${sheet.title}`,
          })
        }

        return result
      })
    )
  }

  // 🚀 AGGRESSIVE: Parallel processing với retry mạnh cho medium spreadsheets
  private async processSpreadsheetAggressiveParallel(
    sheetsByIndex: any[],
    spreadsheetId?: string
  ): Promise<any[]> {
    console.log(
      `🚀 Aggressive mode: Processing all ${sheetsByIndex.length} tabs in parallel...`
    )
    console.log(
      `⚠️  May hit quota limits, but will retry with intelligent backoff`
    )

    try {
      // Track completed sheets for progress
      let completedSheets = 0

      // Try full parallel first
      const results = await Promise.all(
        sheetsByIndex.map(async (sheet, index) => {
          console.log(
            `📄 Processing sheet ${index + 1}/${sheetsByIndex.length}: ${sheet.title
            }`
          )

          if (spreadsheetId) {
            this.updateProgress(spreadsheetId, {
              currentSheet: sheet.title,
              message: `Loading sheet: ${sheet.title}`,
            })
          }

          const result = await this.processSingleSheetWithAggressiveRetry(
            sheet,
            index
          )

          // Update progress after each sheet completes
          completedSheets++
          if (spreadsheetId) {
            this.updateProgress(spreadsheetId, {
              loadedSheets: completedSheets,
              currentSheet: sheet.title,
              message: `Completed sheet: ${sheet.title}`,
            })
          }

          return result
        })
      )

      console.log(
        `✅ Success! All ${sheetsByIndex.length} tabs loaded in parallel`
      )
      return results
    } catch (error: any) {
      console.log(
        `⚠️  Parallel processing failed, falling back to batch mode...`
      )

      if (spreadsheetId) {
        this.updateProgress(spreadsheetId, {
          message:
            "Aggressive mode failed, falling back to batch processing...",
        })
      }

      // Fallback to batch processing if aggressive fails
      return this.processLargeSpreadsheetSequentially(
        sheetsByIndex,
        spreadsheetId
      )
    }
  }

  // Process single sheet với aggressive retry cho parallel mode
  private async processSingleSheetWithAggressiveRetry(
    sheet: any,
    index: number
  ): Promise<any> {
    return this.withRetry(
      async () => {
        // Add random delay để tránh tất cả requests hit cùng lúc
        const randomDelay = Math.random() * 1000 * (index % 3) // 0-3s random delay
        if (randomDelay > 0) {
          await this.sleep(randomDelay)
        }

        return this.processSingleSheet(sheet)
      },
      5, // 5 retries instead of 3
      3000 // 3s base delay instead of 2s
    )
  }

  // Xử lý 1 sheet đơn lẻ
  private async processSingleSheet(sheet: any): Promise<any> {
    // Validate sheet format first
    await this.validateSheetFormat(sheet)

    const rows = await this.withRetry(async () => {
      await this.rateLimiter.checkLimit()
      return sheet.getRows()
    }).catch(() => [] as GoogleSpreadsheetRow<Record<string, any>>[])

    if (rows.length === 0) {
      return {
        sheetId: sheet.sheetId,
        title: sheet.title,
        rows: [],
      }
    }

    const parsed = this.parseSheetRows(sheet, rows)

    // Validate parsed data
    this.validateParsedData(parsed, sheet.title)

    return {
      sheetId: sheet.sheetId,
      title: sheet.title,
      rows: parsed,
    }
  }

  async getSpreadsheetValidation(spreadsheetId: string): Promise<{
    isValid: boolean
    spreadsheet?: SpreadsheetResponse
    validationIssues: Array<{
      sheetTitle: string
      errors: string[]
      fixes: Array<{
        type:
        | "missing_key"
        | "duplicate_keys"
        | "empty_keys"
        | "no_languages"
        | "no_headers"
        title: string
        description: string
        action: string
      }>
    }>
  }> {
    // Check cache first
    const cacheKey = `validation:${spreadsheetId}`
    const cached = this.cache.get(cacheKey)
    if (cached) {
      return cached
    }

    // Check if validation request is already in progress (deduplication)
    if (this.pendingRequests.has(cacheKey)) {
      console.log(`🔄 Deduplicating validation request for ${spreadsheetId}`)
      return this.pendingRequests.get(cacheKey)!
    }

    // Start new validation and store promise
    const validationPromise = this._performValidation(spreadsheetId, cacheKey)
    this.pendingRequests.set(cacheKey, validationPromise)

    try {
      const result = await validationPromise
      return result
    } finally {
      // Clean up pending request
      this.pendingRequests.delete(cacheKey)
    }
  }

  private async _performValidation(
    spreadsheetId: string,
    cacheKey: string
  ): Promise<{
    isValid: boolean
    spreadsheet?: SpreadsheetResponse
    validationIssues: Array<{
      sheetTitle: string
      errors: string[]
      fixes: Array<{
        type:
        | "missing_key"
        | "duplicate_keys"
        | "empty_keys"
        | "no_languages"
        | "no_headers"
        title: string
        description: string
        action: string
      }>
    }>
  }> {
    const doc = await this.getDocument(spreadsheetId)
    const validationIssues: Array<{
      sheetTitle: string
      errors: string[]
      fixes: Array<{
        type:
        | "missing_key"
        | "duplicate_keys"
        | "empty_keys"
        | "no_languages"
        | "no_headers"
        title: string
        description: string
        action: string
      }>
    }> = []

    let isAllValid = true
    const sheetsData: Array<{
      sheetId: number
      title: string
      rows: any[]
    }> = []

    // Check each sheet for validation issues và collect data một lần
    for (const sheet of doc.sheetsByIndex) {
      try {
        // Try to load header row safely
        await sheet.loadHeaderRow()
      } catch (error: any) {
        // Handle case where sheet has no headers or empty first row
        if (error.message?.includes("No values in the header row")) {
          isAllValid = false
          validationIssues.push({
            sheetTitle: sheet.title,
            errors: [
              `Sheet "${sheet.title}" không có headers hoặc row đầu tiên trống.`,
            ],
            fixes: [
              {
                type: "no_headers",
                title: "📝 Tạo Headers",
                description:
                  "Tự động tạo headers thông minh: KEY + ngôn ngữ từ sheet khác hoặc VI-VN",
                action: "Tạo Headers",
              },
            ],
          })
          sheetsData.push({
            sheetId: sheet.sheetId,
            title: sheet.title,
            rows: [],
          })
          continue // Skip further validation for this sheet
        } else {
          // Re-throw other unexpected errors
          throw error
        }
      }

      // Validate sheet format
      const formatValidation = this.validateSheetFormatWithFixes(sheet)

      if (!formatValidation.isValid) {
        isAllValid = false
        validationIssues.push({
          sheetTitle: sheet.title,
          errors: formatValidation.errors,
          fixes: formatValidation.fixes,
        })
        sheetsData.push({
          sheetId: sheet.sheetId,
          title: sheet.title,
          rows: [],
        })
        continue // Skip further validation for this sheet
      }

      // Validate data if format is OK - CHỈ ĐỌC 1 LẦN với rate limiting và retry
      const rows = await this.withRetry(async () => {
        await this.rateLimiter.checkLimit()
        return sheet.getRows()
      }).catch(() => [] as GoogleSpreadsheetRow<Record<string, any>>[])

      if (rows.length > 0) {
        const parsed = this.parseSheetRows(sheet, rows)
        const dataValidation = this.validateParsedDataWithFixes(
          parsed,
          sheet.title
        )

        if (!dataValidation.isValid) {
          isAllValid = false
          validationIssues.push({
            sheetTitle: sheet.title,
            errors: dataValidation.errors,
            fixes: dataValidation.fixes,
          })
        }

        // Store processed data để tránh đọc lại
        sheetsData.push({
          sheetId: sheet.sheetId,
          title: sheet.title,
          rows: parsed,
        })
      } else {
        sheetsData.push({
          sheetId: sheet.sheetId,
          title: sheet.title,
          rows: [],
        })
      }
    }

    // Nếu validation thành công, tạo SpreadsheetResponse từ data đã có
    // KHÔNG GỌI getSpreadsheet() nữa để tránh duplicate calls
    let spreadsheet: SpreadsheetResponse | undefined
    if (isAllValid) {
      spreadsheet = {
        title: doc.title,
        id: spreadsheetId,
        sheets: sheetsData,
      }
    }

    const result = {
      isValid: isAllValid,
      spreadsheet,
      validationIssues,
    }

    // Cache validation result for 8 minutes (chỉ hơi ngắn hơn data cache)
    this.cache.set(`validation:${spreadsheetId}`, result, 8 * 60 * 1000)

    return result
  }

  async addRowToSheet(
    spreadsheetId: string,
    sheetId: number,
    rowData: { key: string; data: Record<string, string> }
  ): Promise<SpreadsheetResponse> {
    const doc = await this.getDocument(spreadsheetId)

    const sheet = doc.sheetsById[sheetId]
    if (!sheet) {
      throw new Error("Sheet not found")
    }

    await sheet.loadHeaderRow()
    await sheet.addRows([
      {
        KEY: rowData.key,
        ...rowData.data,
      },
    ])

    // Invalidate cache after modification
    this.invalidateSpreadsheetCache(spreadsheetId)

    // Return updated spreadsheet data
    return this.getSpreadsheet(spreadsheetId)
  }

  async updateRow(
    spreadsheetId: string,
    sheetId: number,
    rowNumber: number,
    data: Record<string, string>
  ): Promise<void> {
    const doc = await this.getDocument(spreadsheetId)

    const sheet = doc.sheetsById[sheetId]
    if (!sheet) {
      throw new Error("Sheet not found")
    }

    await sheet.loadHeaderRow()
    const rows = await sheet.getRows()

    const row = rows.find((r) => r.rowNumber === rowNumber)
    if (!row) {
      throw new Error("Row not found")
    }

    // Update each column in data
    for (const [lang, value] of Object.entries(data)) {
      if (sheet.headerValues.includes(lang)) {
        row.set(lang, String(value))
      } else {
        console.warn(`Column ${lang} not in headers`)
      }
    }

    await row.save()
  }

  async syncSpreadsheet(spreadsheetData: SpreadsheetResponse): Promise<void> {
    // Invalidate cache before sync
    this.invalidateSpreadsheetCache(spreadsheetData.id)
    const doc = await this.getDocument(spreadsheetData.id)

    // Process each sheet
    for (const sheetData of spreadsheetData.sheets) {
      await this.syncSingleSheet(doc, sheetData)
    }
  }

  private async syncSingleSheet(
    doc: GoogleSpreadsheet,
    sheetData: SheetData
  ): Promise<void> {
    const sheet = doc.sheetsByTitle[sheetData.title]
    if (!sheet) return

    const rowMap = await this.buildRowMap(sheet)

    // Update existing rows
    for (const row of sheetData.rows) {
      await this.updateExistingRow(rowMap, row)
    }
  }

  private async buildRowMap(
    sheet: any
  ): Promise<Map<string, GoogleSpreadsheetRow<Record<string, any>>>> {
    const rows = await sheet.getRows()
    const rowMap = new Map<string, GoogleSpreadsheetRow<Record<string, any>>>()

    for (const r of rows) {
      const key = r.get("KEY") ?? r.get("key")
      if (key) {
        rowMap.set(key, r)
      }
    }

    return rowMap
  }

  private async updateExistingRow(
    rowMap: Map<string, GoogleSpreadsheetRow<Record<string, any>>>,
    row: SheetRow
  ): Promise<void> {
    const existing = rowMap.get(row.key)
    if (!existing) return

    // Update each column
    for (const [lang, value] of Object.entries(row.data)) {
      existing.set(lang, value)
    }
    await existing.save()
  }

  async addSheet(
    spreadsheetId: string,
    sheetTitle: string
  ): Promise<SpreadsheetResponse> {
    const doc = await this.getDocument(spreadsheetId)

    // Validate sheet title
    if (!sheetTitle.trim()) {
      throw new Error("Sheet title cannot be empty")
    }

    // Check if sheet with this title already exists
    const existingSheet = doc.sheetsByTitle[sheetTitle.trim()]
    if (existingSheet) {
      throw new Error(`Sheet "${sheetTitle}" already exists`)
    }

    // Get existing languages from other sheets
    const existingLanguages = new Set<string>()
    for (const sheet of doc.sheetsByIndex) {
      await sheet.loadHeaderRow()
      sheet.headerValues.forEach((header) => {
        if (header.toLowerCase() !== "key") {
          existingLanguages.add(header)
        }
      })
    }

    // Prepare headers: KEY + existing languages
    const headers = ["KEY", ...Array.from(existingLanguages)]

    // Create new sheet with all existing languages
    const newSheet = await doc.addSheet({
      title: sheetTitle.trim(),
      headerValues: headers,
    })

    // Apply header formatting to match existing sheets
    if (doc.sheetsByIndex.length > 1) {
      // Get formatting from the first existing sheet
      const existingSheetForFormat = doc.sheetsByIndex[0]
      await existingSheetForFormat.loadCells("A1:Z1")

      if (existingSheetForFormat.getCell(0, 0)) {
        const firstCell = existingSheetForFormat.getCell(0, 0)

        // Apply same formatting to all header cells in new sheet
        await newSheet.loadCells(
          `A1:${String.fromCharCode(64 + headers.length)}1`
        )

        for (let i = 0; i < headers.length; i++) {
          const headerCell = newSheet.getCell(0, i)

          if (firstCell.backgroundColor) {
            headerCell.backgroundColor = firstCell.backgroundColor
          }
          if (firstCell.textFormat) {
            headerCell.textFormat = firstCell.textFormat
          }
        }

        await newSheet.saveUpdatedCells()
      }
    }

    // Return updated spreadsheet data
    return this.getSpreadsheet(spreadsheetId)
  }

  async deleteSheet(
    spreadsheetId: string,
    sheetId: number
  ): Promise<SpreadsheetResponse> {
    const doc = await this.getDocument(spreadsheetId)

    const sheet = doc.sheetsById[sheetId]
    if (!sheet) {
      throw new Error(`Sheet with ID ${sheetId} not found`)
    }

    // Google Sheets requires at least one sheet to remain
    if (doc.sheetsByIndex.length <= 1) {
      throw new Error(
        "Không thể xóa danh mục cuối cùng. Bảng tính phải có ít nhất một danh mục."
      )
    }

    console.log(
      `🗑️ Deleting sheet: ${sheet.title} (${sheetId}) from ${spreadsheetId}`
    )

    // Delete the sheet
    await sheet.delete()

    // Invalidate cache
    this.invalidateSpreadsheetCache(spreadsheetId)

    // Return updated spreadsheet data
    return this.getSpreadsheet(spreadsheetId)
  }

  async addLanguageColumn(
    spreadsheetId: string,
    languageName: string
  ): Promise<SpreadsheetResponse> {
    const doc = await this.getDocument(spreadsheetId)

    // Validate language name
    if (!languageName.trim()) {
      throw new Error("Language name cannot be empty")
    }

    // Check if language already exists in any sheet
    const existingLanguages = new Set<string>()
    for (const sheet of doc.sheetsByIndex) {
      await this.rateLimiter.checkLimit()
      await sheet.loadHeaderRow()
      sheet.headerValues.forEach((header) => {
        if (header.toLowerCase() !== "key") {
          existingLanguages.add(header.toLowerCase())
        }
      })
    }

    if (existingLanguages.has(languageName.toLowerCase())) {
      throw new Error(`Language "${languageName}" already exists`)
    }

    // Add the new language column to all sheets
    for (const sheet of doc.sheetsByIndex) {
      await this.rateLimiter.checkLimit()
      await sheet.loadHeaderRow()

      // Add new header if not exists
      if (!sheet.headerValues.includes(languageName)) {
        // Get the next column index
        const nextColIndex = sheet.headerValues.length

        // Add the new column header (Rate limited)
        await this.rateLimiter.checkLimit()
        await sheet.loadCells(`A1:${String.fromCharCode(65 + nextColIndex)}1`)
        const headerCell = sheet.getCell(0, nextColIndex)
        headerCell.value = languageName

        // Preserve existing header formatting if any
        const firstHeaderCell = sheet.getCell(0, 0)
        if (firstHeaderCell.backgroundColor) {
          headerCell.backgroundColor = firstHeaderCell.backgroundColor
        }
        if (firstHeaderCell.textFormat) {
          headerCell.textFormat = firstHeaderCell.textFormat
        }

        await this.rateLimiter.checkLimit()
        await sheet.saveUpdatedCells()

        // Update header row (Rate limited)
        const newHeaders = [...sheet.headerValues, languageName]
        await this.rateLimiter.checkLimit()
        await sheet.setHeaderRow(newHeaders)
      }
    }

    // Return updated spreadsheet data
    return this.getSpreadsheet(spreadsheetId)
  }

  async deleteLanguageColumn(
    spreadsheetId: string,
    languageName: string
  ): Promise<SpreadsheetResponse> {
    const doc = await this.getDocument(spreadsheetId)

    // Validate language name
    if (!languageName.trim()) {
      throw new Error("Tên ngôn ngữ không được để trống")
    }

    console.log(`🚀 Optimized: Deleting language column: ${languageName} from all sheets in ${spreadsheetId} using BatchUpdate`)

    // Step 1: Parallel load headers for all sheets using Promise.all and rate limiting
    await Promise.all(
      doc.sheetsByIndex.map(async (sheet) => {
        try {
          await this.rateLimiter.checkLimit()
          await sheet.loadHeaderRow()
        } catch (err: any) {
          console.warn(`⚠️ Could not load headers for sheet "${sheet.title}":`, err.message)
        }
      })
    )

    // Step 2: Build batch requests
    const requests: any[] = []
    const normalizedTarget = languageName.toLowerCase()

    for (const sheet of doc.sheetsByIndex) {
      if (!sheet.headerValues) continue

      const colIndex = sheet.headerValues.findIndex(
        (h: string) => h.toLowerCase() === normalizedTarget
      )

      if (colIndex !== -1) {
        requests.push({
          deleteDimension: {
            range: {
              sheetId: sheet.sheetId,
              dimension: "COLUMNS",
              startIndex: colIndex,
              endIndex: colIndex + 1,
            },
          },
        })
      }
    }

    if (requests.length === 0) {
      console.log(`ℹ️ No sheets found containing language: ${languageName}`)
    } else {
      console.log(`📍 Sending batchUpdate with ${requests.length} delete requests...`)
      
      // google-spreadsheet@5.x uses ky (not axios) via doc.sheetsApi
      // Use the internal _makeBatchUpdateRequest (Rate limited)
      await this.rateLimiter.checkLimit()
      // @ts-ignore - internal method but stable across v5.x
      await doc._makeBatchUpdateRequest(requests)
    }

    // Invalidate local cache 
    this.invalidateSpreadsheetCache(spreadsheetId)

    // Return the updated spreadsheet data
    return this.getSpreadsheet(spreadsheetId)
  }


  private async validateSheetFormat(sheet: any): Promise<void> {
    await this.rateLimiter.checkLimit()
    await sheet.loadHeaderRow()

    const headers = sheet.headerValues ?? []

    // Check if sheet has headers
    if (headers.length === 0) {
      throw new Error(
        `Sheet "${sheet.title}" không có headers. Vui lòng thêm row đầu tiên làm headers.`
      )
    }

    // Check for KEY column
    const hasKeyColumn = headers.some(
      (header: string) => header && header.toLowerCase() === "key"
    )

    if (!hasKeyColumn) {
      throw new Error(
        `Sheet "${sheet.title}" thiếu column KEY.\n\n` +
        `Format mong đợi:\n` +
        `| KEY | Language1 | Language2 |\n` +
        `| key1 | value1 | value2 |\n\n` +
        `Headers hiện tại: ${headers.join(", ")}`
      )
    }

    // Check for at least one language column
    const languageColumns = headers.filter(
      (header: string) => header && header.toLowerCase() !== "key"
    )

    if (languageColumns.length === 0) {
      throw new Error(
        `Sheet "${sheet.title}" chỉ có column KEY mà không có ngôn ngữ nào.\n` +
        `Vui lòng thêm ít nhất 1 column ngôn ngữ.`
      )
    }

    // Check for duplicate headers
    const headerCounts = new Map<string, number>()
    headers.forEach((header: string) => {
      if (header) {
        const count = headerCounts.get(header.toLowerCase()) ?? 0
        headerCounts.set(header.toLowerCase(), count + 1)
      }
    })

    const duplicates = Array.from(headerCounts.entries())
      .filter(([_, count]) => count > 1)
      .map(([header]) => header)

    if (duplicates.length > 0) {
      throw new Error(
        `Sheet "${sheet.title}" có headers trùng lặp: ${duplicates.join(
          ", "
        )}\n` + `Mỗi column phải có tên riêng biệt.`
      )
    }
  }

  private validateParsedData(rows: SheetRow[], sheetTitle: string): void {
    if (rows.length === 0) return

    // Check for duplicate keys
    const keySet = new Set<string>()
    const duplicateKeys: string[] = []

    rows.forEach((row, index) => {
      // Check for empty keys
      if (!row.key?.trim()) {
        throw new Error(
          `Sheet "${sheetTitle}", Row ${index + 2
          }: KEY không được để trống.\n` + `Mỗi row phải có KEY duy nhất.`
        )
      }

      // Check for duplicate keys
      const normalizedKey = row.key.trim().toLowerCase()
      if (keySet.has(normalizedKey)) {
        duplicateKeys.push(row.key)
      } else {
        keySet.add(normalizedKey)
      }
    })

    if (duplicateKeys.length > 0) {
      throw new Error(
        `Sheet "${sheetTitle}" có KEY trùng lặp: ${duplicateKeys.join(
          ", "
        )}\n` + `Mỗi KEY phải là duy nhất trong sheet.`
      )
    }

    // Warning for rows with all empty translations
    const emptyRows = rows.filter((row) =>
      Object.values(row.data).every((value) => !value?.trim())
    )

    if (emptyRows.length > 0) {
      console.warn(
        `Sheet "${sheetTitle}": ${emptyRows.length} rows có tất cả translations trống: ` +
        emptyRows.map((r) => r.key).join(", ")
      )
    }
  }

  // Auto-fix methods
  async autoFixNoHeaders(
    spreadsheetId: string,
    sheetTitle: string
  ): Promise<void> {
    const doc = await this.getDocument(spreadsheetId)
    const sheet = doc.sheetsByTitle[sheetTitle]
    if (!sheet) throw new Error(`Sheet "${sheetTitle}" not found`)

    // Scan other sheets to find existing languages
    const existingLanguages = await this.extractLanguagesFromOtherSheets(
      doc,
      sheetTitle
    )

    // Create smart headers: KEY + languages from other sheets or VI-VN
    const languagesToAdd =
      existingLanguages.length > 0 ? existingLanguages : ["VI-VN"] // Default to Vietnamese instead of English

    const headers = ["KEY", ...languagesToAdd]

    // Set the headers in row 1
    await sheet.setHeaderRow(headers)

    // Apply formatting to the header row
    const headerRange = `A1:${String.fromCharCode(64 + headers.length)}1`
    await sheet.loadCells(headerRange)

    for (let i = 0; i < headers.length; i++) {
      const cell = sheet.getCell(0, i)
      cell.textFormat = { bold: true }
      cell.backgroundColor = { red: 0.8, green: 0.9, blue: 1 } // Light blue
    }
    await sheet.saveUpdatedCells()
  }

  async autoFixMissingKeyColumn(
    spreadsheetId: string,
    sheetTitle: string
  ): Promise<void> {
    const doc = await this.getDocument(spreadsheetId)
    const sheet = doc.sheetsByTitle[sheetTitle]
    if (!sheet) throw new Error(`Sheet "${sheetTitle}" not found`)

    await sheet.loadHeaderRow()
    const headers = sheet.headerValues ?? []

    // If no KEY column, insert it at the beginning
    if (!headers.some((h) => h && h.toLowerCase() === "key")) {
      // Shift all existing data to the right and add KEY column
      await sheet.insertDimension("COLUMNS", { startIndex: 0, endIndex: 1 })

      // Set the new header
      await sheet.loadCells("A1:A1")
      const keyCell = sheet.getCell(0, 0)
      keyCell.value = "KEY"

      // Apply header formatting if other headers exist
      if (headers.length > 0) {
        await sheet.loadCells("B1:B1")
        const firstExistingHeader = sheet.getCell(0, 1)
        if (firstExistingHeader.backgroundColor) {
          keyCell.backgroundColor = firstExistingHeader.backgroundColor
        }
        if (firstExistingHeader.textFormat) {
          keyCell.textFormat = firstExistingHeader.textFormat
        }
      }

      await sheet.saveUpdatedCells()

      // Generate keys for existing rows
      const rows = await sheet.getRows()
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i]
        if (!row.get("KEY")) {
          row.set("KEY", `item_${i + 1}`)
          await row.save()
        }
      }
    }
  }

  async autoFixDuplicateKeys(
    spreadsheetId: string,
    sheetTitle: string
  ): Promise<void> {
    const doc = await this.getDocument(spreadsheetId)
    const sheet = doc.sheetsByTitle[sheetTitle]
    if (!sheet) throw new Error(`Sheet "${sheetTitle}" not found`)

    const rows = await sheet.getRows()
    const seenKeys = new Set<string>()
    const duplicateCount = new Map<string, number>()

    for (const row of rows) {
      const originalKey = row.get("KEY")?.trim()
      if (!originalKey) continue

      const normalizedKey = originalKey.toLowerCase()

      if (seenKeys.has(normalizedKey)) {
        // This is a duplicate, rename it
        const count = duplicateCount.get(normalizedKey) ?? 1
        duplicateCount.set(normalizedKey, count + 1)

        const newKey = `${originalKey}_${count + 1}`
        row.set("KEY", newKey)
        await row.save()

        seenKeys.add(newKey.toLowerCase())
      } else {
        seenKeys.add(normalizedKey)
        duplicateCount.set(normalizedKey, 0)
      }
    }
  }

  async autoFixEmptyKeys(
    spreadsheetId: string,
    sheetTitle: string
  ): Promise<void> {
    const doc = await this.getDocument(spreadsheetId)
    const sheet = doc.sheetsByTitle[sheetTitle]
    if (!sheet) throw new Error(`Sheet "${sheetTitle}" not found`)

    const rows = await sheet.getRows()
    let emptyKeyIndex = 1

    for (const row of rows) {
      const key = row.get("KEY")?.trim()
      if (!key) {
        row.set("KEY", `auto_key_${emptyKeyIndex}`)
        await row.save()
        emptyKeyIndex++
      }
    }
  }

  async autoFixNoLanguageColumns(
    spreadsheetId: string,
    sheetTitle: string
  ): Promise<void> {
    const doc = await this.getDocument(spreadsheetId)
    const sheet = doc.sheetsByTitle[sheetTitle]
    if (!sheet) throw new Error(`Sheet "${sheetTitle}" not found`)

    await sheet.loadHeaderRow()
    const headers = sheet.headerValues ?? []
    const languageColumns = headers.filter(
      (h) => h && h.toLowerCase() !== "key"
    )

    if (languageColumns.length === 0) {
      // Scan other sheets to find existing languages
      const existingLanguages = await this.extractLanguagesFromOtherSheets(
        doc,
        sheetTitle
      )

      // Determine which languages to add
      const languagesToAdd =
        existingLanguages.length > 0 ? existingLanguages : ["VI-VN"] // Default to Vietnamese instead of English

      // Add the language columns
      const newHeaders = [...headers, ...languagesToAdd]
      await sheet.setHeaderRow(newHeaders)

      // Apply formatting to new headers
      const headerRowIndex = 0
      for (let i = 0; i < languagesToAdd.length; i++) {
        const newColIndex = headers.length + i
        await sheet.loadCells(
          `${String.fromCharCode(65 + newColIndex)}1:${String.fromCharCode(
            65 + newColIndex
          )}1`
        )
        const newHeaderCell = sheet.getCell(headerRowIndex, newColIndex)

        // Copy formatting from KEY column if it exists
        if (headers.length > 0) {
          const keyCell = sheet.getCell(headerRowIndex, 0)
          if (keyCell.backgroundColor) {
            newHeaderCell.backgroundColor = keyCell.backgroundColor
          }
          if (keyCell.textFormat) {
            newHeaderCell.textFormat = keyCell.textFormat
          }
        }
      }

      await sheet.saveUpdatedCells()
    }
  }

  /**
   * Extract languages from other sheets that have proper format
   */
  private async extractLanguagesFromOtherSheets(
    doc: GoogleSpreadsheet,
    excludeSheetTitle: string
  ): Promise<string[]> {
    const allLanguages = new Set<string>()

    for (const otherSheet of doc.sheetsByIndex) {
      // Skip the current sheet
      if (otherSheet.title === excludeSheetTitle) continue

      try {
        // Load headers for this sheet
        await otherSheet.loadHeaderRow()
        const otherHeaders = otherSheet.headerValues ?? []

        // Check if this sheet has proper format (has KEY column)
        const hasKeyColumn = otherHeaders.some(
          (h) => h && h.toLowerCase() === "key"
        )

        if (hasKeyColumn) {
          // Extract language columns (non-KEY headers)
          const languageHeaders = otherHeaders.filter(
            (h) => h && h.toLowerCase() !== "key" && h.trim().length > 0
          )

          // Add unique languages to our set
          languageHeaders.forEach((lang) => allLanguages.add(lang))
        }
      } catch (error) {
        // If we can't read this sheet, skip it
        console.warn(`Could not read sheet "${otherSheet.title}":`, error)
        continue
      }
    }

    // Convert Set to Array and prioritize common languages
    const languageArray = Array.from(allLanguages)

    // Sort languages with Vietnamese and English first
    return languageArray.sort((a, b) => {
      const aLower = a.toLowerCase()
      const bLower = b.toLowerCase()

      // Vietnamese variations first
      if (aLower.includes("vi") || aLower.includes("viet")) return -1
      if (bLower.includes("vi") || bLower.includes("viet")) return 1

      // English variations second
      if (aLower.includes("en") || aLower.includes("english")) return -1
      if (bLower.includes("en") || bLower.includes("english")) return 1

      // Alphabetical for the rest
      return a.localeCompare(b)
    })
  }

  // Enhanced validation that returns fixable issues
  private validateSheetFormatWithFixes(sheet: any): {
    isValid: boolean
    errors: string[]
    fixes: Array<{
      type: "missing_key" | "duplicate_keys" | "empty_keys" | "no_languages"
      title: string
      description: string
      action: string
    }>
  } {
    const errors: string[] = []
    const fixes: Array<{
      type: "missing_key" | "duplicate_keys" | "empty_keys" | "no_languages"
      title: string
      description: string
      action: string
    }> = []

    const headers = sheet.headerValues ?? []

    // Check if sheet has headers
    if (headers.length === 0) {
      errors.push(`Sheet "${sheet.title}" không có headers.`)
      return { isValid: false, errors, fixes }
    }

    // Check for KEY column
    const hasKeyColumn = headers.some(
      (header: string) => header && header.toLowerCase() === "key"
    )

    if (!hasKeyColumn) {
      errors.push(`Sheet "${sheet.title}" thiếu column KEY.`)
      fixes.push({
        type: "missing_key",
        title: "🔧 Thêm Column KEY",
        description: "Tự động thêm column KEY và tạo keys cho các rows hiện có",
        action: "Thêm KEY Column",
      })
    }

    // Check for at least one language column
    const languageColumns = headers.filter(
      (header: string) => header && header.toLowerCase() !== "key"
    )

    if (languageColumns.length === 0) {
      errors.push(
        `Sheet "${sheet.title}" chỉ có column KEY mà không có ngôn ngữ nào.`
      )
      fixes.push({
        type: "no_languages",
        title: "🌍 Thêm Column Ngôn Ngữ",
        description:
          'Tự động scan các sheet khác để tìm ngôn ngữ có sẵn, hoặc thêm "VI-VN" làm mặc định',
        action: "Thêm Ngôn Ngữ",
      })
    }

    return { isValid: errors.length === 0, errors, fixes }
  }

  private validateParsedDataWithFixes(
    rows: SheetRow[],
    sheetTitle: string
  ): {
    isValid: boolean
    errors: string[]
    fixes: Array<{
      type: "duplicate_keys" | "empty_keys"
      title: string
      description: string
      action: string
    }>
  } {
    const errors: string[] = []
    const fixes: Array<{
      type: "duplicate_keys" | "empty_keys"
      title: string
      description: string
      action: string
    }> = []

    if (rows.length === 0) return { isValid: true, errors, fixes }

    // Check for empty keys
    const emptyKeyRows = rows.filter((row) => !row.key?.trim())
    if (emptyKeyRows.length > 0) {
      errors.push(
        `Sheet "${sheetTitle}": ${emptyKeyRows.length} rows có KEY trống.`
      )
      fixes.push({
        type: "empty_keys",
        title: "🏷️ Sửa KEY Trống",
        description: `Tự động tạo keys cho ${emptyKeyRows.length} rows trống`,
        action: "Sửa KEY Trống",
      })
    }

    // Check for duplicate keys
    const keySet = new Set<string>()
    const duplicateKeys: string[] = []

    rows.forEach((row) => {
      if (!row.key?.trim()) return

      const normalizedKey = row.key.trim().toLowerCase()
      if (keySet.has(normalizedKey)) {
        duplicateKeys.push(row.key)
      } else {
        keySet.add(normalizedKey)
      }
    })

    if (duplicateKeys.length > 0) {
      errors.push(
        `Sheet "${sheetTitle}" có KEY trùng lặp: ${duplicateKeys.join(", ")}`
      )
      fixes.push({
        type: "duplicate_keys",
        title: "🔄 Sửa KEY Trùng Lặp",
        description: `Tự động rename ${duplicateKeys.length} keys bị trùng lặp`,
        action: "Sửa Trùng Lặp",
      })
    }

    return { isValid: errors.length === 0, errors, fixes }
  }

  // Helper method để suggest format fixes
  static generateFormatSuggestion(error: string): string {
    if (
      error.includes("không có headers") ||
      error.includes("row đầu tiên trống")
    ) {
      return `
📋 Cách khắc phục:
1. Mở Google Sheets
2. Thêm row đầu tiên với headers: KEY, VI-VN, English, ...
3. Row đầu tiên phải có ít nhất 2 columns: KEY và 1 ngôn ngữ
4. Không để row đầu tiên trống

✅ Ví dụ headers đúng:
| KEY     | VI-VN    | English |
|---------|----------|---------|
      `.trim()
    }

    if (error.includes("thiếu column KEY")) {
      return `
📋 Cách khắc phục:
1. Mở Google Sheets
2. Thêm column đầu tiên với tên "KEY" 
3. Điền các key translations vào column này
4. Các columns khác sẽ là tên ngôn ngữ

✅ Ví dụ format đúng:
| KEY     | VI-VN    | English |
|---------|----------|---------|
| hello   | Xin chào | Hello   |
| goodbye | Tạm biệt | Goodbye |
      `.trim()
    }

    if (error.includes("trùng lặp")) {
      return `
📋 Cách khắc phục:
1. Kiểm tra và xóa các KEY trùng lặp
2. Đảm bảo mỗi KEY là duy nhất
3. Có thể thêm số vào cuối: hello1, hello2
      `.trim()
    }

    return `
📋 Format mong đợi:
| KEY     | VI-VN     | English   |
|---------|-----------|-----------|
| key1    | value1    | value2    |
| key2    | value3    | value4    |

✨ Auto Fix thông minh:
- Tự động scan các sheet khác để tìm ngôn ngữ đã có
- Ưu tiên ngôn ngữ Việt Nam (VI-VN) làm mặc định
- Copy ngôn ngữ từ sheet khác nếu có format đúng

❌ Tránh:
- Sheet không có headers hoặc row đầu tiên trống
- KEY trống hoặc trùng lặp
- Chỉ có column KEY mà không có ngôn ngữ
    `.trim()
  }
}

// Singleton instance
export const googleSheetsService = new GoogleSheetsService()
