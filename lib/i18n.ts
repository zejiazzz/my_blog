export type Lang = 'zh' | 'en'

export const t = {
  zh: {
    nav: { posts: '文章', about: '关于', admin: '后台' },
    home: { cmd: '❯ ls -la ./posts', title: '文章', empty: '暂无文章。' },
    about: { cmd: '❯ cat ./about.md', title: '关于我', back: '← 返回', empty: '暂无内容。', editLabel: '中文内容' },
    post: { back: '← 返回' },
  },
  en: {
    nav: { posts: 'posts', about: 'about', admin: 'admin' },
    home: { cmd: '❯ ls -la ./posts', title: 'Writing', empty: 'No posts yet.' },
    about: { cmd: '❯ cat ./about.md', title: 'About', back: '← cd ..', empty: 'No content yet.', editLabel: 'English content' },
    post: { back: '← cd ..' },
  },
} as const
