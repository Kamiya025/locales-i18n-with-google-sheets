"use client"

import { useAddLanguage } from "@/hooks/useAddLanguage"
import { useSpreadsheet } from "@/providers/preadsheetProvider"
import { useState } from "react"
import Button from "../button"
import { Dialog } from "../dialog"
import Input from "../input"

interface AddLanguageModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AddLanguageModal({
  isOpen,
  onClose,
}: AddLanguageModalProps) {
  const [languageName, setLanguageName] = useState("")
  const { data, setResponse } = useSpreadsheet()

  const addLanguageMutation = useAddLanguage((updatedData) => {
    setResponse(updatedData)
    setLanguageName("")
    onClose()
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!languageName.trim()) {
      return
    }

    if (!data?.id) {
      console.error("No spreadsheet loaded")
      return
    }

    addLanguageMutation.mutate({
      spreadsheetId: data.id,
      languageName: languageName.trim(),
    })
  }

  const handleClose = () => {
    if (!addLanguageMutation.isPending) {
      setLanguageName("")
      onClose()
    }
  }

  const footer = (
    <div className="flex justify-end gap-3">
      <Button
        type="button"
        variant="outline"
        onClick={handleClose}
        disabled={addLanguageMutation.isPending}
      >
        Hủy
      </Button>
      <Button
        type="submit"
        variant="gradient"
        disabled={!languageName.trim() || addLanguageMutation.isPending}
        loading={addLanguageMutation.isPending}
        icon={
          !addLanguageMutation.isPending ? (
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          ) : undefined
        }
      >
        Thêm Ngôn Ngữ
      </Button>
    </div>
  )

  return (
    <Dialog
      isOpen={isOpen}
      onClose={handleClose}
      title="Thêm Ngôn Ngữ Mới"
      subtitle="Thêm cột ngôn ngữ mới vào Google Sheets"
      icon="🌍"
      iconColor="emerald"
      size="sm"
      footer={footer}
      showCloseButton={true}
    >
      <form id="add-language-form" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="language-name"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              Tên ngôn ngữ
            </label>
            <Input
              id="language-name"
              type="text"
              value={languageName}
              onChange={(e) => setLanguageName(e.target.value)}
              placeholder="Ví dụ: English, Français, 日本語..."
              disabled={addLanguageMutation.isPending}
              className="w-full"
            />
            <p className="text-xs text-slate-500 mt-1">
              Tên ngôn ngữ sẽ trở thành header column trong Google Sheets
            </p>
          </div>
        </div>
      </form>
    </Dialog>
  )
}
