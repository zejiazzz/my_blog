'use client'

import { useEffect, useRef } from 'react'
import type { Lang } from '@/lib/i18n'
import { useTheme } from './ThemeProvider'

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  lang?: Lang
}

type EditorInstance = {
  getMarkdown: () => string
  setMarkdown: (markdown: string) => void
  replaceSelection: (text: string) => void
  isWysiwygMode: () => boolean
  isMarkdownMode: () => boolean
  getEditorElements: () => {
    mdEditor: HTMLElement
    mdPreview: HTMLElement
    wwEditor: HTMLElement
  }
  on: (type: string, handler: () => void) => void
  destroy: () => void
}

const EDITOR_LANGUAGE_BY_APP_LANG = {
  zh: 'zh-CN',
  en: 'en-US',
} as const

function normalizePastedText(text: string) {
  return text
    .replace(/\r\n?/g, '\n')
    .replace(/\u00a0/g, ' ')
    .replace(/\u200b/g, '')
    .replace(/\u0000/g, '')
}

function shouldNormalizePaste(event: ClipboardEvent) {
  const clipboard = event.clipboardData
  if (!clipboard) return false

  const target = event.target
  if (!(target instanceof Element) || !target.closest('.ProseMirror')) {
    return false
  }

  const items = Array.from(clipboard.items ?? [])
  if (items.some((item) => item.kind === 'file')) {
    return false
  }

  const text = clipboard.getData('text/plain')
  if (!text.trim()) {
    return false
  }

  const types = Array.from(clipboard.types ?? [])
  return types.includes('text/html') || types.includes('text/rtf')
}

export default function MarkdownEditor({
  value,
  onChange,
  placeholder = '开始写作...',
  lang = 'zh',
}: MarkdownEditorProps) {
  const rootRef = useRef<HTMLDivElement | null>(null)
  const editorRef = useRef<EditorInstance | null>(null)
  const initialValueRef = useRef(value)
  const lastSyncedValueRef = useRef(value)
  const { theme } = useTheme()

  useEffect(() => {
    let disposed = false
    let teardownPasteListener: (() => void) | undefined

    async function setupEditor() {
      if (!rootRef.current) return

      const editorLanguage = EDITOR_LANGUAGE_BY_APP_LANG[lang]

      const [{ default: Editor }] = await Promise.all([
        import('@toast-ui/editor'),
        lang === 'zh' ? import('@toast-ui/editor/dist/i18n/zh-cn') : Promise.resolve(null),
      ])

      if (disposed || !rootRef.current) return

      const instance = new Editor({
        el: rootRef.current,
        // 用 tab 预览保持 Markdown 输入区单栏全宽，避免窄容器下再被左右分栏压缩。
        height: '76vh',
        initialValue: initialValueRef.current,
        initialEditType: 'wysiwyg',
        previewStyle: 'tab',
        placeholder,
        language: editorLanguage,
        theme: theme === 'dark' ? 'dark' : 'light',
        usageStatistics: false,
      })

      instance.on('change', () => {
        const nextValue = instance.getMarkdown()
        lastSyncedValueRef.current = nextValue
        onChange(nextValue)
      })

      // 富文本模式优先粘贴纯文本，避免外部 Markdown/富文本来源把行内样式带进编辑器。
      const wwEditor = instance.getEditorElements().wwEditor
      const proseMirror = wwEditor.querySelector('.ProseMirror')

      if (proseMirror instanceof HTMLElement) {
        const handlePaste = (event: ClipboardEvent) => {
          if (!instance.isWysiwygMode() || !shouldNormalizePaste(event)) {
            return
          }

          const text = normalizePastedText(event.clipboardData?.getData('text/plain') ?? '')
          if (!text) return

          event.preventDefault()
          instance.replaceSelection(text)
        }

        proseMirror.addEventListener('paste', handlePaste)
        teardownPasteListener = () => proseMirror.removeEventListener('paste', handlePaste)
      }

      editorRef.current = instance
    }

    setupEditor()

    return () => {
      disposed = true
      teardownPasteListener?.()
      if (editorRef.current) {
        initialValueRef.current = editorRef.current.getMarkdown()
        lastSyncedValueRef.current = initialValueRef.current
      }
      editorRef.current?.destroy()
      editorRef.current = null
    }
  }, [lang, onChange, placeholder, theme])

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
