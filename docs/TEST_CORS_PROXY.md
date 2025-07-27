# Testing the CORS Proxy Implementation

This guide helps you verify that the Netlify CORS proxy is working correctly.

## Quick Test Checklist

### 1. Deploy to Netlify
```bash
# Option A: If you have Netlify CLI connected
npx netlify deploy --prod

# Option B: Push to Git and deploy via Netlify dashboard
git push origin main
```

### 2. Test the Function Directly

You can test the proxy function directly with curl:

```bash
# Test OPTIONS preflight
curl -X OPTIONS https://your-site.netlify.app/.netlify/functions/quote-proxy \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -v

# Test POST with sample data
curl -X POST https://your-site.netlify.app/.netlify/functions/quote-proxy \
  -H "Content-Type: application/json" \
  -d '{"clientName":"Test User","email":"test@example.com","phone":"123-456-7890"}' \
  -v
```

### 3. Browser Test

1. Open your Netlify site
2. Open browser developer tools (F12)
3. Go to the Network tab
4. Fill out and submit the quotation form
5. Look for these indicators:

**✅ Success indicators:**
- No CORS errors in console
- Request to `/.netlify/functions/quote-proxy` appears in Network tab
- Response status 200
- Data appears in Google Sheets

**❌ Failure indicators:**
- CORS preflight errors
- Network request fails
- 500 server errors
- Data doesn't reach Google Sheets

### 4. Function Logs

Check Netlify function logs for debugging:

1. Go to Netlify dashboard
2. Navigate to Functions tab
3. Click on `quote-proxy`
4. View logs to see request/response data

## Expected Flow

```
Frontend Form
    ↓ (JSON POST)
Netlify Proxy Function
    ↓ (URL-encoded POST)
Google Apps Script
    ↓ (JSON response)
Google Sheets Updated
    ↓ (success response)
Frontend Confirmation
```

## Troubleshooting

### If CORS errors persist:
- Check that `netlify.toml` is deployed
- Verify function is deployed and accessible
- Check browser network tab for actual error

### If function returns 500:
- Check Netlify function logs
- Verify `node-fetch` dependency installed
- Check Apps Script URL is correct

### If data doesn't reach Google Sheets:
- Test Apps Script directly with curl
- Check Apps Script execution permissions
- Verify data format conversion in proxy

## Data Format Verification

The proxy converts this JSON:
```json
{
  "clientName": "John Doe",
  "email": "john@example.com",
  "phone": "123-456-7890"
}
```

To this URL-encoded format for Apps Script:
```
clientName=John%20Doe&email=john%40example.com&phone=123-456-7890
```

## Success Criteria

- ✅ No CORS errors in browser console
- ✅ Form submission completes successfully  
- ✅ Data appears in Google Sheets
- ✅ User sees success confirmation
- ✅ Function logs show successful proxy operation