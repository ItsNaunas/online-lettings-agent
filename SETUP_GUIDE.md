# Google Sheets Integration Setup Guide

This guide will help you set up the Google Sheets integration for your quotation tool, which will automatically send email notifications with CSV attachments to your business.

## Prerequisites

1. A Google account
2. Access to Google Sheets
3. Access to Google Apps Script

## Step 1: Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Rename the first sheet to "Quotation Submissions"
4. Copy the Spreadsheet ID from the URL (it's the long string between /d/ and /edit)

## Step 2: Set up Google Apps Script

1. Go to [Google Apps Script](https://script.google.com)
2. Create a new project
3. Replace the default code with the contents of `google-apps-script.gs`
4. Update the configuration variables:
   - `SPREADSHEET_ID`: Your Google Sheet ID from Step 1
   - `BUSINESS_EMAIL`: Your business email address
   - `SHEET_NAME`: "Quotation Submissions" (or your preferred name)

## Step 3: Deploy the Apps Script

1. Click "Deploy" → "New deployment"
2. Choose "Web app" as the type
3. Set the following:
   - **Execute as**: Me
   - **Who has access**: Anyone
4. Click "Deploy"
5. Copy the Web App URL (you'll need this for the next step)

## Step 4: Update Your Website

1. Open `script.js` in your project
2. Find the Google Apps Script URL (around line 1696)
3. Replace it with your new Web App URL from Step 3

The current URL in your code is:
```javascript
await fetch('https://script.google.com/macros/s/AKfycbwAb5m_epLiIDJ6UCi-0ETiEYkhJCF63bjjamB3LnLQ2Y4vDewvwD35nxvU44IUDh8V/exec', {
```

Replace it with your new URL.

## Step 5: Test the Integration

1. Fill out the quotation form on your website
2. Submit the form
3. Check your Google Sheet - a new row should appear
4. Check your email - you should receive a notification with a CSV attachment

## Step 6: Set up Email Notifications

The system will automatically send emails to the address specified in `BUSINESS_EMAIL`. Make sure:

1. The email address is correct
2. Your Google account has permission to send emails
3. Check your spam folder if you don't receive emails

## Configuration Options

### Email Template Customization

You can customize the email template by modifying the `createEmailBody()` function in the Google Apps Script. The current template includes:

- Client details
- Property information
- Service package selection
- Additional requirements
- Contact preferences

### CSV Format

The CSV file includes all form fields in a key-value format:
- Field names in the first column
- Values in the second column
- Properly escaped for special characters

### Google Sheet Structure

The Google Sheet will have columns for:
- Submission Date
- Client Details (Name, Email, Phone, etc.)
- Property Details (Address, Type, Bedrooms, etc.)
- Service Package Selection
- Additional Requirements
- Contact Preferences
- Consent Status

## Troubleshooting

### Common Issues

1. **"Sheet not found" error**
   - Make sure the sheet name matches exactly
   - Check that the sheet exists in your Google Sheet

2. **Email not sending**
   - Verify the email address is correct
   - Check your spam folder
   - Ensure your Google account has email permissions

3. **Form submission fails**
   - Check the browser console for errors
   - Verify the Web App URL is correct
   - Ensure the Apps Script is deployed as a web app

4. **Data not appearing in Google Sheet**
   - Check the Apps Script logs for errors
   - Verify the Spreadsheet ID is correct
   - Ensure the sheet name matches exactly

### Debugging

1. **Check Apps Script logs**:
   - Go to your Apps Script project
   - Click "Executions" in the left sidebar
   - View the logs for any errors

2. **Test the Apps Script manually**:
   - In the Apps Script editor, run the `setupSheet()` function
   - This will create the headers in your Google Sheet

3. **Check browser console**:
   - Open browser developer tools
   - Look for any JavaScript errors when submitting the form

## Security Considerations

1. **Web App Access**: The web app is set to "Anyone" access. This is necessary for the form to work, but be aware that anyone with the URL can potentially trigger the script.

2. **Data Privacy**: All form data is stored in Google Sheets and sent via email. Ensure you comply with data protection regulations.

3. **Rate Limiting**: Google Apps Script has rate limits. If you expect high volume, consider implementing additional safeguards.

## Maintenance

### Regular Tasks

1. **Monitor Google Sheet**: Check regularly for new submissions
2. **Review Email Notifications**: Ensure emails are being received
3. **Backup Data**: Consider exporting Google Sheet data periodically
4. **Update Contact Information**: Keep business email address current

### Updates

To update the integration:

1. Modify the Google Apps Script code
2. Create a new deployment
3. Update the Web App URL in your website code
4. Test the changes

## Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review Google Apps Script documentation
3. Check Google Sheets API documentation
4. Contact your web developer for assistance

## Files Modified

- `script.js`: Updated to collect all form fields
- `google-apps-script.gs`: New file for Google Apps Script
- `SETUP_GUIDE.md`: This setup guide

The quotation tool will now:
1. Collect all form data from the multi-step quotation form
2. Send the data to Google Sheets for storage
3. Automatically email the business with a CSV attachment
4. Provide a comprehensive summary of the quotation request

This ensures that every quotation request is properly logged and the business is immediately notified with all the necessary information to follow up with potential clients.