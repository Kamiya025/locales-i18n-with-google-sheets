"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { useEffect } from "react"

interface RichEditorSegmentProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export default function RichEditorSegment({
  value,
  onChange,
  placeholder,
}: RichEditorSegmentProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm focus:outline-none max-w-none text-sm min-h-[80px] p-4 bg-white rounded-xl border border-slate-100 shadow-inner",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  // Synchronize internal editor content with parent prop if it changes externally
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value)
    }
  }, [value, editor])

  if (!editor) return null

  return (
    <div className="relative group/rte">
      {/* TOOLBAR Overlay - Shows on hover of active segment */}
      <div className="absolute -top-10 left-0 hidden group-focus-within/rte:flex items-center gap-1 p-1 bg-white border border-slate-200 shadow-lg rounded-lg z-10 animate-fadeUp">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
          icon={<BoldIcon />}
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
          icon={<ItalicIcon />}
        />
        <div className="w-px h-4 bg-slate-200 mx-1" />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
          icon={<ListIcon />}
        />
      </div>

      <EditorContent editor={editor} />
      
      {editor.isEmpty && (
        <div className="absolute top-4 left-4 pointer-events-none text-slate-300 text-sm italic">
          {placeholder}
        </div>
      )}
    </div>
  )
}

function ToolbarButton({
  onClick,
  active,
  icon,
}: {
  onClick: () => void
  active?: boolean
  icon: React.ReactNode
}) {
  return (
    <button
      onClick={(e) => {
        e.preventDefault()
        onClick()
      }}
      className={`p-1.5 rounded transition-all ${
        active
          ? "bg-blue-100 text-blue-600"
          : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
      }`}
    >
      {icon}
    </button>
  )
}

function BoldIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 12h9a4 4 0 014 4 4 4 0 01-4 4H6z" />
    </svg>
  )
}

function ItalicIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m-9 16h5m1-16h5" />
    </svg>
  )
}

function ListIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  )
}
