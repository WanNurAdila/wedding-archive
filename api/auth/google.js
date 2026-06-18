import { DRIVE_SCOPES, getOAuthClient } from '../_drive.js'

export default function handler(req, res) {
  try {
    const oauth2Client = getOAuthClient()
    const url = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      scope: DRIVE_SCOPES,
    })
    res.writeHead(302, { Location: url })
    res.end()
  } catch (err) {
    res.status(500).send(err.message)
  }
}
