"use client"

import sheetApi from "@/apis/sheet"

import { useSpreadsheet } from "@/providers/preadsheetProvider"
import { useState } from "react"
import { Menu, MenuButton, Transition } from "@headlessui/react"
import { Fragment } from "react"
import AddLanguageModal from "../add-language-modal"
import DeleteLanguageConfirmationModal from "../delete-language-confirmation-modal/DeleteLanguageConfirmationModal"
import { customToast } from "../toast"

export default function LanguageFilter() {
  const {
    data,
    listLocales,
    selectedLocales,
    setSelectedLocales,
    setResponse,
  } = useSpreadsheet()
  const [isAddLanguageModalOpen, setIsAddLanguageModalOpen] = useState(false)

  // States for Language Deletion
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [languageToDelete, setLanguageToDelete] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)

  const handleToggleLanguage = (lang: string) => {
    if (selectedLocales.includes(lang)) {
      setSelectedLocales(selectedLocales.filter((l) => l !== lang))
    } else {
      setSelectedLocales([...selectedLocales, lang])
    }
  }

  const handleSelectAll = () => {
    setSelectedLocales(listLocales)
  }

  const handleDeselectAll = () => {
    setSelectedLocales([])
  }

  const handleDeleteConfirm = async () => {
    if (!data || !languageToDelete) return
    setIsDeleting(true)
    try {
      const updatedData = await sheetApi.deleteLanguage(
        data.id,
        languageToDelete,
      )
      setResponse(updatedData)
      customToast.success(`Đã xóa thành công ngôn ngữ ${languageToDelete}`)
      setIsDeleteModalOpen(false)
      setLanguageToDelete("")
    } catch (error: any) {
      customToast.error(
        error?.response?.data?.error ||
          error?.message ||
          "Không thể xóa ngôn ngữ",
      )
    } finally {
      setIsDeleting(false)
    }
  }

  if (listLocales.length === 0) return null

  return (
    <div className="relative z-50">
      <Menu as="div" className="relative">
        {({ open }) => (
          <>
            {/* Trigger Button */}
            <MenuButton className="glass-effect border border-white/30 rounded-lg backdrop-blur-sm hover:border-slate-300/40 transition-all duration-300 focus:ring-2 focus:ring-slate-400/50 focus:border-slate-400/50 px-4 py-3 flex items-center gap-2 text-slate-700 focus:outline-none ui-open:ring-2 ui-open:ring-blue-500/50">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z"
                />
              </svg>
              <span className="text-[10px] uppercase tracking-widest">
                Ngôn ngữ ({selectedLocales.length}/{listLocales.length})
              </span>
              <svg
                className={`w-4 h-4 transition-transform duration-200 ${
                  open ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </MenuButton>

            {/* Dropdown Menu with Transition */}
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute top-full right-0 mt-2 w-72 glass-effect border border-white/30 rounded-[24px] backdrop-blur-xl shadow-2xl z-[70] focus:outline-none overflow-hidden">
                <div className="p-4 bg-white/80">
                  {/* Header với Select/Deselect All */}
                  <div className="flex justify-between items-center mb-3 pb-3 border-b border-slate-200/30">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Bộ lọc hiển thị
                    </span>
                    <div className="flex gap-1">
                      <button
                        onClick={handleSelectAll}
                        className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors focus:outline-none"
                        title="Chọn tất cả"
                      >
                        <svg
                          className="w-3.5 h-3.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={handleDeselectAll}
                        className="p-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors focus:outline-none"
                        title="Bỏ chọn tất cả"
                      >
                        <svg
                          className="w-3.5 h-3.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2.5}
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18 18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Language Checkboxes */}
                  <div className="space-y-1 max-h-72 overflow-y-auto custom-scrollbar px-1">
                    {listLocales.map((lang) => (
                      <Menu.Item key={lang} as="div">
                        {({ active }) => (
                          <div
                            className={`flex items-center gap-3 p-2 rounded-xl cursor-pointer transition-all group ${
                              active ? "bg-slate-50" : "hover:bg-slate-50/50"
                            }`}
                          >
                            <label className="flex-1 flex items-center gap-3 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={selectedLocales.includes(lang)}
                                onChange={() => handleToggleLanguage(lang)}
                                className="w-4 h-4 text-blue-600 bg-white border-slate-300 rounded focus:ring-blue-500/10 focus:ring-2"
                              />
                              <span className="text-sm font-bold text-slate-700 uppercase tracking-tight">
                                {lang}
                              </span>
                            </label>

                            {/* Delete Action (Irreversible Danger) */}
                            <button
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                setLanguageToDelete(lang)
                                setIsDeleteModalOpen(true)
                              }}
                              className="p-1.5 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
                              title="Xóa vĩnh viễn ngôn ngữ này khỏi bảng tính"
                            >
                              <svg
                                className="w-3.5 h-3.5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          </div>
                        )}
                      </Menu.Item>
                    ))}
                  </div>

                  {/* Footer Action: Add Language */}
                  <div className="mt-3 pt-3 border-t border-slate-200/30">
                    <Menu.Item as="div">
                      {({ active }) => (
                        <button
                          onClick={() => setIsAddLanguageModalOpen(true)}
                          className={`w-full flex items-center justify-center gap-2 p-3 rounded-xl border border-dashed transition-all duration-300 ${
                            active
                              ? "border-blue-300 bg-blue-50 text-blue-600 shadow-sm"
                              : "border-slate-200 text-slate-500 hover:border-blue-300 hover:text-blue-600"
                          }`}
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2.5}
                              d="M12 4v16m8-8H4"
                            />
                          </svg>
                          <span className="text-xs font-black uppercase tracking-widest">
                            Thêm ngôn ngữ
                          </span>
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                </div>
              </Menu.Items>
            </Transition>
          </>
        )}
      </Menu>

      {/* Modals Bundle */}
      <AddLanguageModal
        isOpen={isAddLanguageModalOpen}
        onClose={() => setIsAddLanguageModalOpen(false)}
      />

      <DeleteLanguageConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false)
          setLanguageToDelete("")
        }}
        onConfirm={handleDeleteConfirm}
        languageName={languageToDelete}
        isLoading={isDeleting}
      />
    </div>
  )
}
