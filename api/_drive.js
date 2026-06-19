import { Readable } from 'node:stream'
import { google } from 'googleapis'

const DRIVE_SCOPES = ['https://www.googleapis.com/auth/drive']

let driveClient = null

export function getOAuthClient() {
  const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID
  const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET
  const redirectUri = process.env.GOOGLE_OAUTH_REDIRECT_URI

  if (!clientId || !clientSecret || !redirectUri) {
    throw new Error(
      'Missing GOOGLE_OAUTH_CLIENT_ID, GOOGLE_OAUTH_CLIENT_SECRET or GOOGLE_OAUTH_REDIRECT_URI env vars',
    )
  }

  return new google.auth.OAuth2(clientId, clientSecret, redirectUri)
}

export function getDrive() {
  if (driveClient) return driveClient

  const refreshToken = process.env.GOOGLE_OAUTH_REFRESH_TOKEN
  if (!refreshToken) {
    throw new Error(
      'Missing GOOGLE_OAUTH_REFRESH_TOKEN env var — visit /api/auth/google once to generate one',
    )
  }

  const oauth2Client = getOAuthClient()
  oauth2Client.setCredentials({ refresh_token: refreshToken })

  driveClient = google.drive({ version: 'v3', auth: oauth2Client })
  return driveClient
}

export function getFolderId() {
  const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID
  if (!folderId) {
    throw new Error('Missing GOOGLE_DRIVE_FOLDER_ID env var')
  }
  return folderId
}

function streamToBuffer(stream) {
  return new Promise((resolve, reject) => {
    const chunks = []
    stream.on('data', (chunk) => chunks.push(chunk))
    stream.on('end', () => resolve(Buffer.concat(chunks)))
    stream.on('error', reject)
  })
}

// Finds (or creates) a JSON file by name directly inside the Drive folder,
// used as a lightweight shared data store (e.g. wishes) alongside the photos.
export async function getOrCreateJsonFile(drive, folderId, name, initialValue) {
  const { data } = await drive.files.list({
    q: `'${folderId}' in parents and trashed = false and name = '${name}'`,
    fields: 'files(id, name)',
    pageSize: 1,
  })

  if (data.files?.length) return data.files[0].id

  const { data: created } = await drive.files.create({
    requestBody: { name, parents: [folderId] },
    media: {
      mimeType: 'application/json',
      body: Readable.from(Buffer.from(JSON.stringify(initialValue))),
    },
    fields: 'id',
  })
  return created.id
}

export async function readJsonFile(drive, fileId, fallback) {
  try {
    const { data: stream } = await drive.files.get(
      { fileId, alt: 'media' },
      { responseType: 'stream' },
    )
    const buffer = await streamToBuffer(stream)
    if (buffer.length === 0) return fallback
    return JSON.parse(buffer.toString('utf8'))
  } catch (err) {
    console.error('Failed to read JSON file from Drive', err)
    return fallback
  }
}

export async function writeJsonFile(drive, fileId, value) {
  await drive.files.update({
    fileId,
    media: {
      mimeType: 'application/json',
      body: Readable.from(Buffer.from(JSON.stringify(value))),
    },
  })
}

export { DRIVE_SCOPES }
