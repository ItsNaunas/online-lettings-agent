// Google Apps Script for Quotation Form Processing
// This script handles form submissions from the quotation tool
// and sends email notifications with CSV data to the business

// Configuration
const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE'; // Replace with your Google Sheet ID
const BUSINESS_EMAIL = 'hello@onlinelettingagents.co.uk'; // Replace with your business email
const SHEET_NAME = 'Quotation Submissions';

// Handle CORS preflight requests
function doOptions(e) {
  return ContentService
    .createTextOutput('')
    .setMimeType(ContentService.MimeType.TEXT)
    .setHeaders({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '3600'
    });
}

function doPost(e) {
  try {
    // Parse the incoming form data (URL-encoded)
    let formData = {};
    
    if (e.postData && e.postData.contents) {
      // Parse URL-encoded form data
      const params = e.postData.contents.split('&');
      params.forEach(param => {
        const [key, value] = param.split('=');
        if (key && value !== undefined) {
          // Decode URL-encoded values
          formData[decodeURIComponent(key)] = decodeURIComponent(value);
        }
      });
    }
    
    // Add timestamp if not present
    if (!formData.submissionDate) {
      formData.submissionDate = new Date().toISOString();
    }
    
    // Log the submission
    console.log('Received quotation submission:', formData);
    
    // Add data to Google Sheet
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
    if (!sheet) {
      throw new Error('Sheet not found: ' + SHEET_NAME);
    }
    
    // Prepare row data
    const rowData = [
      formData.submissionDate,
      formData.clientName,
      formData.companyNumber,
      formData.email,
      formData.phone,
      formData.contactAddress,
      formData.howHeard,
      formData.propertyAddress,
      formData.propertyType,
      formData.bedrooms,
      formData.bathrooms,
      formData.yearBuilt,
      formData.currentlyOccupied,
      formData.hasLicence,
      formData.lettingType,
      formData.gasAppliances,
      formData.hasEPC,
      formData.hasEICR,
      formData.needsLicenceCheck,
      formData.package,
      formData.addons,
      formData.monthlyRent,
      formData.moveInDate,
      formData.tenantType,
      formData.specialRequirements,
      formData.visitDate,
      formData.contactMethod,
      formData.consent ? 'Yes' : 'No'
    ];
    
    // Add header row if sheet is empty
    if (sheet.getLastRow() === 0) {
      const headers = [
        'Submission Date',
        'Client Name',
        'Company Number',
        'Email',
        'Phone',
        'Contact Address',
        'How Heard',
        'Property Address',
        'Property Type',
        'Bedrooms',
        'Bathrooms',
        'Year Built',
        'Currently Occupied',
        'Has Licence',
        'Letting Type',
        'Gas Appliances',
        'Has EPC',
        'Has EICR',
        'Needs Licence Check',
        'Selected Package',
        'Selected Add-ons',
        'Monthly Rent',
        'Move-in Date',
        'Tenant Type',
        'Special Requirements',
        'Visit Date',
        'Contact Method',
        'Consent Given'
      ];
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    }
    
    // Add the new row
    sheet.appendRow(rowData);
    
    // Send email notification with CSV attachment
    sendEmailNotification(formData);
    
    // Return success response with CORS headers
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success', message: 'Quotation submitted successfully' }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      });
      
  } catch (error) {
    console.error('Error processing quotation submission:', error);
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      });
  }
}

function sendEmailNotification(formData) {
  try {
    // Create CSV content
    const csvContent = createCSVContent(formData);
    
    // Create email subject and body
    const subject = `New Quotation Request - ${formData.clientName}`;
    const body = createEmailBody(formData);
    
    // Create the email with CSV attachment
    const email = {
      to: BUSINESS_EMAIL,
      subject: subject,
      body: body,
      attachments: [{
        fileName: `quotation_${formData.clientName.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`,
        content: csvContent,
        mimeType: 'text/csv'
      }]
    };
    
    // Send the email
    GmailApp.sendEmail(email.to, email.subject, email.body, {
      attachments: email.attachments
    });
    
    console.log('Email notification sent successfully');
    
  } catch (error) {
    console.error('Error sending email notification:', error);
  }
}

