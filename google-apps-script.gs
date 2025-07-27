// Simplified Google Apps Script for Quotation Form Processing
// Version 5 - Handles form data, no CORS headers needed (handled by Netlify proxy)

function doPost(e) {
  const BUSINESS_EMAIL = "its.naunas@gmail.com";
  const SHEET_ID = "1SjPuWUVLBJlMKRicvHpdCHV2ELKaDduwKCmHQymNQw";
  const SHEET_NAME = "Quotation Submissions";

  try {
    // Handle form data from Netlify proxy
    const formData = e.parameter;
    
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);

    const row = [
      new Date(),                          // Timestamp
      formData.clientName || "",
      formData.email || "",
      formData.phone || "",
      formData.contactAddress || "",
      formData.servicePackage || "",
      formData.propertyType || "",
      formData.propertyAddress || "",
      formData.propertySize || "",
      formData.currentCondition || "",
      formData.renovationScope || "",
      formData.budget || "",
      formData.timeline || "",
      formData.specialRequirements || "",
      formData.visitDate || "",
      formData.preferredTime || "",
      formData.contactMethod || "",
      formData.consent || ""
    ];

    sheet.appendRow(row);

    // Create CSV for email attachment
    const csvData = row.map(item => `"${String(item).replace(/"/g, '""')}"`).join(",") + "\n";
    const blob = Utilities.newBlob(csvData, "text/csv", "quotation-submission.csv");

    // Send email with CSV attachment
    MailApp.sendEmail({
      to: BUSINESS_EMAIL,
      subject: "New Quotation Submission",
      body: `A new client has submitted a quotation form.\n\nClient Name: ${formData.clientName}\nEmail: ${formData.email}\nPhone: ${formData.phone}\n\nThe full details are in the attached CSV file.`,
      attachments: [blob]
    });

    // Return success response as JSON
    return ContentService.createTextOutput(JSON.stringify({ 
      result: "success",
      message: "Quotation submitted successfully" 
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    console.error('Error processing form:', error);
    
    // Return error response as JSON
    return ContentService.createTextOutput(JSON.stringify({ 
      result: "error", 
      message: "Service temporarily unavailable" 
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
