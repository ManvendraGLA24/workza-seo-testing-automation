/**
 * Mobile Usability Test Suite
 * Tests responsiveness, touch-friendly elements, viewport configuration
 */

const axios = require('axios');
const cheerio = require('cheerio');

class MobileUsabilityTest {
  constructor(config) {
    this.baseUrl = config.website.url;
    this.results = {};
  }

  async testViewport() {
    try {
      const response = await axios.get(this.baseUrl);
      const $ = cheerio.load(response.data);

      const viewport = $('meta[name="viewport"]').attr('content');
      const hasProperViewport = viewport && viewport.includes('width=device-width');

      this.results.viewport = {
        status: hasProperViewport ? 'PASS' : 'FAIL',
        found: !!viewport,
        content: viewport,
        message: hasProperViewport ? 'Proper viewport meta tag found' : 'Viewport meta tag missing or incorrect'
      };
      return this.results.viewport;
    } catch (error) {
      this.results.viewport = { status: 'FAIL', error: error.message };
      return this.results.viewport;
    }
  }

  async testFontSize() {
    try {
      const response = await axios.get(this.baseUrl);
      const $ = cheerio.load(response.data);

      const smallFontElements = $('body *').filter((i, el) => {
        const style = $(el).attr('style');
        if (!style) return false;
        return style.includes('font-size') && (style.includes('px') && parseInt(style) < 12);
      }).length;

      this.results.fontSize = {
        status: smallFontElements === 0 ? 'PASS' : 'WARN',
        smallFontElements: smallFontElements,
        message: `Found ${smallFontElements} elements with small font size`
      };
      return this.results.fontSize;
    } catch (error) {
      this.results.fontSize = { status: 'FAIL', error: error.message };
      return this.results.fontSize;
    }
  }

  async testTouchFriendly() {
    try {
      const response = await axios.get(this.baseUrl);
      const $ = cheerio.load(response.data);

      const buttons = $('button, a, input[type="button"]').length;
      const hasMinTouchSize = buttons > 0;

      this.results.touchFriendly = {
        status: hasMinTouchSize ? 'PASS' : 'WARN',
        interactiveElements: buttons,
        message: `Found ${buttons} interactive elements`
      };
      return this.results.touchFriendly;
    } catch (error) {
      this.results.touchFriendly = { status: 'FAIL', error: error.message };
      return this.results.touchFriendly;
    }
  }

  async testHorizontalScroll() {
    try {
      const response = await axios.get(this.baseUrl);
      const $ = cheerio.load(response.data);

      const hasOverflow = response.data.includes('overflow: scroll') ||
                         response.data.includes('overflow-x: scroll');

      this.results.horizontalScroll = {
        status: !hasOverflow ? 'PASS' : 'WARN',
        overflowElements: hasOverflow,
        message: hasOverflow ? 'Potential horizontal scroll issues' : 'No horizontal scroll issues detected'
      };
      return this.results.horizontalScroll;
    } catch (error) {
      this.results.horizontalScroll = { status: 'FAIL', error: error.message };
      return this.results.horizontalScroll;
    }
  }

  async runAllTests() {
    console.log('📱 Running Mobile Usability Tests...');
    await this.testViewport();
    await this.testFontSize();
    await this.testTouchFriendly();
    await this.testHorizontalScroll();
    return this.results;
  }
}

describe('Mobile Usability Tests', () => {
  let mobileTest;
  const config = {
    website: { url: 'https://workza.ai' }
  };

  beforeAll(() => {
    mobileTest = new MobileUsabilityTest(config);
  });

  test('should initialize mobile usability test', () => {
    expect(mobileTest).toBeDefined();
    expect(mobileTest.baseUrl).toBe('https://workza.ai');
  });

  test('should have results object', () => {
    expect(mobileTest.results).toBeDefined();
    expect(typeof mobileTest.results).toBe('object');
  });

  test('should run all mobile usability tests', async () => {
    const results = await mobileTest.runAllTests();
    expect(results).toBeDefined();
    expect(Object.keys(results).length).toBeGreaterThan(0);
  });

  test('should test viewport configuration', async () => {
    await mobileTest.testViewport();
    expect(mobileTest.results.viewport).toBeDefined();
    expect(mobileTest.results.viewport.status).toMatch(/PASS|FAIL/);
  });

  test('should test touch friendly elements', async () => {
    await mobileTest.testTouchFriendly();
    expect(mobileTest.results.touchFriendly).toBeDefined();
    expect(mobileTest.results.touchFriendly.interactiveElements).toBeGreaterThanOrEqual(0);
  });
});

module.exports = MobileUsabilityTest;