function createCSVContent(formData) {
  // Create CSV header
  const headers = [
    'Field',
    'Value'
  ];
  
  // Create CSV rows
  const rows = [
    ['Submission Date', formData.submissionDate],
    ['Client Name', formData.clientName],
    ['Company Number', formData.companyNumber],
    ['Email', formData.email],
    ['Phone', formData.phone],
    ['Contact Address', formData.contactAddress],
    ['How Heard', formData.howHeard],
    ['Property Address', formData.propertyAddress],
    ['Property Type', formData.propertyType],
    ['Bedrooms', formData.bedrooms],
    ['Bathrooms', formData.bathrooms],
    ['Year Built', formData.yearBuilt],
    ['Currently Occupied', formData.currentlyOccupied],
    ['Has Licence', formData.hasLicence],
    ['Letting Type', formData.lettingType],
    ['Gas Appliances', formData.gasAppliances],
    ['Has EPC', formData.hasEPC],
    ['Has EICR', formData.hasEICR],
    ['Needs Licence Check', formData.needsLicenceCheck],
    ['Selected Package', formData.package],
    ['Selected Add-ons', formData.addons],
    ['Monthly Rent', formData.monthlyRent],
    ['Move-in Date', formData.moveInDate],
    ['Tenant Type', formData.tenantType],
    ['Special Requirements', formData.specialRequirements],
    ['Visit Date', formData.visitDate],
    ['Contact Method', formData.contactMethod],
    ['Consent Given', formData.consent ? 'Yes' : 'No']
  ];
  
  // Convert to CSV format
  const csvRows = [headers, ...rows];
  return csvRows.map(row => 
    row.map(field => 
      typeof field === 'string' && field.includes(',') ? `"${field}"` : field
    ).join(',')
  ).join('\n');
}

function createEmailBody(formData) {
  return `
New Quotation Request Received

Client Details:
- Name: ${formData.clientName}
- Email: ${formData.email}
- Phone: ${formData.phone}
- Company Number: ${formData.companyNumber || 'N/A'}

Property Details:
- Address: ${formData.propertyAddress}
- Type: ${formData.propertyType}
- Bedrooms: ${formData.bedrooms}
- Bathrooms: ${formData.bathrooms}
- Year Built: ${formData.yearBuilt || 'N/A'}

Service Package:
- Selected Package: ${formData.package}
- Add-ons: ${formData.addons || 'None'}

Additional Information:
- Monthly Rent: ${formData.monthlyRent ? '£' + formData.monthlyRent : 'N/A'}
- Move-in Date: ${formData.moveInDate || 'N/A'}
- Preferred Contact Method: ${formData.contactMethod}
- Visit Date: ${formData.visitDate || 'N/A'}

Special Requirements:
${formData.specialRequirements || 'None'}

This quotation request has been automatically logged in your Google Sheet and a CSV file is attached to this email.

Please follow up with the client within 24 hours.

Best regards,
Your Quotation System
  `.trim();
}

// Function to set up the Google Sheet with proper headers
function setupSheet() {
  try {
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
    if (!sheet) {
      throw new Error('Sheet not found: ' + SHEET_NAME);
    }
    
    // Clear existing content
    sheet.clear();
    
    // Add headers
    const headers = [
      'Submission Date',
      'Client Name',
      'Company Number',
      'Email',
      'Phone',
      'Contact Address',
      'How Heard',
      'Property Address',
      'Property Type',
      'Bedrooms',
      'Bathrooms',
      'Year Built',
      'Currently Occupied',
      'Has Licence',
      'Letting Type',
      'Gas Appliances',
      'Has EPC',
      'Has EICR',
      'Needs Licence Check',
      'Selected Package',
      'Selected Add-ons',
      'Monthly Rent',
      'Move-in Date',
      'Tenant Type',
      'Special Requirements',
      'Visit Date',
      'Contact Method',
      'Consent Given'
    ];
    
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    
    // Format header row
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold').setBackground('#f0f0f0');
    
    console.log('Sheet setup completed successfully');
    
  } catch (error) {
    console.error('Error setting up sheet:', error);
  }
}