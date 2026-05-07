declare module '@toast-ui/editor' {
  export interface EditorOptions {
    el: HTMLElement
    height?: string
    initialValue?: string
    initialEditType?: 'markdown' | 'wysiwyg'
    previewStyle?: 'tab' | 'vertical'
    placeholder?: string
    usageStatistics?: boolean
  }

  export default class Editor {
    constructor(options: EditorOptions)
    on(type: string, handler: () => void): void
    getMarkdown(): string
    setMarkdown(markdown: string): void
    destroy(): void
  }
}
