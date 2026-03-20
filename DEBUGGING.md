# NFB Salon Booking System - Debugging Guide

This guide helps you troubleshoot common issues with the booking system.

## Checking Component Status

You can see which parts of the system are working by looking at the response from a booking attempt. The API returns a status for each component:

```json
{
  "booking": {
    "id": "booking-id",
    "service": "Service Name",
    "treatment": "Treatment Name",
    "date": "2023-12-31",
    "time": "10:00",
    "price": 50,
    "duration": 60
  },
  "calendar": "success", // or "failed"
  "emails": {
    "customer": "sent", // or "failed"
    "owner": "sent" // or "failed"
  }
}
```

## MongoDB Connection Issues

**Symptoms:**
- Bookings not being saved
- Error: "Failed to create booking"

**Solutions:**
1. Check your `DATABASE_URL` in the `.env` file
2. Verify your IP address is whitelisted in MongoDB Atlas
3. Test connection using the script:
   ```
   node scripts/check-db-connection.js
   ```
4. Check the console for specific MongoDB error messages

## Email Sending Issues

**Symptoms:**
- Bookings are saved but no emails are sent
- "failed" status for emails in the API response

**Solutions:**
1. Verify email settings in `.env`:
   ```
   EMAIL_SERVER_HOST=smtp.gmail.com
   EMAIL_SERVER_PORT=587
   EMAIL_SERVER_USER=nfbsalonboekingen@gmail.com
   EMAIL_SERVER_PASSWORD=your-app-password
   ```
2. Make sure 2FA is enabled on your Gmail account
3. Verify the app password is correct
4. Check Gmail's "Less secure app access" settings
5. Look for error messages in the server console
6. Try sending a test email with a different service

## Google Calendar Integration Issues

**Symptoms:**
- Bookings are saved but not appearing in Google Calendar
- "failed" status for calendar in the API response

**Solutions:**
1. Check the service account credentials in `.env`
2. Verify you have enabled the Google Calendar API
3. Confirm you've shared your calendar with the service account email:
   ```
   nfb-boekingen@nfb-salon-boekingen.iam.gserviceaccount.com
   ```
4. Check the scope in the calendar.ts file is correct:
   ```
   ['https://www.googleapis.com/auth/calendar']
   ```
5. Verify the `GOOGLE_CALENDAR_ID` is correct (usually your email)
6. Look for specific error messages in the server console

## Booking Form Validation Issues

**Symptoms:**
- Form submission fails with validation errors
- Form submission hangs or doesn't complete

**Solutions:**
1. Check the browser console for JavaScript errors
2. Verify all required fields are filled in
3. Check the format of fields like email and phone
4. Check the Zod validation schema in `actions/booking.ts`
5. Try with a different browser to rule out cache/cookie issues

## Double Booking Not Being Prevented

**Symptoms:**
- System allows two bookings for the same time slot

**Solutions:**
1. Check the `isTimeSlotAvailable` function in `lib/db.ts`
2. Verify the query is checking for the correct date and time
3. Check if time formats are consistent (24-hour vs 12-hour)
4. Add logging to the function to debug the query results
5. Verify bookings are being saved with the correct date/time format

## API Error Responses

Common error status codes and meanings:

- **400**: Missing required fields or invalid data
- **409**: Time slot already booked (conflict)
- **500**: Server error (check server logs)

For a 500 error, check the server console for the underlying error message which will provide more specific information.

## Manually Testing API Endpoints

You can test the API endpoints directly using curl or Postman:

**Check Available Time Slots:**
```bash
curl "http://localhost:3000/api/bookings?date=2023-12-31"
```

**Create a Booking:**
```bash
curl -X POST "http://localhost:3000/api/bookings" \
  -H "Content-Type: application/json" \
  -d '{
    "service": "Gezichtsbehandelingen",
    "treatment": "Basis Gezichtsbehandeling",
    "date": "2023-12-31",
    "time": "10:00",
    "price": 50,
    "duration": 60,
    "customer": {
      "firstName": "Test",
      "lastName": "Klant",
      "email": "test@example.com",
      "phone": "0612345678",
      "notes": "Test boeking"
    }
  }'
```

## Getting Additional Help

If you're still experiencing issues after following this guide:

1. Check the Next.js documentation: https://nextjs.org/docs
2. Check the MongoDB documentation: https://docs.mongodb.com/
3. Check the Google Calendar API documentation: https://developers.google.com/calendar
4. Search for specific error messages online
5. Contact a developer for further assistance 