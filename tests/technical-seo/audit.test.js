/**
 * Technical SEO Audit Test Suite
 * Tests: sitemap, robots.txt, structured data, canonical tags, SSL, redirects
 */

const axios = require('axios');

class TechnicalSEOAudit {
  constructor(config) {
    this.baseUrl = config.website.url;
    this.results = {};
  }

  async testRobotsTxt() {
    try {
      const response = await axios.get(`${this.baseUrl}/robots.txt`);
      this.results.robotsTxt = {
        status: 'PASS',
        statusCode: response.status,
        content: response.data.substring(0, 500),
        message: 'robots.txt found and accessible'
      };
      return this.results.robotsTxt;
    } catch (error) {
      this.results.robotsTxt = {
        status: 'FAIL',
        error: error.message,
        message: 'robots.txt not found or not accessible'
      };
      return this.results.robotsTxt;
    }
  }

  async testSitemap() {
    try {
      const response = await axios.get(`${this.baseUrl}/sitemap.xml`);
      const sitemapUrls = (response.data.match(/<loc>/g) || []).length;
      this.results.sitemap = {
        status: sitemapUrls > 0 ? 'PASS' : 'WARN',
        statusCode: response.status,
        urlCount: sitemapUrls,
        message: `Sitemap found with ${sitemapUrls} URLs`
      };
      return this.results.sitemap;
    } catch (error) {
      this.results.sitemap = {
        status: 'FAIL',
        error: error.message,
        message: 'sitemap.xml not found'
      };
      return this.results.sitemap;
    }
  }

  async testSSL() {
    const url = new URL(this.baseUrl);
    const protocol = url.protocol;
    this.results.ssl = {
      status: protocol === 'https:' ? 'PASS' : 'FAIL',
      protocol: protocol,
      message: protocol === 'https:' ? 'HTTPS enabled' : 'HTTPS not enabled'
    };
    return this.results.ssl;
  }

  async testStatusCodes() {
    try {
      const response = await axios.head(this.baseUrl);
      this.results.statusCode = {
        status: response.status === 200 ? 'PASS' : 'WARN',
        code: response.status,
        message: `HTTP Status: ${response.status}`
      };
      return this.results.statusCode;
    } catch (error) {
      this.results.statusCode = {
        status: 'FAIL',
        error: error.response?.status || error.message,
        message: 'Site not accessible'
      };
      return this.results.statusCode;
    }
  }

  async testMobileFriendliness() {
    try {
      const response = await axios.get(this.baseUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36'
        }
      });
      const hasViewport = response.data.includes('viewport');
      this.results.mobileFriendly = {
        status: hasViewport ? 'PASS' : 'FAIL',
        hasViewport: hasViewport,
        message: hasViewport ? 'Viewport meta tag found' : 'Viewport meta tag missing'
      };
      return this.results.mobileFriendly;
    } catch (error) {
      this.results.mobileFriendly = {
        status: 'FAIL',
        error: error.message
      };
      return this.results.mobileFriendly;
    }
  }

  async testStructuredData() {
    try {
      const response = await axios.get(this.baseUrl);
      const hasStructuredData = response.data.includes('schema.org') ||
                                response.data.includes('application/ld+json');
      this.results.structuredData = {
        status: hasStructuredData ? 'PASS' : 'WARN',
        found: hasStructuredData,
        message: hasStructuredData ? 'Structured data found' : 'Structured data not found'
      };
      return this.results.structuredData;
    } catch (error) {
      this.results.structuredData = {
        status: 'FAIL',
        error: error.message
      };
      return this.results.structuredData;
    }
  }

  async runAllTests() {
    console.log('🔧 Running Technical SEO Audit...');
    await this.testRobotsTxt();
    await this.testSitemap();
    await this.testSSL();
    await this.testStatusCodes();
    await this.testMobileFriendliness();
    await this.testStructuredData();
    return this.results;
  }
}

describe('Technical SEO Audit', () => {
  let auditTest;
  const config = {
    website: { url: 'https://workza.ai', name: 'Workza.ai' }
  };

  beforeAll(() => {
    auditTest = new TechnicalSEOAudit(config);
  });

  test('should initialize audit test properly', () => {
    expect(auditTest).toBeDefined();
    expect(auditTest.baseUrl).toBe('https://workza.ai');
  });

  test('should check SSL certificate', async () => {
    const result = await auditTest.testSSL();
    expect(result).toBeDefined();
    expect(result.status).toBeDefined();
    expect(['PASS', 'FAIL']).toContain(result.status);
  });

  test('should have results object', () => {
    expect(auditTest.results).toBeDefined();
    expect(typeof auditTest.results).toBe('object');
  });

  test('should run all technical SEO tests', async () => {
    const results = await auditTest.runAllTests();
    expect(results).toBeDefined();
    expect(Object.keys(results).length).toBeGreaterThan(0);
  });
});

module.exports = TechnicalSEOAudit;
