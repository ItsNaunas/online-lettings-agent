# CORS and Google Apps Script Debugging Guide

## Problem Summary
Your quotation form was failing due to CORS preflight requests being blocked by Google Apps Script Web Apps, which don't support `doOptions()` handlers.

## Solution Implemented

### 1. Client-Side Changes (script.js)
- **Converted JSON to Form Data**: Changed from `JSON.stringify()` to `URLSearchParams`
- **Removed Custom Headers**: No `Content-Type` header (browser sets `application/x-www-form-urlencoded`)
- **Enhanced Error Handling**: Added specific error detection for different failure modes
- **Added Debug Logging**: Console logs for request/response details

### 2. Server-Side Changes (google-apps-script.gs)
- **Form Data Parsing**: Updated `doPost()` to parse URL-encoded form data instead of JSON
- **Removed CORS Headers**: No longer needed for simple requests
- **Removed doOptions()**: Not supported by Google Apps Script Web Apps

## Additional Potential Issues & Solutions

### 1. URL Mismatches
**Symptoms**: 404 errors, "Failed to fetch"
**Solutions**:
- Verify the Apps Script deployment URL is correct
- Ensure the script is deployed as a web app
- Check that the script is accessible to "Anyone" or "Anyone with Google Account"

### 2. Deployment Permissions
**Symptoms**: 403 errors, "Access denied"
**Solutions**:
- Deploy as "Execute as: Me" 
- Set "Who has access" to "Anyone" for public access
- Ensure the script owner has necessary permissions

### 3. Script Execution Quotas
**Symptoms**: Timeout errors, "Service temporarily unavailable"
**Solutions**:
- Google Apps Script has daily execution limits
- Monitor usage in Apps Script dashboard
- Consider implementing retry logic with exponential backoff

### 4. JSON Parsing Errors
**Symptoms**: "Unexpected token" errors, malformed data
**Solutions**:
- Form data parsing handles special characters better than JSON
- URL encoding/decoding handles spaces and special characters
- Added error handling for malformed data

### 5. Network Timeouts
**Symptoms**: "Request timeout" errors
**Solutions**:
- Google Apps Script has 6-minute execution timeout
- Implement client-side timeout handling
- Consider breaking large operations into smaller chunks

## Debugging Steps

### 1. Check Browser Console
```javascript
// Look for these specific error patterns:
- "Failed to fetch" → Network/CORS issue
- "CORS" → Cross-origin issue  
- "timeout" → Server execution timeout
- "quota" → Google Apps Script quota exceeded
- "execution" → Script execution error
```

### 2. Verify Apps Script Deployment
1. Open Google Apps Script editor
2. Click "Deploy" → "Manage deployments"
3. Ensure latest version is deployed
4. Check "Execute as" and "Who has access" settings

### 3. Test Direct Access
1. Open the Apps Script URL directly in browser
2. Should see a simple response (even if error)
3. If 404/403, deployment issue

### 4. Monitor Apps Script Logs
1. In Apps Script editor, click "Executions" tab
2. Check for recent executions
3. Look for error messages or execution times

### 5. Test with Simple Data
```javascript
// Test with minimal data first
const testData = {
  clientName: 'Test User',
  email: 'test@example.com'
};
```

## Best Practices

### 1. Error Handling
- Always wrap fetch in try-catch
- Provide user-friendly error messages
- Log detailed errors for debugging

### 2. Data Validation
- Validate data before sending
- Handle empty/null values gracefully
- Sanitize user input

### 3. Retry Logic
```javascript
async function submitWithRetry(data, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await submitQuotationForm(data);
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
}
```

### 4. Monitoring
- Track submission success rates
- Monitor Apps Script execution logs
- Set up alerts for quota limits

## Common Error Messages & Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| "Failed to fetch" | Network/CORS | Use form data instead of JSON |
| "CORS policy" | Cross-origin | Remove custom headers |
| "Service unavailable" | Quota exceeded | Wait and retry later |
| "Execution timeout" | Script too slow | Optimize script performance |
| "Access denied" | Permissions | Check deployment settings |

## Testing Checklist

- [ ] Form data converts to URL-encoded format
- [ ] No custom headers in fetch request
- [ ] Apps Script deployed with correct permissions
- [ ] Script handles form data parsing
- [ ] Error responses are properly formatted
- [ ] Console shows detailed request/response logs
- [ ] Email notifications are sent successfully
- [ ] Google Sheet data is recorded correctly

## Performance Optimization

1. **Minimize Data Size**: Only send necessary fields
2. **Batch Operations**: Group related operations
3. **Caching**: Cache frequently accessed data
4. **Error Recovery**: Implement graceful degradation

This solution should resolve your CORS preflight issue and provide robust error handling for other potential problems.