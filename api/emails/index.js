import { getDrive, getFolderId, getOrCreateJsonFile, readJsonFile, writeJsonFile } from '../_drive.js'

const EMAILS_FILE_NAME = 'emails.json'
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { email } = req.body ?? {}
    const trimmedEmail = typeof email === 'string' ? email.trim() : ''
    if (!EMAIL_RE.test(trimmedEmail)) {
      return res.status(400).json({ error: 'A valid email is required' })
    }

    const drive = getDrive()
    const folderId = getFolderId()
    const fileId = await getOrCreateJsonFile(drive, folderId, EMAILS_FILE_NAME, [])

    const entry = {
      id: Date.now(),
      email: trimmedEmail.slice(0, 200),
      createdTime: new Date().toISOString(),
    }

    const emails = await readJsonFile(drive, fileId, [])
    emails.unshift(entry)
    await writeJsonFile(drive, fileId, emails)

    res.status(201).json({ ok: true })
  } catch (err) {
    console.error('Failed to handle email request', err)
    res.status(500).json({ error: 'Failed to handle email request' })
  }
}
