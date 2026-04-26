import { existsSync, readFileSync } from 'node:fs'
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
  'tests/harness/knowledge',
  'tests/harness/contracts',
  'tests/harness/journeys',
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

console.log('Knowledge harness passed.')
