import mongoose, { Schema, model, models } from "mongoose"

export interface IUserProject {
  userEmail: string
  spreadsheetId: string
  title: string
  lastAccessedAt: Date
  shareUrl?: string
}

const UserProjectSchema = new Schema<IUserProject>({
  userEmail: { type: String, required: true, index: true },
  spreadsheetId: { type: String, required: true },
  title: { type: String, required: true },
  lastAccessedAt: { type: Date, default: Date.now },
  shareUrl: { type: String },
}, {
  timestamps: true,
})

// Tránh lỗi "OverwriteModelError: Cannot overwrite `UserProject` model once compiled."
const UserProject = models.UserProject || model<IUserProject>("UserProject", UserProjectSchema)

export default UserProject
