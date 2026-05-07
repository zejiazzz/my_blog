declare module '@toast-ui/editor' {
  export type EditorType = 'markdown' | 'wysiwyg'

  export interface EditorOptions {
    el: HTMLElement
    height?: string
    minHeight?: string
    initialValue?: string
    initialEditType?: EditorType
    previewStyle?: 'tab' | 'vertical'
    placeholder?: string
    language?: string
    theme?: string
    usageStatistics?: boolean
  }

  export interface EditorElements {
    mdEditor: HTMLElement
    mdPreview: HTMLElement
    wwEditor: HTMLElement
  }

  export default class Editor {
    constructor(options: EditorOptions)
    on(type: string, handler: () => void): void
    getMarkdown(): string
    setMarkdown(markdown: string): void
    replaceSelection(text: string): void
    isWysiwygMode(): boolean
    isMarkdownMode(): boolean
    getEditorElements(): EditorElements
    destroy(): void
  }
}

declare module '@toast-ui/editor/dist/i18n/zh-cn'
