import { getDrive } from '../_drive.js'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { id, download } = req.query

  try {
    const drive = getDrive()

    const { data: meta } = await drive.files.get({
      fileId: id,
      fields: 'name, mimeType',
    })

    const { data: stream } = await drive.files.get(
      { fileId: id, alt: 'media' },
      { responseType: 'stream' },
    )

    res.setHeader('Content-Type', meta.mimeType || 'application/octet-stream')
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
    if (download) {
      res.setHeader('Content-Disposition', `attachment; filename="${meta.name}"`)
    }

    stream.on('error', (err) => {
      console.error('Drive stream error', err)
      res.status(500).end()
    })
    stream.pipe(res)
  } catch (err) {
    console.error('Failed to fetch photo', err)
    res.status(404).json({ error: 'Photo not found' })
  }
}
