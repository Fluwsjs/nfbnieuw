# NFB Salon Booking System - Testing Flow

This document helps you test the complete booking flow to ensure all components are working correctly.

## Prerequisites

1. Make sure the application is running (`npm run dev`)
2. Verify your `.env` file is configured with:
   - MongoDB connection string
   - Gmail SMTP settings
   - Google Calendar credentials
   - Your Calendar ID
   - Your Salon information

## Step 1: Check Server Connection

1. Open your browser and navigate to `http://localhost:3000/afspraak`
2. Verify the page loads correctly
3. Check the console for any errors (F12 -> Console)

## Step 2: Test Service Selection

1. On the booking page, select a service category (e.g., "Gezichtsbehandelingen")
2. Verify that the treatment options appear for that service
3. Select a specific treatment
4. Verify that the price and duration information appears correctly

## Step 3: Test Date and Time Selection

1. Select a date on the calendar
2. Verify that the available time slots appear
3. Select a time slot
4. Verify the "Next Step" button is enabled

## Step 4: Test Customer Information Form

1. Fill in the customer details:
   - First name: `Test`
   - Last name: `Klant`
   - Email: `your-actual-email@gmail.com` (use your email to receive the confirmation)
   - Phone: `0612345678`
   - Optional notes: `This is a test booking`
2. Verify form validation works (try submitting with missing fields)
3. Complete all required fields and proceed

## Step 5: Test Booking Confirmation

1. Review the booking summary
2. Verify all information is correct:
   - Service name
   - Treatment name
   - Date and time
   - Price
   - Customer details
3. Click "Bevestig Afspraak" to complete the booking

## Step 6: Test Successful Booking

1. Verify you see a success message after booking
2. Note the booking ID for reference

## Step 7: Verify Email Delivery

1. Check your email inbox for:
   - Customer confirmation email (sent to the email you entered)
   - Owner notification email (sent to the OWNER_EMAIL in .env)
2. Verify the emails contain the correct booking details
3. Check spam folder if emails aren't in the inbox

## Step 8: Verify Google Calendar Integration

1. Go to Google Calendar: `https://calendar.google.com/`
2. Check if a new appointment was added with:
   - Correct title (service and treatment)
   - Correct date and time
   - Correct duration
   - Customer details in the description

## Step 9: Test Double Booking Prevention

1. Try to make another booking with the same date and time
2. Verify that the system prevents double booking by:
   - Either showing the time slot as unavailable in Step 3
   - Or showing an error when trying to confirm the booking

## Step 10: Verify Database Storage

If you have MongoDB Atlas access:
1. Login to MongoDB Atlas
2. Navigate to your database
3. Check the `appointments` collection
4. Verify the booking was stored with all information

## Troubleshooting

If any step fails, check the following:

1. **Server Errors**: Check the terminal where your server is running for error messages
2. **Email Issues**: 
   - Verify SMTP settings
   - Check if your app password is correct
   - Check spam/junk folders
3. **Calendar Issues**:
   - Verify you've shared your calendar with the service account email
   - Check calendar permissions
4. **Database Issues**:
   - Verify your MongoDB connection string
   - Check network connectivity to MongoDB

Once you've completed all steps successfully, your booking system is working correctly! 