import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import path from 'node:path'

const root = process.cwd()

const requiredPaths = [
  'AGENTS.md',
  'ai-rules.project.json',
  'package.json',
  'proxy.ts',
  'supabase/setup.sql',
  'docs/architecture/app-map.md',
  'docs/architecture/exceptions.md',
  'docs/specs/blog/overview.md',
  'docs/specs/blog/journeys.md',
  'docs/specs/blog/contracts.md',
  'docs/specs/blog/acceptance.md',
  'docs/plans/README.md',
  'docs/plans/active',
  'docs/plans/archive',
  'docs/plans/templates/feature-spec.template.md',
  'tests/harness/knowledge',
  'tests/harness/contracts',
  'tests/harness/journeys',
  'tests/harness/README.md',
]

const requiredScripts = [
  'dev',
  'build',
  'preview',
  'check-type',
  'lint',
  'test:unit',
  'test:smoke',
  'test:e2e',
  'verify:knowledge',
]

const requiredRoutes = [
  'app/page.tsx',
  'app/posts/[slug]/page.tsx',
  'app/skills/page.tsx',
  'app/skills/[slug]/page.tsx',
  'app/admin/page.tsx',
  'app/admin/skills/page.tsx',
  'app/admin/skills/new/page.tsx',
  'app/admin/skills/edit/[id]/page.tsx',
]

function assertPath(relativePath) {
  if (!existsSync(path.join(root, relativePath))) {
    throw new Error(`Missing required path: ${relativePath}`)
  }
}

function listMarkdownFiles(relativeDir) {
  const absoluteDir = path.join(root, relativeDir)

  return readdirSync(absoluteDir)
    .filter((entry) => entry.endsWith('.md'))
    .filter((entry) => statSync(path.join(absoluteDir, entry)).isFile())
}

function assertPlanStructure(relativePath) {
  const content = readFileSync(path.join(root, relativePath), 'utf8')
  const requiredSections = [
    '## S · Situation',
    '## T · Task',
    '## A · Action',
    '## R · Result',
    '## L · Learning',
  ]

  for (const section of requiredSections) {
    if (!content.includes(section)) {
      throw new Error(`Plan missing required section "${section}": ${relativePath}`)
    }
  }
}

for (const requiredPath of [...requiredPaths, ...requiredRoutes]) {
  assertPath(requiredPath)
}

const packageJson = JSON.parse(readFileSync(path.join(root, 'package.json'), 'utf8'))
for (const script of requiredScripts) {
  if (!packageJson.scripts?.[script]) {
    throw new Error(`Missing package script: ${script}`)
  }
}

const setupSql = readFileSync(path.join(root, 'supabase/setup.sql'), 'utf8')
for (const table of ['public.posts', 'public.skills', 'public.about_page', 'public.mcp_page']) {
  if (!setupSql.includes(table)) {
    throw new Error(`Database setup does not mention ${table}`)
  }
}

for (const relativeDir of ['docs/plans/active', 'docs/plans/archive']) {
  for (const filename of listMarkdownFiles(relativeDir)) {
    if (!filename.endsWith('-spec.md')) {
      throw new Error(`Plan file must end with "-spec.md": ${path.posix.join(relativeDir, filename)}`)
    }

    assertPlanStructure(path.posix.join(relativeDir, filename))
  }
}

console.log('Knowledge harness passed.')
