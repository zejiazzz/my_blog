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
      <div className="post-card-index" aria-hidden="true">
        <span className="post-card-index-label">
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>

      <div className="post-card-body">
        <div className="post-card-header">
          <span className="post-card-kicker">{skill.category || (lang === 'zh' ? '技能' : 'Skill')}</span>
          <span className="post-card-meta">{skill.slug}</span>
        </div>

        <h2 className="post-card-title">{title}</h2>

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
      </div>
    </Link>
  )
}
