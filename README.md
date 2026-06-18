# Wedding Archive

A small installable web app (PWA) for wedding guests to take photos with their
camera and upload them straight into a shared Google Drive folder, and to
browse/download everyone else's photos.

- Frontend: React + Vite, installable as a PWA (`vite-plugin-pwa`)
- Backend: Vercel serverless functions in `api/` talk to Google Drive on
  behalf of the account that owns the folder, so guests never need to sign
  in with Google themselves
- Storage: a single Google Drive folder that only contains images

## How it works

- `api/photos/index.js` — lists images in the Drive folder
- `api/photos/upload.js` — uploads a captured/picked image into the folder
- `api/photos/[id].js` — streams an image (for viewing or, with `?download=1`, downloading)
- `api/auth/google.js` / `api/auth/callback.js` — a one-time setup flow (see
  step 3) that authorizes the app as the folder's owner

The frontend never talks to Google directly — it only calls the `/api/photos/*`
routes.

Note: this uses OAuth delegation rather than a Google service account.
Service accounts have **zero storage quota** of their own, so they can't own
files uploaded into a regular "My Drive" folder — that only works with
Shared Drives, which require Google Workspace. For a personal Gmail account,
acting on behalf of the real owner via a refresh token is the supported way
to let a backend read/write a personal Drive folder.

## 1. Create a Google Cloud OAuth client

1. Go to the [Google Cloud Console](https://console.cloud.google.com/) and
   create a new project (or reuse one).

2. Enable the **Google Drive API**: *APIs & Services → Enable APIs and
   Services → search "Google Drive API" → Enable*.

3. Configure the OAuth consent screen (*APIs & Services → OAuth consent
   screen*): choose **External**, fill in the required fields. You can leave
   it in **Testing** status, but add your own Google account under **Test
   users** — otherwise the one-time consent in step 3 will be blocked.
   
4. Create credentials: *APIs & Services → Credentials → Create Credentials →
   OAuth client ID → Web application*.
   - Add an **Authorized redirect URI** matching where you'll run the app,
     e.g. `http://localhost:3000/api/auth/callback` for local dev, and your
     production URL's `/api/auth/callback` once deployed.
   - Save the **Client ID** and **Client secret**.

## 2. Create the Drive folder

1. In Google Drive (on the account whose storage you want to use), create a
   folder (e.g. "Wedding Photos") that will hold only the uploaded images.
2. Open the folder and copy its ID from the URL:
   `https://drive.google.com/drive/folders/<THIS_IS_THE_FOLDER_ID>`.

## 3. Configure environment variables and authorize once

1. Copy `.env.example` to `.env` and fill in:

   ```
   GOOGLE_OAUTH_CLIENT_ID=<client ID from step 1>
   GOOGLE_OAUTH_CLIENT_SECRET=<client secret from step 1>
   GOOGLE_OAUTH_REDIRECT_URI=http://localhost:3000/api/auth/callback
   GOOGLE_DRIVE_FOLDER_ID=<the folder ID from step 2>
   ```

   Leave `GOOGLE_OAUTH_REFRESH_TOKEN` unset for now.

2. Start the app locally (see step 4) and visit `/api/auth/google` in your
   browser. Sign in with the Google account that owns the folder and accept
   the consent screen (it'll show an "unverified app" warning since this is
   a personal project — click **Advanced → Go to (app name)** to proceed).
3. You'll be redirected to `/api/auth/callback`, which prints a refresh
   token. Copy it into `.env` as `GOOGLE_OAUTH_REFRESH_TOKEN` and restart the
   dev server.

This is a one-time step — after this, the backend can read/write the folder
indefinitely without any guest (or you) needing to log in again. If you ever
see "no refresh token" on that page, it means Google already issued one
previously; revoke access at https://myaccount.google.com/permissions and
repeat step 2.

When deploying on Vercel, set the same four variables under **Project
Settings → Environment Variables**, using your production redirect URI.

## 4. Run locally

```bash
npm install
npm install -g vercel   # if you don't already have it
vercel dev              # serves the Vite app AND the api/ functions together
```

Using `vercel dev` (rather than plain `npm run dev`) is required locally so
the `/api/*` routes work — Vite alone doesn't run the serverless functions.

## 5. Deploy

```bash
vercel
```

Vercel auto-detects the Vite framework and the `api/` folder. Make sure the
environment variables from step 3 are set in the Vercel project before
deploying, using the production callback URL as the redirect URI (and
registering that same URI in the Google Cloud OAuth client).

## Notes on camera access

The "Take Photo" button uses `navigator.mediaDevices.getUserMedia`, which
requires HTTPS (or `localhost`) and an explicit permission grant from the
user. It falls back to a clear error message if the device has no camera or
the user denies permission. Guests can also use the "Upload" button to pick
existing photos from their device instead.
