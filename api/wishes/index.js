import { getDrive, getFolderId, getOrCreateJsonFile, readJsonFile, writeJsonFile } from '../_drive.js'

const WISHES_FILE_NAME = 'wishes.json'

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const drive = getDrive()
    const folderId = getFolderId()
    const fileId = await getOrCreateJsonFile(drive, folderId, WISHES_FILE_NAME, [])

    if (req.method === 'GET') {
      const wishes = await readJsonFile(drive, fileId, [])
      res.setHeader('Cache-Control', 'public, max-age=15, stale-while-revalidate=60')
      return res.status(200).json({ wishes })
    }

    const { name, msg } = req.body ?? {}
    const trimmedMsg = typeof msg === 'string' ? msg.trim() : ''
    if (!trimmedMsg) {
      return res.status(400).json({ error: 'Message is required' })
    }

    const wish = {
      id: Date.now(),
      name: (typeof name === 'string' ? name.trim() : '').slice(0, 80) || 'Anonymous',
      msg: trimmedMsg.slice(0, 1000),
      createdTime: new Date().toISOString(),
    }

    const wishes = await readJsonFile(drive, fileId, [])
    wishes.unshift(wish)
    await writeJsonFile(drive, fileId, wishes)

    res.status(201).json({ wish })
  } catch (err) {
    console.error('Failed to handle wishes request', err)
    res.status(500).json({ error: 'Failed to handle wishes request' })
  }
}
