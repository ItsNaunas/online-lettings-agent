// Node 18+ includes global fetch, no need for node-fetch

// The Google Apps Script Calendar API URL
const CAL_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzRbJNYZM_OBTB6kAW28MYqZAoueRUqrYHITHrWwS2IvCXBv0seU-nOLMqOmdAqc6Q42A/exec';

// CORS headers to be included in all responses
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
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

  // Handle GET request (for free/busy data)
  if (event.httpMethod === 'GET') {
    try {
      // Forward the query parameters to the Apps Script
      const queryString = event.rawQuery || '';
      const scriptUrl = queryString ? `${CAL_SCRIPT_URL}?${queryString}` : CAL_SCRIPT_URL;

      const response = await fetch(scriptUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
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
            status: 'error',
            message: 'Google Apps Script configuration error',
            details: errorMessage,
            debug: 'The Google Apps Script is returning HTML instead of JSON. This indicates a deployment or configuration issue.',
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
          status: 'error',
          message: 'Invalid response format from Google Apps Script',
          details: responseText,
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
      console.error('Error proxying GET request to Apps Script:', error);
      
      return {
        statusCode: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'error',
          message: 'Failed to proxy GET request to Google Apps Script',
          error: error.message,
        }),
      };
    }
  }

  // Handle POST request (for booking events)
  if (event.httpMethod === 'POST') {
    try {
      // Parse the JSON body from the frontend
      const jsonData = JSON.parse(event.body);

      // Re-stringify the JSON to ensure it's well-formed for Apps Script
      const jsonBody = JSON.stringify(jsonData);

      // Forward the request to Google Apps Script as JSON
      const response = await fetch(CAL_SCRIPT_URL, {
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
            status: 'error',
            message: 'Google Apps Script configuration error',
            details: errorMessage,
            debug: 'The Google Apps Script is returning HTML instead of JSON. This indicates a deployment or configuration issue.',
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
          status: 'error',
          message: 'Invalid response format from Google Apps Script',
          details: responseText,
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
      console.error('Error proxying POST request to Apps Script:', error);
      
      return {
        statusCode: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'error',
          message: 'Failed to proxy POST request to Google Apps Script',
          error: error.message,
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
      status: 'error',
      message: 'Method not allowed',
    }),
  };
};