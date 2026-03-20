# NFB Salon Booking System Setup Instructions

This document provides detailed instructions for setting up the backend connections for the NFB Salon booking system.

## 1. MongoDB Database Setup

The system is configured to use MongoDB. We've already set your connection string in the `.env` file:

```
DATABASE_URL=mongodb+srv://nfbsalonboekingen:5izwB6NqQXmpnz6m@nfbsalon.95wds.mongodb.net/bookings?retryWrites=true&w=majority&appName=nfbsalon
```

No additional setup is needed for MongoDB.

## 2. Email Configuration (Gmail)

To use Gmail for sending booking confirmations:

1. **Set up an App Password for Gmail**:
   - Go to your [Google Account Security settings](https://myaccount.google.com/security)
   - Make sure 2-Step Verification is enabled
   - Go to "App passwords" (under "Signing in to Google")
   - Select "Mail" as the app and "Other" as the device (name it "NFB Salon")
   - Click "Generate"
   - Copy the 16-character password provided

2. **Update the `.env` file** with your Gmail details:
   ```
   EMAIL_SERVER_HOST=smtp.gmail.com
   EMAIL_SERVER_PORT=587
   EMAIL_SERVER_USER=your-actual-email@gmail.com
   EMAIL_SERVER_PASSWORD=your-16-character-app-password
   EMAIL_FROM=your-actual-email@gmail.com
   ```

## 3. Google Calendar Integration

### Step 1: Create a Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "New Project" and give it a name (e.g., "NFB Salon Booking")
3. Wait for the project to be created, then select it

### Step 2: Enable Google Calendar API
1. In the sidebar, go to "APIs & Services" > "Library"
2. Search for "Google Calendar API"
3. Click on it and then click "Enable"

### Step 3: Create a Service Account
1. In the sidebar, go to "IAM & Admin" > "Service Accounts"
2. Click "Create Service Account"
3. Enter a name (e.g., "NFB Salon Booking Service")
4. Click "Create and Continue"
5. For role, select "Basic" > "Editor" (or a more restrictive role if preferred)
6. Click "Continue" and then "Done"

### Step 4: Create a Service Account Key
1. Click on the service account you just created
2. Go to the "Keys" tab
3. Click "Add Key" > "Create new key"
4. Select "JSON" and click "Create"
5. A JSON file will be downloaded to your computer - keep it secure!

### Step 5: Share Your Calendar
1. Go to [Google Calendar](https://calendar.google.com/)
2. On the left, find your calendar and click the three dots
3. Select "Settings and sharing"
4. Scroll to "Share with specific people"
5. Click "Add people"
6. Enter the service account email address (ends with @gserviceaccount.com)
7. Set permissions to "Make changes to events"
8. Click "Send"

### Step 6: Get Your Calendar ID
1. In the calendar settings, scroll down to "Integrate calendar"
2. Copy the "Calendar ID" (usually your email address)

### Step 7: Encode Service Account Credentials
1. Save the downloaded JSON key file in the `scripts` folder as `google-credentials.json`
2. Run the encode script:
   ```
   cd nfbsalon
   node scripts/encode-credentials.js
   ```
3. Copy the long base64 string output

### Step 8: Update the `.env` File
```
GOOGLE_CALENDAR_CREDENTIALS=your-base64-encoded-credentials-here
GOOGLE_CALENDAR_ID=your-calendar-id-here
```

## 4. Salon Information

Update your salon's details in the `.env` file:

```
SALON_NAME="NFB Salon"
SALON_EMAIL=your-salon-email@example.com
SALON_PHONE="+31 123 456 789"
SALON_ADDRESS="Your Salon's Address, City, Postcode"
OWNER_EMAIL=your-notification-email@example.com
```

## 5. Testing the Setup

After completing all the above steps:

1. Start the development server:
   ```
   npm run dev
   ```

2. Test the booking system by making a test booking
3. Check that you receive email notifications
4. Verify that the appointment appears in your Google Calendar

## Troubleshooting

- **MongoDB Connection**: If you see database connection errors, check your MongoDB Atlas settings to ensure your IP is whitelisted.
- **Email Sending**: If emails aren't being sent, verify your app password is correct and that less secure apps are allowed in your Gmail settings.
- **Google Calendar**: If calendar events aren't being created, check that your service account has permission to modify your calendar and that the credentials are correctly encoded.

For any technical issues, refer to the Next.js documentation or MongoDB Atlas documentation. 