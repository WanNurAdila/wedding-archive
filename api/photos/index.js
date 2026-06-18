import { getDrive, getFolderId } from '../_drive.js'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const drive = getDrive()
    const folderId = getFolderId()

    const { data } = await drive.files.list({
      q: `'${folderId}' in parents and trashed = false and mimeType contains 'image/'`,
      fields:
        'files(id, name, mimeType, createdTime, thumbnailLink, imageMediaMetadata(width, height))',
      orderBy: 'createdTime desc',
      pageSize: 200,
    })

    res.setHeader('Cache-Control', 'private, max-age=15, stale-while-revalidate=60')
    res.status(200).json({ photos: data.files ?? [] })
  } catch (err) {
    console.error('Failed to list photos', err)
    res.status(500).json({ error: 'Failed to list photos' })
  }
}
