# Puppeteer Serverless Setup for Vercel

## Changes Made

### 1. Package Updates

- Replaced `puppeteer` with `puppeteer-core` (smaller, no bundled Chrome)
- Added `@sparticuz/chromium` for serverless Chrome binary

### 2. Code Changes

#### `/src/lib/scraping/website-scraper.ts`

- Updated to use `puppeteer-core` instead of `puppeteer`
- Added environment detection (production vs development)
- **Production (Vercel)**: Uses `@sparticuz/chromium` for Chrome binary
- **Development**: Uses local Chrome installation with fallback
- Added extensive logging for debugging

#### `/src/app/api/admin/ai-analyze-website/route.ts`

- Added `export const runtime = 'nodejs'` to force Node.js runtime
- Added `export const maxDuration = 60` for 60-second timeout

#### `/vercel.json` (NEW)

- Configured the API route with:
  - `memory: 3008` MB (maximum for better performance)
  - `maxDuration: 60` seconds

## How It Works

### Local Development

```javascript
// Uses your local Chrome installation
executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
```

### Production (Vercel)

```javascript
// Uses @sparticuz/chromium which:
// 1. Downloads optimized Chromium binary (~50MB)
// 2. Decompresses it on first use
// 3. Caches for subsequent invocations
executablePath: await chromium.executablePath();
```

## Deployment Steps

1. **Commit changes:**

   ```bash
   git add .
   git commit -m "fix: Configure Puppeteer for Vercel serverless environment"
   git push
   ```

2. **Vercel will automatically:**
   - Detect the `vercel.json` configuration
   - Allocate 3GB memory to the AI analysis function
   - Set 60-second timeout
   - Bundle `@sparticuz/chromium` with your deployment

## Troubleshooting

### If you still see "brotli files" error:

1. Check that `@sparticuz/chromium` is installed:

   ```bash
   npm list @sparticuz/chromium
   ```

2. Ensure `vercel.json` is in the root directory

3. Check Vercel function logs for detailed error messages

### Memory Issues

If you see "out of memory" errors, the function might need more resources:

- Current setting: 3008 MB (maximum)
- If still insufficient, consider:
  - Reducing viewport size
  - Limiting concurrent page scraping
  - Implementing caching

### Timeout Issues

If scraping takes longer than 60 seconds:

- Consider implementing a timeout for individual page loads
- Add retry logic with exponential backoff
- Cache results for frequently analyzed websites

## Environment Variables

Make sure these are set in Vercel:

- `OPENAI_API_KEY` - For AI analysis
- `NEXT_PUBLIC_IS_PRODUCTION` - Set to `"true"` (optional, auto-detected via `VERCEL=1`)

## Cost Considerations

- Each invocation downloads/decompresses Chromium (~50MB) if not cached
- Cold starts may take 5-10 seconds
- Warm invocations are much faster (1-2 seconds)
- Memory: 3GB × execution time

## Testing

### Test locally:

```bash
npm run dev
# Navigate to admin panel and try AI auto-fill
```

### Test in production:

```bash
# After deployment
curl -X POST https://your-domain.com/api/admin/ai-analyze-website \
  -H "Content-Type: application/json" \
  -d '{"url":"example.com"}' \
  -H "Cookie: your-admin-session-cookie"
```

## Performance Optimization

Current setup should handle:

- ✅ Simple websites: 5-10 seconds
- ✅ Medium websites: 10-20 seconds
- ✅ Complex websites: 20-40 seconds
- ⚠️ Very complex/slow sites: May timeout at 60s

Consider adding progress indicators in the UI for better UX.

## Additional Notes

- Chromium binary is cached between invocations on the same instance
- First invocation (cold start) will be slowest
- Subsequent invocations on warm instances are faster
- Vercel automatically scales based on demand
