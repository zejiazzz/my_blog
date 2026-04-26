import Link from 'next/link'
import type { Skill } from '@/lib/types'

interface Props {
  skill: Skill
  index?: number
  lang?: 'zh' | 'en'
}

export default function SkillCard({ skill, index = 0, lang = 'zh' }: Props) {
  const title = lang === 'zh' ? skill.title : skill.title_en || skill.title
  const summary =
    lang === 'zh'
      ? skill.summary || skill.summary_en
      : skill.summary_en || skill.summary

  return (
    <Link href={`/skills/${skill.slug}`} className="post-card">
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '1rem' }}>
        <h2 className="post-card-title">
          <span className="post-card-meta" style={{ marginRight: '0.625rem' }}>
            {String(index + 1).padStart(2, '0')}
          </span>
          {title}
        </h2>
        {skill.category && <span className="post-card-meta">{skill.category}</span>}
      </div>

      {summary && <p className="post-card-excerpt">{summary}</p>}

      {skill.tags.length > 0 && (
        <div className="tag-row">
          {skill.tags.map((tag) => (
            <span key={tag} className="tag-chip">
              {tag}
            </span>
          ))}
        </div>
      )}
    </Link>
  )
}
