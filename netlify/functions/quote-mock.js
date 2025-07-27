// Mock endpoint for testing quotation form submissions
// This serves as a fallback when the Google Apps Script is having issues

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

      // Simulate some processing time
      await new Promise(resolve => setTimeout(resolve, 500));

      // Return a successful mock response
      return {
        statusCode: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          result: 'success',
          message: 'Quotation submitted successfully',
        }),
      };

    } catch (error) {
      console.error('Mock endpoint - Error processing request:', error);
      
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
