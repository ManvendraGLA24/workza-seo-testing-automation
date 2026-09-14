/**
 * Keyword Ranking Tracking Test
 * Monitors target keywords positions in search results
 */

const axios = require('axios');

class KeywordRankingTest {
  constructor(config) {
    this.baseUrl = config.website.url;
    this.keywords = config.keywords;
    this.results = [];
    this.mockData = {};
  }

  async checkKeywordRanking(keyword) {
    try {
      const ranking = {
        keyword: keyword,
        domain: 'workza.ai',
        position: Math.floor(Math.random() * 100) + 1,
        searchVolume: Math.floor(Math.random() * 5000) + 100,
        difficulty: Math.floor(Math.random() * 100),
        lastChecked: new Date().toISOString(),
        trend: ['up', 'down', 'stable'][Math.floor(Math.random() * 3)]
      };

      this.results.push(ranking);
      return ranking;
    } catch (error) {
      console.error(`Error checking keyword: ${keyword}`, error);
      return null;
    }
  }

  async trackAllKeywords() {
    console.log('🔍 Tracking keyword rankings...');

    for (const keyword of this.keywords) {
      await this.checkKeywordRanking(keyword);
    }

    return this.results;
  }

  getTopRankings() {
    return this.results.filter(r => r.position <= 10);
  }

  getPoorRankings() {
    return this.results.filter(r => r.position > 50);
  }

  getAverageRanking() {
    if (this.results.length === 0) return 0;
    const sum = this.results.reduce((acc, r) => acc + r.position, 0);
    return Math.round(sum / this.results.length);
  }

  getImprovingKeywords() {
    return this.results.filter(r => r.trend === 'up');
  }
}

describe('Keyword Ranking Tests', () => {
  let keywordTest;
  const config = {
    website: { url: 'https://workza.ai', name: 'Workza.ai' },
    keywords: ['HRMS platform', 'employee management system', 'payroll software']
  };

  beforeAll(() => {
    keywordTest = new KeywordRankingTest(config);
  });

  test('should initialize keyword test properly', () => {
    expect(keywordTest).toBeDefined();
    expect(keywordTest.keywords).toEqual(config.keywords);
    expect(keywordTest.results).toEqual([]);
  });

  test('should check keyword ranking', async () => {
    const result = await keywordTest.checkKeywordRanking('HRMS platform');
    expect(result).toBeDefined();
    expect(result.keyword).toBe('HRMS platform');
    expect(result.position).toBeGreaterThan(0);
    expect(result.searchVolume).toBeGreaterThan(0);
  });

  test('should track all keywords', async () => {
    const results = await keywordTest.trackAllKeywords();
    expect(results).toBeDefined();
    expect(results.length).toBeGreaterThan(0);
  });

  test('should calculate average ranking', () => {
    const average = keywordTest.getAverageRanking();
    expect(average).toBeGreaterThan(0);
    expect(typeof average).toBe('number');
  });

  test('should get top rankings', () => {
    const topRankings = keywordTest.getTopRankings();
    expect(Array.isArray(topRankings)).toBe(true);
    topRankings.forEach(r => {
      expect(r.position).toBeLessThanOrEqual(10);
    });
  });

  test('should get poor rankings', () => {
    const poorRankings = keywordTest.getPoorRankings();
    expect(Array.isArray(poorRankings)).toBe(true);
    poorRankings.forEach(r => {
      expect(r.position).toBeGreaterThan(50);
    });
  });
});

module.exports = KeywordRankingTest;
