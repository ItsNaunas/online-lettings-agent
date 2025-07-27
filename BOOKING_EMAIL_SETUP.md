# Booking Email Automation Setup Guide

This guide will help you set up automatic email confirmations for bookings made through your Online Letting Agents website.

## Overview

When a client makes a booking (either for a property viewing or phone call), the system will now:
1. Create a calendar event in your Google Calendar
2. Send a professional confirmation email to the client with all booking details
3. Send a notification email to you (the business) about the new booking
4. Include proper formatting, branding, and helpful information for both parties

## Setup Instructions

### Step 1: Deploy the New Google Apps Script

1. **Open Google Apps Script Console**
   - Go to [script.google.com](https://script.google.com)
   - Sign in with your Google account (the same one that owns the calendar)

2. **Create a New Project**
   - Click "New Project"
   - Name it "Online Letting Agents - Calendar Booking"

3. **Add the Script Code**
   - Delete the default `myFunction()` code
   - Copy the entire contents of `google-calendar-script.gs` from your project
   - Paste it into the script editor

4. **Enable Required APIs**
   - In the Apps Script editor, click on "Services" in the left sidebar
   - Add "Google Calendar API" if it's not already enabled
   - Add "Gmail API" if it's not already enabled

5. **Configure Permissions**
   - Click "Run" on any function to trigger the authorization flow
   - Grant all requested permissions (Calendar access, Gmail sending, etc.)

6. **Deploy as Web App**
   - Click "Deploy" > "New Deployment"
   - Choose "Web app" as the type
   - Set execute as: "Me"
   - Set access: "Anyone" (this allows your website to call it)
   - Click "Deploy"
   - **IMPORTANT**: Copy the deployment URL - you'll need this in Step 2

### Step 2: Update Your Calendar Proxy

1. **Open `netlify/functions/calendar-proxy.js`**
2. **Replace the CAL_SCRIPT_URL** on line 4 with your new deployment URL:
   ```javascript
   const CAL_SCRIPT_URL = 'YOUR_NEW_GOOGLE_APPS_SCRIPT_URL_HERE';
   ```

### Step 3: Verify Calendar ID

1. **Check the Calendar ID** in `google-calendar-script.gs`
2. **Ensure it matches** the calendar ID in your `script.js` file:
   ```javascript
   const CALENDAR_ID = 'd47e20bb8dbfedff38f004feacb903d4b5eacc160b6ae51fcdfb17f11da4a80f@group.calendar.google.com';
   ```

### Step 4: Customize Email Settings (Optional)

In `google-calendar-script.gs`, you can customize:

1. **Business Email** (line 51):
   ```javascript
   const BUSINESS_EMAIL = 'your-business-email@domain.com';
   ```

2. **Email Templates**: Modify the HTML and text in the `sendClientConfirmationEmail` function to match your branding

3. **Time Zone**: Change from 'Europe/London' to your preferred timezone

### Step 5: Test the System

1. **Deploy your updated code** to Netlify
2. **Make a test booking** on your website
3. **Verify**:
   - Calendar event is created
   - Client receives confirmation email
   - You receive notification email
   - All information is accurate

## Email Features

### Client Confirmation Email Includes:
- Professional branded design
- Complete booking details (date, time, type, notes)
- What to expect section
- Rescheduling instructions
- Your contact information
- Both HTML and plain text versions

### Business Notification Email Includes:
- Client contact information
- Booking details
- Direct link to calendar event
- Confirmation that client email was sent

## Troubleshooting

### Common Issues:

1. **Emails not sending**
   - Check Google Apps Script execution log
   - Verify Gmail API is enabled
   - Ensure proper permissions are granted

2. **Calendar events not created**
   - Verify Calendar API is enabled
   - Check that calendar ID is correct
   - Ensure the Google account has access to the calendar

3. **Proxy errors**
   - Verify the Google Apps Script URL is correct
   - Check that the script is deployed as a web app
   - Ensure access is set to "Anyone"

### Testing Individual Components:

You can test the Google Apps Script directly by:
1. Opening the script editor
2. Setting test data in the `handleBooking` function
3. Running the function manually

## Security Notes

- The Google Apps Script runs under your Google account permissions
- Only booking data is sent to the script (no sensitive information)
- All emails are sent through Google's secure infrastructure
- The script URL should be kept private (though it only accepts valid booking data)

## Customization Options

### Email Styling
- Modify CSS styles in the `htmlBody` template
- Add your company logo by hosting an image and including it in the email
- Adjust colors to match your brand

### Email Content
- Add or remove fields from the booking details table
- Customize the "What to Expect" section
- Modify contact information and rescheduling policies

### Calendar Integration
- Add custom event properties
- Set different reminder times
- Include additional attendees automatically

## Support

If you encounter issues:
1. Check the Google Apps Script execution log
2. Review the Netlify function logs
3. Test with the browser developer console open
4. Verify all URLs and IDs are correct

The system is designed to gracefully handle errors and provide meaningful feedback for troubleshooting.