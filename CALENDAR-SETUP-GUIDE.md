# Google Calendar Setup Guide

This guide will help you set up Google Calendar correctly for NFB Salon's booking system.

## Problem

Bookings are not appearing in your Google Calendar because the service account doesn't have permission to access and create events in your calendar.

## Solution

You need to share your Google Calendar with the service account email address.

### Step 1: Find Your Service Account Email

The service account email is:
```
nfb-boekingen@nfb-salon-boekingen.iam.gserviceaccount.com
```

### Step 2: Share Your Calendar

1. Go to [Google Calendar](https://calendar.google.com/)
2. On the left side, find your calendar ("nfbsalonboekingen@gmail.com" or whatever calendar you're using)
3. Hover over the calendar name, click the three dots (⋮) and select "Settings and sharing"
4. Scroll down to "Share with specific people or groups"
5. Click "+ Add people"
6. Enter the service account email: `nfb-boekingen@nfb-salon-boekingen.iam.gserviceaccount.com`
7. Set the permission to "Make changes to events"
8. Click "Send"

### Step 3: Verify Calendar ID

Make sure your `.env.local` file has the correct Calendar ID:

```
GOOGLE_CALENDAR_ID=nfbsalonboekingen@gmail.com
```

### Step 4: Test the Integration

1. After completing the steps above, restart your server
2. Make a test booking through your website
3. Check your Google Calendar to see if the event appears

## Troubleshooting

If you still don't see events in your calendar:

1. **Check for error messages**: Look at your server logs for any error messages related to Google Calendar.

2. **Run the calendar checker script**:
   ```
   node scripts/check-calendar-access.js
   ```

3. **Verify Google Cloud Platform settings**:
   - Make sure the Google Calendar API is enabled in your Google Cloud Project
   - Check that the service account has the correct permissions
   - Ensure the API key/credentials are active

4. **Check your credentials**:
   If the credentials have been corrupted, you can generate new ones in the Google Cloud Console.

## Need Help?

If you still can't get it working:

1. Check the logs for specific error messages
2. Ensure your Google account has sufficient permissions
3. Try creating a new service account if needed

With the correct setup, each new booking should automatically appear in your Google Calendar! 