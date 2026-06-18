import { getDrive, getFolderId } from '../_drive.js'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const drive = getDrive()
    const folderId = getFolderId()

    const photos = []
    let pageToken

    do {
      const { data } = await drive.files.list({
        q: `'${folderId}' in parents and trashed = false and mimeType contains 'image/'`,
        fields:
          'nextPageToken, files(id, name, mimeType, createdTime, thumbnailLink, imageMediaMetadata(width, height))',
        orderBy: 'createdTime desc',
        pageSize: 1000,
        pageToken,
      })
      photos.push(...(data.files ?? []))
      pageToken = data.nextPageToken
    } while (pageToken)

    res.setHeader('Cache-Control', 'public, max-age=15, stale-while-revalidate=60')
    res.status(200).json({ photos })
  } catch (err) {
    console.error('Failed to list photos', err)
    res.status(500).json({ error: 'Failed to list photos' })
  }
}
