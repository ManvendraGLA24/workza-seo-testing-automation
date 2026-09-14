/**
 * Main SEO Test Runner
 * Orchestrates all SEO tests and generates unified reports
 */

const config = require('../config/config.example');
const TechnicalSEOAudit = require('./technical-seo/audit.test');
const KeywordRankingTest = require('./keywords/ranking-tracking.test');
const PerformanceTest = require('./performance/performance.test');
const ContentAudit = require('./content/content-audit');
const MobileUsabilityTest = require('./mobile/mobile-usability.test');
const ReportGenerator = require('../scripts/report-generator');

class SEOTestRunner {
  constructor() {
    this.config = config;
    this.results = {};
    this.startTime = null;
    this.endTime = null;
  }

  /**
   * Initialize and run all test suites
   */
  async runAllTests() {
    console.log('\n🚀 Starting SEO Testing Suite for Workza.ai\n');
    console.log('=' .repeat(50));
    this.startTime = Date.now();

    try {
      // Run Technical SEO Audit
      console.log('\n1️⃣  Running Technical SEO Audit...');
      const technicalSEO = new TechnicalSEOAudit(this.config);
      this.results.technicalSEO = await technicalSEO.runAllTests();
      console.log('✅ Technical SEO Audit Complete\n');

      // Run Keyword Tracking
      console.log('\n2️⃣  Running Keyword Ranking Tests...');
      const keywordTest = new KeywordRankingTest(this.config);
      this.results.keywords = await keywordTest.trackAllKeywords();
      this.results.keywordStats = {
        topRankings: keywordTest.getTopRankings().length,
        poorRankings: keywordTest.getPoorRankings().length,
        averageRanking: keywordTest.getAverageRanking(),
        improving: keywordTest.getImprovingKeywords().length
      };
      console.log('✅ Keyword Tests Complete\n');

      // Run Performance Tests
      console.log('\n3️⃣  Running Performance Tests...');
      const performanceTest = new PerformanceTest(this.config);
      this.results.performance = await performanceTest.runAllTests();
      this.results.performanceScore = performanceTest.getPerformanceScore();
      console.log('✅ Performance Tests Complete\n');

      // Run Content Audit
      console.log('\n4️⃣  Running Content Audit...');
      const contentAudit = new ContentAudit(this.config);
      this.results.content = await contentAudit.runAllTests();
      console.log('✅ Content Audit Complete\n');

      // Run Mobile Usability Tests
      console.log('\n5️⃣  Running Mobile Usability Tests...');
      const mobileTest = new MobileUsabilityTest(this.config);
      this.results.mobile = await mobileTest.runAllTests();
      console.log('✅ Mobile Tests Complete\n');

      this.endTime = Date.now();
      const duration = ((this.endTime - this.startTime) / 1000).toFixed(2);

      console.log('=' .repeat(50));
      console.log(`\n✨ All tests completed in ${duration} seconds!\n`);

      // Generate Report
      const reportGenerator = new ReportGenerator(this.results);
      await reportGenerator.generateReport();

      return this.results;
    } catch (error) {
      console.error('❌ Error running tests:', error);
      throw error;
    }
  }

  /**
   * Get test summary
   */
  getSummary() {
    const summary = {
      timestamp: new Date().toISOString(),
      website: this.config.website.url,
      duration: `${((this.endTime - this.startTime) / 1000).toFixed(2)}s`,
      results: {
        technicalSEO: Object.keys(this.results.technicalSEO).length,
        keywords: this.results.keywordStats,
        performanceScore: this.results.performanceScore,
        contentAudits: Object.keys(this.results.content).length,
        mobileTests: Object.keys(this.results.mobile).length
      }
    };
    return summary;
  }
}

// Run if executed directly
if (require.main === module) {
  const runner = new SEOTestRunner();
  runner.runAllTests().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = SEOTestRunner;
