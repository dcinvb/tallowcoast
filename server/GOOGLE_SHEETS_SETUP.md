# Google Sheets Setup Guide for Tallow Coast Waitlist

This guide will help you connect your waitlist submissions to Google Sheets in your Google Workspace.

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click **Select a project** → **New Project**
3. Name it "Tallow Coast Waitlist" (or whatever you prefer)
4. Click **Create**

## Step 2: Enable Google Sheets API

1. In your project, go to **APIs & Services** → **Library**
2. Search for "Google Sheets API"
3. Click on it and press **Enable**

## Step 3: Create a Service Account

1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **Service Account**
3. Fill in:
   - **Service account name**: `tallowcoast-sheets`
   - **Service account ID**: (auto-generated)
   - **Description**: "Service account for Tallow Coast waitlist"
4. Click **Create and Continue**
5. Skip the optional steps (no roles needed for now)
6. Click **Done**

## Step 4: Generate Service Account Key

1. In **Credentials**, find your service account under "Service Accounts"
2. Click on the service account email
3. Go to the **Keys** tab
4. Click **Add Key** → **Create new key**
5. Choose **JSON** format
6. Click **Create** - a JSON file will download

## Step 5: Prepare Your Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet or use an existing one
3. Name it "Tallow Coast Waitlist" (or whatever you prefer)
4. Add headers in the first row:
   - **A1**: Email
   - **B1**: Timestamp
5. Copy the **Spreadsheet ID** from the URL:
   ```
   https://docs.google.com/spreadsheets/d/SPREADSHEET_ID_HERE/edit
   ```
6. **Share the sheet** with your service account:
   - Click the **Share** button
   - Paste your service account email (from the JSON file: `client_email`)
   - Give it **Editor** access
   - Click **Send**

## Step 6: Configure Your Server

1. Create a `.env` file in the `server` folder (copy from `.env.example`)
2. Open the downloaded JSON key file
3. Fill in your `.env` file:

```env
PORT=3001
CORS_ORIGIN=http://localhost:5173

# Google Sheets Configuration
GOOGLE_SHEET_ID=your-spreadsheet-id-from-step-5
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project-id.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour\nPrivate\nKey\nHere\n-----END PRIVATE KEY-----\n"
```

### Important Notes:

- **GOOGLE_SHEET_ID**: Copy from your sheet URL (Step 5)
- **GOOGLE_SERVICE_ACCOUNT_EMAIL**: Copy `client_email` from JSON file
- **GOOGLE_PRIVATE_KEY**: Copy `private_key` from JSON file
  - Keep the quotes around it
  - Keep the `\n` characters as-is (don't replace with actual line breaks)
  - The key should start with `-----BEGIN PRIVATE KEY-----` and end with `-----END PRIVATE KEY-----`

## Step 7: Restart Your Server

```bash
npm run dev
```

## Testing

1. Go to http://localhost:5173 in your browser
2. Submit an email through the waitlist form
3. Check your Google Sheet - the email should appear!

## Troubleshooting

### "Error writing to Google Sheet: Permission denied"
- Make sure you shared the sheet with the service account email
- Give the service account **Editor** access

### "Error writing to Google Sheet: Invalid credentials"
- Double-check your `GOOGLE_PRIVATE_KEY` in `.env`
- Make sure it includes the BEGIN/END markers
- Ensure the key is wrapped in quotes

### "Sheet not found"
- Verify your `GOOGLE_SHEET_ID` is correct
- Make sure the sheet is shared with your service account

### Want to change the sheet name?
Edit `index.js` line that says `range: 'Sheet1!A:B'` and replace `Sheet1` with your sheet name.

## Production Deployment

When deploying to production (Cloudflare Workers, etc.):
- Set these environment variables in your hosting platform
- Never commit the `.env` file or JSON key to Git
- The `.gitignore` already excludes `.env` files
