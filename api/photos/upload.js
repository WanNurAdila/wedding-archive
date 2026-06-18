import { Readable } from 'node:stream'
import { getDrive, getFolderId } from '../_drive.js'

export const config = {
  api: {
    bodyParser: false,
  },
}

function readRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = []
    req.on('data', (chunk) => chunks.push(chunk))
    req.on('end', () => resolve(Buffer.concat(chunks)))
    req.on('error', reject)
  })
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const mimeType = req.headers['content-type']
  if (!mimeType || !mimeType.startsWith('image/')) {
    return res.status(400).json({ error: 'Content-Type must be an image/* type' })
  }

  const fileName = req.headers['x-file-name']
    ? decodeURIComponent(req.headers['x-file-name'])
    : `photo-${Date.now()}.jpg`

  try {
    const buffer = await readRawBody(req)
    if (buffer.length === 0) {
      return res.status(400).json({ error: 'Empty file' })
    }
    if (buffer.length > 25 * 1024 * 1024) {
      return res.status(413).json({ error: 'File too large (max 25MB)' })
    }

    const drive = getDrive()
    const folderId = getFolderId()

    const { data } = await drive.files.create({
      requestBody: {
        name: fileName,
        parents: [folderId],
      },
      media: {
        mimeType,
        body: Readable.from(buffer),
      },
      fields: 'id, name, mimeType, createdTime',
    })

    res.status(201).json({ photo: data })
  } catch (err) {
    console.error('Failed to upload photo', err)
    res.status(500).json({ error: 'Failed to upload photo' })
  }
}
