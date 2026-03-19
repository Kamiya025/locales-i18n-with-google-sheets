"use client"

import { Dialog } from "../dialog"
import Button from "../button"
import { CloseIcon, DocumentIcon } from "../icons"
import Input from "../input"
import { useState, useEffect } from "react"

interface DeleteSheetModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  sheetTitle: string
  isDeleting: boolean
}

import { useTranslation } from "@/providers/I18nProvider"

export default function DeleteSheetModal({
  isOpen,
  onClose,
  onConfirm,
  sheetTitle,
  isDeleting,
}: DeleteSheetModalProps) {
  const { t } = useTranslation()
  const [confirmValue, setConfirmValue] = useState("")

  // Clear input when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setConfirmValue("")
    }
  }, [isOpen])

  const isConfirmed = confirmValue.trim().toLowerCase() === sheetTitle.toLowerCase()

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={t("detail.deleteModal.title")}
      subtitle={t("detail.deleteModal.subtitle")}
      size="md"
    >
      <div className="space-y-6 pb-2">
        {/* Warning Icon & Message */}
        <div className="flex flex-col items-center text-center space-y-4 py-4">
          <div className="w-20 h-20 rounded-3xl bg-rose-50 dark:bg-rose-900/10 flex items-center justify-center border border-rose-100 dark:border-rose-900/20 relative">
            <DocumentIcon className="w-10 h-10 text-rose-500" />
            <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center border-4 border-white dark:border-slate-900">
              <CloseIcon className="w-4 h-4" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xl font-black text-slate-900 dark:text-white">
              {t("detail.deleteModal.confirmText").replace("{title}", sheetTitle)}
            </h3>
            <p
              className="text-sm text-slate-500 dark:text-slate-400 font-medium max-w-xs mx-auto"
              dangerouslySetInnerHTML={{ __html: t("detail.deleteModal.description") }}
            />
          </div>
        </div>

        {/* Info & Input */}
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 space-y-3">
            <div className="flex items-start gap-3">
              <div className="mt-1 w-5 h-5 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                <span className="text-[10px] font-bold">!</span>
              </div>
              <p className="text-xs text-amber-700 dark:text-amber-400 font-bold uppercase tracking-tight">
                {t("detail.deleteModal.advice")}
              </p>
            </div>
          </div>

          <div className="space-y-2">
             <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">
               {t("detail.deleteModal.inputLabel") || "Nhập tên danh mục để xác nhận"}
             </label>
             <Input
               value={confirmValue}
               onChange={(e) => setConfirmValue(e.target.value)}
               placeholder={sheetTitle}
               className="rounded-2xl border-2"
               disabled={isDeleting}
               autoComplete="off"
             />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1 rounded-2xl border-2 py-4"
            disabled={isDeleting}
          >
             {t("detail.deleteModal.cancel")}
          </Button>
          <Button
            onClick={onConfirm}
            variant="gradient"
            className={`flex-1 rounded-2xl py-4 shadow-lg transition-all duration-300 ${
              isConfirmed 
                ? "from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 shadow-rose-500/20" 
                : "from-slate-300 to-slate-400 opacity-50 cursor-not-allowed grayscale shadow-none"
            }`}
            disabled={isDeleting || !isConfirmed}
            loading={isDeleting}
          >
            {t("detail.deleteModal.confirm")}
          </Button>
        </div>
      </div>
    </Dialog>
  )
}
