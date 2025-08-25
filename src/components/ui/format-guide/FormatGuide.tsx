"use client"

import { useState } from "react"
import Button from "../button"
import { Dialog } from "../dialog"
import TemplateCreator from "../template-creator"

export default function FormatGuide() {
  const [isOpen, setIsOpen] = useState(false)
  const [showTemplateCreator, setShowTemplateCreator] = useState(false)

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors"
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
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        Hướng dẫn format Google Sheets
      </button>
    )
  }

  const footer = (
    <div className="flex justify-end gap-3">
      <Button variant="outline" onClick={() => setIsOpen(false)}>
        Đóng
      </Button>
      <Button
        variant="gradient"
        onClick={() => {
          setShowTemplateCreator(true)
          setIsOpen(false)
        }}
        icon={
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
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        }
      >
        Tạo Template với Style Đẹp
      </Button>
    </div>
  )

  return (
    <>
      <Dialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Hướng dẫn Format Google Sheets"
        subtitle="Cách format Google Sheets để sử dụng với app"
        icon="📋"
        iconColor="blue"
        size="xl"
        footer={footer}
      >
        <div className="space-y-6">
          {/* Required Format */}
          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-3">
              ✅ Format bắt buộc
            </h3>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <pre className="text-sm text-green-800 font-mono overflow-x-auto">
                {`| KEY     | English   | Vietnamese  | French      |
|---------|-----------|-------------|-------------|
| hello   | Hello     | Xin chào    | Bonjour     |
| goodbye | Goodbye   | Tạm biệt    | Au revoir   |
| thanks  | Thank you | Cảm ơn      | Merci       |`}
              </pre>
            </div>
            <div className="mt-3 text-sm text-slate-600">
              <p>
                <strong>Quy tắc:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>
                  Column đầu tiên phải có tên{" "}
                  <code className="bg-slate-100 px-1 rounded">KEY</code> hoặc{" "}
                  <code className="bg-slate-100 px-1 rounded">key</code>
                </li>
                <li>Mỗi KEY phải duy nhất (không trùng lặp)</li>
                <li>KEY không được để trống</li>
                <li>Các columns khác là tên ngôn ngữ</li>
                <li>Ít nhất phải có 1 column ngôn ngữ</li>
              </ul>
            </div>
          </div>

          {/* Common Errors */}
          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-3">
              ❌ Các lỗi thường gặp
            </h3>

            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-medium text-red-800 mb-2">
                  1. Thiếu column KEY
                </h4>
                <pre className="text-sm text-red-700 font-mono">
                  {`| English | Vietnamese |  ← ❌ Không có column KEY
|---------|------------|
| Hello   | Xin chào   |`}
                </pre>
                <p className="text-sm text-red-600 mt-2">
                  <strong>Khắc phục:</strong> Thêm column đầu tiên với tên "KEY"
                </p>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-medium text-red-800 mb-2">
                  2. KEY trùng lặp
                </h4>
                <pre className="text-sm text-red-700 font-mono">
                  {`| KEY   | English | Vietnamese |
|-------|---------|------------|
| hello | Hello   | Xin chào   |
| hello | Hi      | Chào       |  ← ❌ Trùng key "hello"`}
                </pre>
                <p className="text-sm text-red-600 mt-2">
                  <strong>Khắc phục:</strong> Đổi tên thành "hello",
                  "hello_casual" hoặc "hi"
                </p>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-medium text-red-800 mb-2">3. KEY trống</h4>
                <pre className="text-sm text-red-700 font-mono">
                  {`| KEY   | English | Vietnamese |
|-------|---------|------------|
| hello | Hello   | Xin chào   |
|       | Goodbye | Tạm biệt   |  ← ❌ KEY trống`}
                </pre>
                <p className="text-sm text-red-600 mt-2">
                  <strong>Khắc phục:</strong> Điền KEY cho row này, ví dụ:
                  "goodbye"
                </p>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-3">
              💡 Mẹo hay
            </h3>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <ul className="text-sm text-blue-800 space-y-2">
                <li>
                  • KEY nên ngắn gọn và có ý nghĩa: <code>menu.home</code>,{" "}
                  <code>button.save</code>
                </li>
                <li>• Có thể để trống translation trong khi làm việc</li>
                <li>
                  • Sử dụng naming convention: <code>page.section.element</code>
                </li>
                <li>
                  • Headers tên ngôn ngữ có thể là: <code>English</code>,{" "}
                  <code>en</code>, <code>EN</code>, <code>Vietnamese</code>,{" "}
                  <code>vi</code>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </Dialog>

      {/* Template Creator */}
      <TemplateCreator
        isOpen={showTemplateCreator}
        onClose={() => setShowTemplateCreator(false)}
      />
    </>
  )
}
