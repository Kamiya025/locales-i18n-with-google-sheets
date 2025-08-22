import { SpreadsheetResponse, SpreadsheetUpdateRowRequest } from "@/models"
import axiosClient from "../axios-client"

const sheetApi = {
  getAll(sheetUrl: string): Promise<SpreadsheetResponse> {
    const url = "/sheet"
    const match = sheetUrl.match(/spreadsheets\/d\/([a-zA-Z0-9-_]+)/)
    if (!match) throw new Error("Không tìm thấy Sheet ID trong link")
    const sheetId = match[1]
    return axiosClient.post(url, { sheetId })
  },
  update(data: SpreadsheetResponse): Promise<any> {
    const url = "/sheet/update"
    return axiosClient.post(url, data)
  },
  saveRow(data: SpreadsheetUpdateRowRequest): Promise<any> {
    const url = "/sheet/save-row/"
    return axiosClient.post(url, data)
  },
}

export default sheetApi
