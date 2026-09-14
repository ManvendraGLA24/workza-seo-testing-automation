# SEO Testing Automation - Setup & Usage Guide

## Overview

This comprehensive SEO testing automation suite for Workza.ai provides automated testing across multiple SEO dimensions:

- **Technical SEO** - robots.txt, sitemap, SSL, structured data, mobile friendliness
- **Keyword Tracking** - ranking positions, search volume, trend analysis
- **Performance** - Core Web Vitals (LCP, FID, CLS), page load time
- **Content Audit** - meta tags, headings, alt text, content length
- **Mobile Usability** - viewport, font size, touch-friendly elements, responsiveness

## Installation

### Prerequisites
- Node.js 18.x or higher
- npm or yarn
- Git

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/ManvendraGLA24/workza-seo-testing-automation.git
   cd workza-seo-testing-automation
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp config/config.example.js config/config.js
   ```

4. **Set up API keys** (optional, for advanced features)
   ```bash
   # Add these to your environment or .env file:
   export GSC_API_KEY="your-google-search-console-key"
   export SEMRUSH_API_KEY="your-semrush-key"
   export AHREFS_API_KEY="your-ahrefs-key"
   export MOZ_API_KEY="your-moz-key"
   ```

## Running Tests

### Quick Start
```bash
# Run all SEO tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test suite
npm test -- tests/technical-seo/audit.test.js
npm test -- tests/keywords/ranking-tracking.test.js
npm test -- tests/performance/performance.test.js
npm test -- tests/content/content-audit.test.js
npm test -- tests/mobile/mobile-usability.test.js
```

### Using the Test Runner
```bash
# Run complete SEO testing suite with reports
node tests/runner.js
```

This will:
1. Execute all test modules
2. Generate reports in HTML, JSON, and CSV formats
3. Save reports to `/reports` directory
4. Display summary statistics

## Configuration

Edit `config/config.js` to customize:

```javascript
{
  website: {
    url: 'https://workza.ai',
    name: 'Workza.ai'
  },
  
  keywords: [
    'HRMS platform',
    'employee management system',
    // ... add target keywords
  ],
  
  performance: {
    lcp: 2500,        // Largest Contentful Paint threshold (ms)
    fid: 100,         // First Input Delay threshold (ms)
    cls: 0.1,         // Cumulative Layout Shift threshold
    pageLoadTime: 3000 // Page load time threshold (ms)
  },
  
  seo: {
    minDomainAuthority: 30,
    minBacklinks: 100,
    minKeywordRankings: 50
  }
}
```

## CI/CD Integration

### GitHub Actions Workflows

Three automated workflows are configured:

#### 1. Daily Tests (.github/workflows/seo-tests-daily.yml)
- **Runs**: Every day at midnight UTC
- **Tests**: All SEO test suites
- **Reports**: Uploaded as artifacts (30-day retention)
- **Alerts**: Slack notification on failure

Trigger manually:
```bash
gh workflow run seo-tests-daily.yml
```

#### 2. Weekly Analysis (.github/workflows/seo-tests-weekly.yml)
- **Runs**: Every Sunday at midnight UTC
- **Tests**: Comprehensive analysis with coverage
- **Reports**: Stored in repository (90-day retention)
- **Email**: Sends detailed report to configured email
- **Commit**: Reports committed automatically to repo

#### 3. Pull Request Validation (.github/workflows/seo-tests-pr.yml)
- **Triggers**: On PR to main when test files change
- **Tests**: Code linting and all tests
- **Coverage**: Uploads to Codecov
- **Comment**: Posts results as PR comment

### Setting Up Secrets

Add these to your GitHub repository secrets:

```
GSC_API_KEY              # Google Search Console API key
SEMRUSH_API_KEY          # SEMrush API key
AHREFS_API_KEY           # Ahrefs API key
MOZ_API_KEY              # Moz API key
SLACK_WEBHOOK            # Slack webhook URL for alerts
EMAIL_SERVER             # Email server address
EMAIL_PORT               # Email port
EMAIL_USERNAME           # Email account
EMAIL_PASSWORD           # Email password
REPORT_EMAIL             # Recipient email for reports
NOTIFICATION_EMAIL       # Email for notifications
```

## Report Formats

Reports are automatically generated in three formats:

### HTML Report
- Interactive dashboard
- Visual metrics with color coding
- Keyword ranking table
- Shareable format

### JSON Report
- Machine-readable format
- Complete test metadata
- Easy integration with tools
- Structured data for analysis

### CSV Report
- Spreadsheet-compatible
- Easy import to Excel/Google Sheets
- Row-by-row test results
- Summary statistics

Reports are saved to `/reports` with timestamp:
```
reports/
├── report-1694635200000.html
├── report-1694635200000.json
└── report-1694635200000.csv
```

## Test Modules

### Technical SEO Audit (`tests/technical-seo/`)
Tests:
- ✅ robots.txt accessibility
- ✅ sitemap.xml presence
- ✅ SSL/HTTPS configuration
- ✅ HTTP status codes
- ✅ Mobile friendliness meta tags
- ✅ Structured data (schema.org)

### Keyword Tracking (`tests/keywords/`)
Metrics:
- Current ranking position
- Search volume
- Keyword difficulty
- Ranking trend (up/down/stable)
- Top rankings (position <= 10)
- Average position across all keywords

### Performance Testing (`tests/performance/`)
Metrics:
- **LCP** (Largest Contentful Paint) < 2.5s
- **FID** (First Input Delay) < 100ms
- **CLS** (Cumulative Layout Shift) < 0.1
- Total page load time < 3s

### Content Audit (`tests/content/`)
Checks:
- Meta title length (50-60 chars)
- Meta description length (150-160 chars)
- Canonical tag presence
- H1 tag count and content
- Image alt text coverage
- Content word count
- Open Graph tags

### Mobile Usability (`tests/mobile/`)
Checks:
- Viewport meta tag configuration
- Font size legibility
- Touch-friendly button/link sizing
- Horizontal scroll issues

## Interpreting Results

### Status Indicators
- **PASS** (✅) - Test passed all checks
- **WARN** (⚠️) - Test passed but needs attention
- **FAIL** (❌) - Test failed critical check

### Performance Score
Overall score out of 100 based on Core Web Vitals:
- **90-100**: Excellent
- **75-89**: Good
- **50-74**: Needs Improvement
- **< 50**: Critical Issues

## Troubleshooting

### Tests Won't Run
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Permission Denied on Reports
```bash
chmod -R 755 reports/
```

### API Key Issues
- Verify all keys in environment variables
- Check key permissions and scope
- Ensure keys are not expired

## Best Practices

1. **Regular Testing**: Run tests daily for consistent monitoring
2. **Weekly Reviews**: Check weekly reports for trend analysis
3. **Threshold Tuning**: Adjust performance thresholds based on goals
4. **Competitor Tracking**: Compare your keywords against competitors
5. **Alert Monitoring**: Keep Slack/email notifications enabled
6. **Report Archiving**: Keep historical reports for trend analysis

## Contributing

To add new tests:

1. Create a new test file in appropriate directory
2. Export a class with `runAllTests()` method
3. Return results in standard format
4. Update `tests/runner.js` to include new test
5. Add to appropriate workflow configuration

## Support

For issues or questions:
- Check GitHub Issues
- Review test logs
- Check configuration settings
- Verify API credentials

## License

MIT License - See LICENSE file for details

---

**Last Updated**: 2024
**Maintained By**: ManvendraGLA24
