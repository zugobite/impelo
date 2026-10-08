import { writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import sharp from 'sharp'
import toIco from 'to-ico'

const root = join(process.cwd(), 'public')
const svg = join(root, 'assets/mark.svg')
const sizes = [16, 32, 48]

const pngBuffers = await Promise.all(
  sizes.map((size) =>
    sharp(svg, { density: 300 })
      .resize(size, size, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
      .png()
      .toBuffer(),
  ),
)

await writeFile(join(root, 'favicon.ico'), await toIco(pngBuffers))
await writeFile(join(root, 'favicon-32x32.png'), pngBuffers[1])
await writeFile(
  join(root, 'apple-touch-icon.png'),
  await sharp(svg, { density: 300 })
    .resize(180, 180, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .png()
    .toBuffer(),
)

console.log('Wrote public/favicon.ico, favicon-32x32.png, apple-touch-icon.png')
