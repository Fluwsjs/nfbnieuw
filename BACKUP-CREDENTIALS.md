# Backup Credentials

This file contains backup credentials for the NFB Salon booking system. Keep this file secure and private.

## MongoDB Connection String

```
mongodb+srv://nfbsalonboekingen:5izwB6NqQXmpnz6m@nfbsalon.95wds.mongodb.net/bookings?retryWrites=true&w=majority&appName=nfbsalon
```

## Gmail Credentials

- **Email**: nfbsalonboekingen@gmail.com
- **App Password**: fowh ewwi llxz jcvb

## Google Calendar

- **Service Account Email**: nfb-boekingen@nfb-salon-boekingen.iam.gserviceaccount.com
- **Calendar ID**: nfbsalonboekingen@gmail.com

---

**Important**: If you need to regenerate any of these credentials:

1. For MongoDB: Log in to MongoDB Atlas and reset the password
2. For Gmail: Generate a new app password in your Google Account settings
3. For Google Calendar: Create a new service account key in Google Cloud Console

After regenerating any credential, make sure to update your `.env` file accordingly. 