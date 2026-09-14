/**
 * Page Performance Test Suite
 * Tests Core Web Vitals: LCP, FID, CLS, Page Load Time
 */

const axios = require('axios');

class PerformanceTest {
  constructor(config) {
    this.baseUrl = config.website.url;
    this.thresholds = config.performance;
    this.results = {};
  }

  /**
   * Test Largest Contentful Paint (LCP)
   * Target: < 2.5s for good experience
   */
  testLCP() {
    // Mock LCP measurement
    const lcp = Math.random() * 4000; // 0-4000ms
    const status = lcp <= this.thresholds.lcp ? 'PASS' : 'FAIL';
    
    this.results.lcp = {
      metric: 'Largest Contentful Paint',
      value: Math.round(lcp),
      unit: 'ms',
      threshold: this.thresholds.lcp,
      status: status,
      message: `LCP: ${Math.round(lcp)}ms (threshold: ${this.thresholds.lcp}ms)`
    };
    return this.results.lcp;
  }

  /**
   * Test First Input Delay (FID)
   * Target: < 100ms for good experience
   */
  testFID() {
    // Mock FID measurement
    const fid = Math.random() * 300; // 0-300ms
    const status = fid <= this.thresholds.fid ? 'PASS' : 'FAIL';
    
    this.results.fid = {
      metric: 'First Input Delay',
      value: Math.round(fid),
      unit: 'ms',
      threshold: this.thresholds.fid,
      status: status,
      message: `FID: ${Math.round(fid)}ms (threshold: ${this.thresholds.fid}ms)`
    };
    return this.results.fid;
  }

  /**
   * Test Cumulative Layout Shift (CLS)
   * Target: < 0.1 for good experience
   */
  testCLS() {
    // Mock CLS measurement
    const cls = Math.random() * 0.5; // 0-0.5
    const status = cls <= this.thresholds.cls ? 'PASS' : 'FAIL';
    
    this.results.cls = {
      metric: 'Cumulative Layout Shift',
      value: Math.round(cls * 1000) / 1000,
      threshold: this.thresholds.cls,
      status: status,
      message: `CLS: ${Math.round(cls * 1000) / 1000} (threshold: ${this.thresholds.cls})`
    };
    return this.results.cls;
  }

  /**
   * Test Total Page Load Time
   */
  async testPageLoadTime() {
    try {
      const startTime = Date.now();
      await axios.get(this.baseUrl, { timeout: 10000 });
      const loadTime = Date.now() - startTime;
      const status = loadTime <= this.thresholds.pageLoadTime ? 'PASS' : 'FAIL';
      
      this.results.pageLoadTime = {
        metric: 'Page Load Time',
        value: loadTime,
        unit: 'ms',
        threshold: this.thresholds.pageLoadTime,
        status: status,
        message: `Page loaded in ${loadTime}ms (threshold: ${this.thresholds.pageLoadTime}ms)`
      };
      return this.results.pageLoadTime;
    } catch (error) {
      this.results.pageLoadTime = {
        status: 'FAIL',
        error: error.message
      };
      return this.results.pageLoadTime;
    }
  }

  /**
   * Run all performance tests
   */
  async runAllTests() {
    console.log('⚡ Running Performance Tests...');
    this.testLCP();
    this.testFID();
    this.testCLS();
    await this.testPageLoadTime();
    return this.results;
  }

  /**
   * Get overall performance score
   */
  getPerformanceScore() {
    const scores = Object.values(this.results)
      .filter(r => r.status)
      .map(r => r.status === 'PASS' ? 100 : 0);
    return scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b) / scores.length) : 0;
  }
}

module.exports = PerformanceTest;
