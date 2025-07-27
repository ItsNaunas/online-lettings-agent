// Google Apps Script for Calendar Booking and Email Automation
// This script handles booking appointments and sends confirmation emails to clients

function doPost(e) {
  try {
    // Parse the incoming JSON data
    const jsonData = JSON.parse(e.postData.contents);
    console.log('Received booking data:', jsonData);
    
    if (jsonData.mode === 'book') {
      return handleBooking(jsonData);
    } else if (jsonData.mode === 'freebusy') {
      return handleFreeBusy(jsonData);
    } else {
      throw new Error('Invalid mode specified');
    }
    
  } catch (error) {
    console.error('Error in doPost:', error);
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.message
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  try {
    // Handle GET requests for free/busy data
    const calendarId = e.parameter.calendarId;
    const timeMin = e.parameter.timeMin;
    const timeMax = e.parameter.timeMax;
    
    if (!calendarId || !timeMin || !timeMax) {
      throw new Error('Missing required parameters: calendarId, timeMin, timeMax');
    }
    
    return handleFreeBusy({
      calendarId: calendarId,
      timeMin: timeMin,
      timeMax: timeMax
    });
    
  } catch (error) {
    console.error('Error in doGet:', error);
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.message
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function handleBooking(bookingData) {
  const CALENDAR_ID = 'd47e20bb8dbfedff38f004feacb903d4b5eacc160b6ae51fcdfb17f11da4a80f@group.calendar.google.com';
  const BUSINESS_EMAIL = 'its.naunas@gmail.com';
  
  try {
    // Create calendar event
    const startTime = new Date(bookingData.start);
    const endTime = new Date(bookingData.end);
    
    const event = {
      'summary': `${bookingData.type} - ${bookingData.name}`,
      'description': `Client: ${bookingData.name}\nEmail: ${bookingData.email}\nPhone: ${bookingData.phone}\n\nNotes: ${bookingData.notes || 'No additional notes'}`,
      'start': {
        'dateTime': startTime.toISOString(),
        'timeZone': 'Europe/London'
      },
      'end': {
        'dateTime': endTime.toISOString(),
        'timeZone': 'Europe/London'
      },
      'attendees': [
        {'email': bookingData.email},
        {'email': BUSINESS_EMAIL}
      ],
      'reminders': {
        'useDefault': false,
        'overrides': [
          {'method': 'email', 'minutes': 60},
          {'method': 'popup', 'minutes': 15}
        ]
      }
    };
    
    // Create the event
    const calendar = CalendarApp.getCalendarById(CALENDAR_ID);
    const calendarEvent = calendar.createEvent(
      event.summary,
      startTime,
      endTime,
      {
        description: event.description,
        guests: `${bookingData.email},${BUSINESS_EMAIL}`,
        sendInvites: false // We'll send our own confirmation email
      }
    );
    
    // Send confirmation email to client
    sendClientConfirmationEmail(bookingData, calendarEvent);
    
    // Send notification to business
    sendBusinessNotificationEmail(bookingData, calendarEvent);
    
    // Return success response
    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      message: 'Booking created successfully',
      eventId: calendarEvent.getId(),
      eventLink: calendarEvent.getUrl()
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    console.error('Error creating booking:', error);
    throw new Error(`Failed to create booking: ${error.message}`);
  }
}

function sendClientConfirmationEmail(bookingData, calendarEvent) {
  const startTime = new Date(bookingData.start);
  const endTime = new Date(bookingData.end);
  
  const formatDate = (date) => {
    return date.toLocaleDateString('en-GB', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  const formatTime = (date) => {
    return date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };
  
  const subject = `Booking Confirmation - ${bookingData.type} on ${formatDate(startTime)}`;
  
  const htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
      <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2c3e50; margin: 0; font-size: 28px;">Booking Confirmed!</h1>
          <div style="width: 50px; height: 3px; background-color: #3498db; margin: 15px auto;"></div>
        </div>
        
        <p style="color: #34495e; font-size: 16px; line-height: 1.6;">Dear <strong>${bookingData.name}</strong>,</p>
        
        <p style="color: #34495e; font-size: 16px; line-height: 1.6;">
          Thank you for booking with Online Letting Agents. Your <strong>${bookingData.type.toLowerCase()}</strong> has been confirmed with the following details:
        </p>
        
        <div style="background-color: #ecf0f1; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #2c3e50; margin-top: 0; font-size: 18px;">Appointment Details</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #7f8c8d; font-weight: bold;">Type:</td>
              <td style="padding: 8px 0; color: #2c3e50;">${bookingData.type}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #7f8c8d; font-weight: bold;">Date:</td>
              <td style="padding: 8px 0; color: #2c3e50;">${formatDate(startTime)}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #7f8c8d; font-weight: bold;">Time:</td>
              <td style="padding: 8px 0; color: #2c3e50;">${formatTime(startTime)} - ${formatTime(endTime)}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #7f8c8d; font-weight: bold;">Duration:</td>
              <td style="padding: 8px 0; color: #2c3e50;">30 minutes</td>
            </tr>
            ${bookingData.notes ? `
            <tr>
              <td style="padding: 8px 0; color: #7f8c8d; font-weight: bold; vertical-align: top;">Notes:</td>
              <td style="padding: 8px 0; color: #2c3e50;">${bookingData.notes}</td>
            </tr>
            ` : ''}
          </table>
        </div>
        
        <div style="background-color: #e8f4fd; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3498db;">
          <h3 style="color: #2c3e50; margin-top: 0; font-size: 16px;">What to Expect</h3>
          <p style="color: #34495e; margin: 0; font-size: 14px;">
            ${bookingData.type === 'Property Viewing' 
              ? 'Our expert team will meet you at the property to discuss your requirements and answer any questions you may have about our letting services.'
              : 'We will call you at the scheduled time on the phone number you provided to discuss your property letting requirements.'
            }
          </p>
        </div>
        
        <div style="background-color: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
          <p style="color: #856404; margin: 0; font-size: 14px;">
            <strong>Need to reschedule?</strong> Please contact us at least 24 hours in advance at <a href="mailto:its.naunas@gmail.com" style="color: #856404;">its.naunas@gmail.com</a> or call us at 01234 567890.
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ecf0f1;">
          <p style="color: #7f8c8d; font-size: 14px; margin: 0;">
            Looking forward to meeting with you!<br>
            <strong>Online Letting Agents Team</strong>
          </p>
          <div style="margin-top: 15px;">
            <p style="color: #7f8c8d; font-size: 12px; margin: 5px 0;">
              📧 its.naunas@gmail.com | 📞 01234 567890
            </p>
            <p style="color: #7f8c8d; font-size: 12px; margin: 5px 0;">
              🌐 onlinelettingagents.co.uk
            </p>
          </div>
        </div>
      </div>
    </div>
  `;
  
  const plainTextBody = `
Booking Confirmation - ${bookingData.type}

Dear ${bookingData.name},

Thank you for booking with Online Letting Agents. Your ${bookingData.type.toLowerCase()} has been confirmed with the following details:

Appointment Details:
- Type: ${bookingData.type}
- Date: ${formatDate(startTime)}
- Time: ${formatTime(startTime)} - ${formatTime(endTime)}
- Duration: 30 minutes
${bookingData.notes ? `- Notes: ${bookingData.notes}` : ''}

${bookingData.type === 'Property Viewing' 
  ? 'Our expert team will meet you at the property to discuss your requirements and answer any questions you may have about our letting services.'
  : 'We will call you at the scheduled time on the phone number you provided to discuss your property letting requirements.'
}

Need to reschedule? Please contact us at least 24 hours in advance at its.naunas@gmail.com or call us at 01234 567890.

Looking forward to meeting with you!

Online Letting Agents Team
Email: its.naunas@gmail.com
Phone: 01234 567890
Website: onlinelettingagents.co.uk
  `;
  
  MailApp.sendEmail({
    to: bookingData.email,
    subject: subject,
    body: plainTextBody,
    htmlBody: htmlBody
  });
}

function sendBusinessNotificationEmail(bookingData, calendarEvent) {
  const BUSINESS_EMAIL = 'its.naunas@gmail.com';
  const startTime = new Date(bookingData.start);
  
  const formatDate = (date) => {
    return date.toLocaleDateString('en-GB', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  const formatTime = (date) => {
    return date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };
  
  const subject = `New Booking: ${bookingData.type} - ${bookingData.name}`;
  
  const htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #2c3e50;">New Booking Received</h2>
      
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #2c3e50; margin-top: 0;">Client Information</h3>
        <p><strong>Name:</strong> ${bookingData.name}</p>
        <p><strong>Email:</strong> ${bookingData.email}</p>
        <p><strong>Phone:</strong> ${bookingData.phone}</p>
      </div>
      
      <div style="background-color: #e8f4fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #2c3e50; margin-top: 0;">Appointment Details</h3>
        <p><strong>Type:</strong> ${bookingData.type}</p>
        <p><strong>Date:</strong> ${formatDate(startTime)}</p>
        <p><strong>Time:</strong> ${formatTime(startTime)}</p>
        ${bookingData.notes ? `<p><strong>Notes:</strong> ${bookingData.notes}</p>` : ''}
      </div>
      
      <p><a href="${calendarEvent.getUrl()}" style="display: inline-block; background-color: #3498db; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View in Calendar</a></p>
      
      <p style="color: #7f8c8d; font-size: 14px;">A confirmation email has been automatically sent to the client.</p>
    </div>
  `;
  
  MailApp.sendEmail({
    to: BUSINESS_EMAIL,
    subject: subject,
    body: `New Booking: ${bookingData.type}\n\nClient: ${bookingData.name}\nEmail: ${bookingData.email}\nPhone: ${bookingData.phone}\nDate: ${formatDate(startTime)}\nTime: ${formatTime(startTime)}\n\nView in Calendar: ${calendarEvent.getUrl()}`,
    htmlBody: htmlBody
  });
}

function handleFreeBusy(data) {
  try {
    const calendarId = data.calendarId || 'd47e20bb8dbfedff38f004feacb903d4b5eacc160b6ae51fcdfb17f11da4a80f@group.calendar.google.com';
    const timeMin = new Date(data.timeMin);
    const timeMax = new Date(data.timeMax);
    
    const calendar = CalendarApp.getCalendarById(calendarId);
    const events = calendar.getEvents(timeMin, timeMax);
    
    const busyTimes = events.map(event => ({
      start: event.getStartTime().toISOString(),
      end: event.getEndTime().toISOString()
    }));
    
    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      busy: busyTimes
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    console.error('Error getting free/busy data:', error);
    throw new Error(`Failed to get calendar data: ${error.message}`);
  }
}