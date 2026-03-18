import mongoose, { Schema, model, models } from "mongoose"

export interface IUserSettings {
  userEmail: string
  theme: "light" | "dark" | "system"
  defaultLanguages: string[]
  recentSpreadsheets: string[] // List of IDs
}

const UserSettingsSchema = new Schema<IUserSettings>({
  userEmail: { type: String, required: true, unique: true, index: true },
  theme: { type: String, enum: ["light", "dark", "system"], default: "system" },
  defaultLanguages: [{ type: String }],
  recentSpreadsheets: [{ type: String }],
}, {
  timestamps: true,
})

const UserSettings = models.UserSettings || model<IUserSettings>("UserSettings", UserSettingsSchema)

export default UserSettings
