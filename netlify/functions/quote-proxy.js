// Node 18+ includes global fetch, no need for node-fetch

// The Google Apps Script URL
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx-4wLvdbsYBQiKAcSAcfLfT-DzmJGoOFxUdETrtIprb09b0FXDcGQfqFfyy9IkUqzF/exec';

// CORS headers to be included in all responses
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

exports.handler = async (event, context) => {
  // Handle OPTIONS preflight request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: corsHeaders,
      body: '',
    };
  }

  // Handle POST request
  if (event.httpMethod === 'POST') {
    try {
      // Parse the JSON body from the frontend
      const jsonData = JSON.parse(event.body);

      // Re-stringify the JSON to ensure it's well-formed for Apps Script
      const jsonBody = JSON.stringify(jsonData);

      // Forward the request to Google Apps Script as JSON
      const response = await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: jsonBody,
      });

      // Get the response text/json from Apps Script
      const responseText = await response.text();

      // Check if response is HTML (indicating an error from Google Apps Script)
      if (responseText.trim().startsWith('<!DOCTYPE html>') || responseText.trim().startsWith('<html')) {
        console.error('Google Apps Script returned HTML error page instead of JSON');
        console.error('Response text:', responseText);
        
        // Extract error message from HTML if possible
        const errorMatch = responseText.match(/<div[^>]*>([^<]*(?:error|Error|ERROR)[^<]*)</i);
        const errorMessage = errorMatch ? errorMatch[1] : 'Google Apps Script error';
        
        return {
          statusCode: 500,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            result: 'error',
            message: 'Service temporarily unavailable',
          }),
        };
      }

      // Try to parse as JSON, fallback to text if it fails
      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Response is not JSON, but also not HTML error. Parse error:', parseError.message);
        responseData = {
          result: 'error',
          message: 'Service temporarily unavailable',
        };
      }

      // Return the response with CORS headers
      return {
        statusCode: response.status,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        body: typeof responseData === 'string' ? responseData : JSON.stringify(responseData),
      };

    } catch (error) {
      console.error('Error proxying to Apps Script:', error);
      
      return {
        statusCode: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          result: 'error',
          message: 'Service temporarily unavailable',
        }),
      };
    }
  }

  // Method not allowed for other HTTP methods
  return {
    statusCode: 405,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      result: 'error',
      message: 'Method not allowed',
    }),
  };
};
