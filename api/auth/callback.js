import { getOAuthClient } from '../_drive.js'

export default async function handler(req, res) {
  const { code, error } = req.query

  if (error) {
    return res.status(400).send(`Google returned an error: ${error}`)
  }
  if (!code) {
    return res.status(400).send('Missing ?code parameter')
  }

  try {
    const oauth2Client = getOAuthClient()
    const { tokens } = await oauth2Client.getToken(code)

    res.setHeader('Content-Type', 'text/plain')

    if (!tokens.refresh_token) {
      return res
        .status(200)
        .send(
          'Got an access token but no refresh token.\n\n' +
            'This usually means you already authorized this app before. Revoke access at ' +
            'https://myaccount.google.com/permissions and visit /api/auth/google again so ' +
            'Google issues a fresh refresh token.',
        )
    }

    res.status(200).send(`Copy this value into GOOGLE_OAUTH_REFRESH_TOKEN:\n\n${tokens.refresh_token}\n`)
  } catch (err) {
    console.error('OAuth callback error', err)
    res.status(500).send('Failed to exchange code for tokens')
  }
}
