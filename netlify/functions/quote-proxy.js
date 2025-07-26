const fetch = require('node-fetch');

// The Google Apps Script URL
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx-4wLvdbsYBQiKAcSAcfLfT-DzmJGoOFxUdETrtIprb09b0FXDcGQfqFfyy9IkUqzF/exec';

// CORS headers to be included in all responses
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

exports.handler = async (event, context) => {
  console.log('Request method:', event.httpMethod);
  console.log('Request headers:', event.headers);
  console.log('Request body:', event.body);

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
      console.log('Parsed JSON data:', jsonData);

      // Re-stringify the JSON to ensure it's well-formed for Apps Script
      const jsonBody = JSON.stringify(jsonData);
      console.log('Re-stringified JSON body:', jsonBody);

      // Forward the request to Google Apps Script as JSON
      const response = await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: jsonBody,
      });

      console.log('Apps Script response status:', response.status);
      console.log('Apps Script response headers:', Object.fromEntries(response.headers.entries()));

      // Get the response text/json from Apps Script
      const responseText = await response.text();
      console.log('Apps Script response body:', responseText);

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
        console.log('Response is not JSON, but also not HTML error. Returning as text');
        console.log('Parse error:', parseError.message);
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
      console.error('Error proxying to Apps Script:', error);
      
      return {
        statusCode: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'error',
          message: 'Failed to proxy request to Google Apps Script',
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