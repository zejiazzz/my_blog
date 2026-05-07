'use client'

import { useEffect, useRef } from 'react'

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

type EditorInstance = {
  getMarkdown: () => string
  setMarkdown: (markdown: string) => void
  on: (type: string, handler: () => void) => void
  destroy: () => void
}

export default function MarkdownEditor({
  value,
  onChange,
  placeholder = '开始写作...',
}: MarkdownEditorProps) {
  const rootRef = useRef<HTMLDivElement | null>(null)
  const editorRef = useRef<EditorInstance | null>(null)
  const initialValueRef = useRef(value)
  const lastSyncedValueRef = useRef(value)

  useEffect(() => {
    let disposed = false

    async function setupEditor() {
      if (!rootRef.current) return

      const { default: Editor } = await import('@toast-ui/editor')

      if (disposed || !rootRef.current) return

      const instance = new Editor({
        el: rootRef.current,
        // 用 tab 预览保持 Markdown 输入区单栏全宽，避免窄容器下再被左右分栏压缩。
        height: '76vh',
        initialValue: initialValueRef.current,
        initialEditType: 'wysiwyg',
        previewStyle: 'tab',
        placeholder,
        usageStatistics: false,
      })

      instance.on('change', () => {
        const nextValue = instance.getMarkdown()
        lastSyncedValueRef.current = nextValue
        onChange(nextValue)
      })

      editorRef.current = instance
    }

    setupEditor()

    return () => {
      disposed = true
      editorRef.current?.destroy()
      editorRef.current = null
    }
  }, [onChange, placeholder])

  useEffect(() => {
    if (!editorRef.current || value === lastSyncedValueRef.current) {
      return
    }

    // 编辑器内部维护自己的 ProseMirror 状态，这里只在外部值变化时做一次同步。
    editorRef.current.setMarkdown(value)
    lastSyncedValueRef.current = value
  }, [value])

  return <div ref={rootRef} className="editor-shell" />
}
