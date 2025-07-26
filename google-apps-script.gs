// Google Apps Script for Quotation Form Processing
// This script handles form submissions from the quotation tool
// and sends email notifications with CSV data to the business

function doPost(e) {
  // Handle CORS preflight and missing data
  if (!e.postData || !e.postData.contents) {
    const output = ContentService.createTextOutput(JSON.stringify({ 
      result: "error", 
      message: "No data received" 
    }));
    output.setMimeType(ContentService.MimeType.JSON);
    output.setHeader("Access-Control-Allow-Origin", "https://clever-bublanina-1af2bc.netlify.app");
    output.setHeader("Access-Control-Allow-Methods", "POST");
    output.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return output;
  }

  const BUSINESS_EMAIL = "its.naunas@gmail.com";
  const SHEET_ID = "1SjPuWUVLBJlMKRicvHpdCHV2ELKaDduwKCmHQymNQw";
  const SHEET_NAME = "Quotation Submissions";

  try {
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
    const data = JSON.parse(e.postData.contents);

    const row = [
      new Date(),                     // Timestamp
      data.clientName || "",
      data.email || "",
      data.phone || "",
      data.contactAddress || "",
      data.servicePackage || "",
      data.preferredDate || "",
      data.preferredTime || ""
    ];

    sheet.appendRow(row);

    const csvData = row.map(item => `"${item}"`).join(",") + "\n";
    const blob = Utilities.newBlob(csvData, "text/csv", "quotation-submission.csv");

    MailApp.sendEmail({
      to: BUSINESS_EMAIL,
      subject: "New Quotation Submission",
      body: "A new client has submitted a quotation form. The CSV is attached.",
      attachments: [blob]
    });

    const successOutput = ContentService.createTextOutput(JSON.stringify({ result: "success" }));
    successOutput.setMimeType(ContentService.MimeType.JSON);
    successOutput.setHeader("Access-Control-Allow-Origin", "https://clever-bublanina-1af2bc.netlify.app");
    successOutput.setHeader("Access-Control-Allow-Methods", "POST");
    successOutput.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return successOutput;

  } catch (error) {
    const errorOutput = ContentService.createTextOutput(JSON.stringify({ 
      result: "error", 
      message: error.message 
    }));
    errorOutput.setMimeType(ContentService.MimeType.JSON);
    errorOutput.setHeader("Access-Control-Allow-Origin", "https://clever-bublanina-1af2bc.netlify.app");
    errorOutput.setHeader("Access-Control-Allow-Methods", "POST");
    errorOutput.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return errorOutput;
  }
}

// Handle CORS preflight request from browsers
function doOptions(e) {
  const output = ContentService.createTextOutput("");
  output.setMimeType(ContentService.MimeType.TEXT);
  output.setHeader("Access-Control-Allow-Origin", "https://clever-bublanina-1af2bc.netlify.app");
  output.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  output.setHeader("Access-Control-Allow-Headers", "Content-Type");
  return output;
}

// Handle GET requests (for testing and status check)
function doGet(e) {
  const output = ContentService.createTextOutput(JSON.stringify({ 
    status: 'success', 
    message: 'Quotation API v3 is running',
    timestamp: new Date().toISOString()
  }));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}