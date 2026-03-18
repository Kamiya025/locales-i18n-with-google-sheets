import mongoose, { Schema, model, models } from "mongoose"

export interface IGlossary {
  userEmail: string
  key: string
  translations: Record<string, string> // e.g. { "vi": "Xác nhận", "en": "Confirm" }
}

const GlossarySchema = new Schema<IGlossary>({
  userEmail: { type: String, required: true, index: true },
  key: { type: String, required: true },
  translations: { type: Map, of: String, default: {} },
}, {
  timestamps: true,
})

// Indexing for search
GlossarySchema.index({ userEmail: 1, key: 1 }, { unique: true })

const Glossary = models.Glossary || model<IGlossary>("Glossary", GlossarySchema)

export default Glossary
