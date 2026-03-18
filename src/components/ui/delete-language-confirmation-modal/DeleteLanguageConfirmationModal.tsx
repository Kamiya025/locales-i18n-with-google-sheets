"use client"

import { Fragment, useState } from "react"
import { Dialog, Transition } from "@headlessui/react"
import Button from "../button"

interface DeleteLanguageConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  languageName: string
  isLoading: boolean
}

export default function DeleteLanguageConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  languageName,
  isLoading,
}: Readonly<DeleteLanguageConfirmationModalProps>) {
  const [typedConfirm, setTypedConfirm] = useState("")

  const canConfirm = typedConfirm === languageName

  return (
    <Transition show={isOpen} as={Fragment}>

      <Dialog as="div" className="relative z-[100]" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-[32px] bg-white p-8 text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-lg border border-slate-200">
                <div className="absolute top-0 right-0 p-6">
                  <button
                    type="button"
                    className="text-slate-400 hover:text-slate-500 transition-colors"
                    onClick={onClose}
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div>
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50">
                    <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div className="mt-6 text-center">
                    <Dialog.Title as="h3" className="text-2xl font-black text-slate-900 tracking-tight uppercase">
                      Xóa ngôn ngữ?
                    </Dialog.Title>
                    <div className="mt-4">
                      <p className="text-slate-600 leading-relaxed">
                        Bạn có chắc chắn muốn xóa ngôn ngữ <strong className="text-slate-900">{languageName}</strong>? 
                        Hành động này sẽ xóa <span className="text-red-600 font-bold uppercase tracking-tight">VĨNH VIỄN</span> toàn bộ cột và dữ liệu bản dịch liên quan trong tất cả các sheets.
                      </p>
                      <div className="mt-2 p-3 bg-amber-50 rounded-xl border border-amber-100 text-amber-700 text-xs font-semibold">
                        ⚠️ Bước này không thể hoàn tác. Chỉ thực hiện khi bạn biết chắc chắn mình đang làm gì.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 space-y-4">
                  <div>
                    <label htmlFor="confirm-lang" className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                       Nhập tên ngôn ngữ để xác nhận
                    </label>
                    <input
                      type="text"
                      id="confirm-lang"
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500/10 focus:border-red-500 transition-all font-bold text-slate-800"
                      placeholder={languageName}
                      value={typedConfirm}
                      onChange={(e) => setTypedConfirm(e.target.value)}
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <button
                      type="button"
                      className="flex-1 px-6 py-3.5 rounded-xl bg-slate-100 text-slate-600 font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all active:scale-95"
                      onClick={onClose}
                    >
                      Hủy bỏ
                    </button>
                    <button
                      type="button"
                      disabled={!canConfirm || isLoading}
                      className={`flex-1 px-6 py-3.5 rounded-xl text-white font-black text-xs uppercase tracking-widest transition-all active:scale-95 shadow-lg ${
                        canConfirm && !isLoading
                          ? "bg-red-600 shadow-red-200 hover:bg-red-700" 
                          : "bg-red-300 shadow-none cursor-not-allowed"
                      }`}
                      onClick={onConfirm}
                    >
                      {isLoading ? "Đang xóa..." : "Xóa vĩnh viễn"}
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
