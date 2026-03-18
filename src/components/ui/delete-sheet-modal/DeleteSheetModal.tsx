"use client"

import { Dialog } from "../dialog"
import Button from "../button"
import { CloseIcon, DocumentIcon } from "../icons"

interface DeleteSheetModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  sheetTitle: string
  isDeleting: boolean
}

export default function DeleteSheetModal({
  isOpen,
  onClose,
  onConfirm,
  sheetTitle,
  isDeleting,
}: DeleteSheetModalProps) {
  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="🗑️ Xóa Danh Mục"
      subtitle="Hành động này không thể hoàn tác"
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
              Xác nhận xóa: <span className="text-rose-500">{sheetTitle}</span>?
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium max-w-xs mx-auto">
              Toàn bộ dữ liệu bản dịch bên trong danh mục này sẽ bị xóa vĩnh viễn khỏi Google Sheet / Excel.
            </p>
          </div>
        </div>

        {/* Info Card */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 space-y-3">
          <div className="flex items-start gap-3">
            <div className="mt-1 w-5 h-5 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
              <span className="text-[10px] font-bold">!</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
              Chúng tôi khuyên bạn nên xuất dữ liệu (Export) trước khi thực hiện xóa để lưu trữ dự phòng.
            </p>
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
             Hủy bỏ
          </Button>
          <Button
            onClick={onConfirm}
            variant="gradient"
            className="flex-1 rounded-2xl py-4 from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 shadow-lg shadow-rose-500/20"
            disabled={isDeleting}
            loading={isDeleting}
          >
            Xác nhận xóa
          </Button>
        </div>
      </div>
    </Dialog>
  )
}
