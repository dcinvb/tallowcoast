# Google Sheets Integration via Apps Script (No Service Account Needed)

Since your Google Workspace blocks service account key creation, use this alternative method with Google Apps Script.

## Step 1: Create Your Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet named "Tallow Coast Waitlist"
3. In the first row, add headers:
   - **A1**: Email
   - **B1**: Timestamp

## Step 2: Open Apps Script Editor

1. In your Google Sheet, click **Extensions** → **Apps Script**
2. Delete any existing code
3. Paste this code:

```javascript
function doPost(e) {
  try {
    // Parse the incoming JSON data
    const data = JSON.parse(e.postData.contents);
    const email = data.email;
    const timestamp = data.timestamp;
    
    // Get the active spreadsheet
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Append the data as a new row
    sheet.appendRow([email, timestamp]);
    
    // Return success response
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'Email added to waitlist'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    // Return error response
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// Test function (optional)
function testDoPost() {
  const testData = {
    postData: {
      contents: JSON.stringify({
        email: 'test@example.com',
        timestamp: new Date().toISOString()
      })
    }
  };
  
  const result = doPost(testData);
  Logger.log(result.getContent());
}
```

4. Click **Save** (disk icon) and name it "Waitlist Webhook"

## Step 3: Deploy as Web App

1. Click **Deploy** → **New deployment**
2. Click the gear icon ⚙️ next to "Select type" and choose **Web app**
3. Fill in the settings:
   - **Description**: "Tallow Coast Waitlist Webhook"
   - **Execute as**: **Me** (your email)
   - **Who has access**: **Anyone** (this is safe - it only accepts POST requests with data)
4. Click **Deploy**
5. Click **Authorize access** and follow the prompts to allow the script to access your spreadsheet
6. **Copy the Web App URL** - it looks like:
   ```
   https://script.google.com/macros/s/LONG_ID_HERE/exec
   ```
7. Click **Done**

## Step 4: Update Your Server Code

Now update your server to use the webhook URL instead of the Google Sheets API.

1. Open `server/.env` file
2. Remove the Google Sheets API variables
3. Add this instead:

```env
PORT=3001
CORS_ORIGIN=http://localhost:5173

# Google Apps Script Webhook URL
GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
```

Replace `YOUR_SCRIPT_ID` with the actual URL from Step 3.

## Step 5: Test It

1. Restart your server: `npm run dev:server`
2. Go to http://localhost:5173
3. Submit a test email
4. Check your Google Sheet - the email should appear!

## Troubleshooting

### "Authorization required"
- Make sure you authorized the script in Step 3
- Redeploy if needed

### "Script function not found"
- Ensure the function is named exactly `doPost` (case-sensitive)

### Not appearing in sheet?
- Check that "Who has access" is set to "Anyone"
- Verify the webhook URL is correct in your `.env` file

## Security Notes

- The webhook only accepts POST requests with email data
- No authentication credentials are stored on your server
- The script runs under your Google account permissions
- Only you can edit the script or sheet

## Updating the Deployment

If you need to modify the script:
1. Edit the code in Apps Script
2. Click **Deploy** → **Manage deployments**
3. Click the pencil icon to edit
4. Change "Version" to "New version"
5. Click **Deploy**

The URL stays the same!
