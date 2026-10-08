import { copyFile, mkdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { execFileSync } from 'node:child_process'

// Conversion only: preserve the generated artwork and all text without cropping.
const sourceDirectory = process.argv[2] || join(process.cwd(), 'artwork/seo')
const outputDirectory = join(process.cwd(), 'public/assets/seo')
const artworkDirectory = join(process.cwd(), 'artwork/seo')
const manifest = JSON.parse(await readFile(join(outputDirectory, 'prompts.json'), 'utf8'))
await mkdir(outputDirectory, { recursive: true })
await mkdir(artworkDirectory, { recursive: true })
for (const asset of manifest.assets) {
  const source = join(sourceDirectory, process.argv[2] ? asset.sourceFile : `${asset.slug}.png`)
  const master = join(artworkDirectory, `${asset.slug}.png`)
  if (source !== master) await copyFile(source, master)
  execFileSync('sips', ['-s', 'format', 'jpeg', '-s', 'formatOptions', '86', '--resampleHeightWidth', '630', '1200', master, '--out', join(outputDirectory, `${asset.slug}.jpg`)], { stdio: 'pipe' })
  console.log(`Prepared ${asset.slug}.jpg (1200 × 630)`)
}
