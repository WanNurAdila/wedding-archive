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

export { DRIVE_SCOPES }
