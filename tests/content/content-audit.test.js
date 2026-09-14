/**
 * Content Audit Test Suite
 * Checks meta tags, headings, content quality, keyword density
 */

const axios = require('axios');
const cheerio = require('cheerio');

class ContentAudit {
  constructor(config) {
    this.baseUrl = config.website.url;
    this.results = {};
  }

  /**
   * Analyze page for meta tags
   */
  async testMetaTags() {
    try {
      const response = await axios.get(this.baseUrl);
      const $ = cheerio.load(response.data);

      const metaTags = {
        title: $('title').text(),
        description: $('meta[name="description"]').attr('content'),
        keywords: $('meta[name="keywords"]').attr('content'),
        ogTitle: $('meta[property="og:title"]').attr('content'),
        ogDescription: $('meta[property="og:description"]').attr('content'),
        canonical: $('link[rel="canonical"]').attr('href')
      };

      const titleLength = metaTags.title?.length || 0;
      const descLength = metaTags.description?.length || 0;

      this.results.metaTags = {
        status: titleLength > 0 && descLength > 0 ? 'PASS' : 'WARN',
        tags: metaTags,
        validation: {
          titleLength: { value: titleLength, optimal: '50-60' },
          descriptionLength: { value: descLength, optimal: '150-160' },
          hasCanonical: !!metaTags.canonical
        }
      };
      return this.results.metaTags;
    } catch (error) {
      this.results.metaTags = { status: 'FAIL', error: error.message };
      return this.results.metaTags;
    }
  }

  /**
   * Analyze heading structure (H1, H2, H3)
   */
  async testHeadingStructure() {
    try {
      const response = await axios.get(this.baseUrl);
      const $ = cheerio.load(response.data);

      const headings = {
        h1: $('h1').length,
        h2: $('h2').length,
        h3: $('h3').length,
        h1Text: $('h1').text()
      };

      this.results.headings = {
        status: headings.h1 === 1 ? 'PASS' : 'WARN',
        structure: headings,
        message: `Found ${headings.h1} H1, ${headings.h2} H2, ${headings.h3} H3 tags`
      };
      return this.results.headings;
    } catch (error) {
      this.results.headings = { status: 'FAIL', error: error.message };
      return this.results.headings;
    }
  }

  /**
   * Check for images with alt text
   */
  async testImageAltText() {
    try {
      const response = await axios.get(this.baseUrl);
      const $ = cheerio.load(response.data);

      const images = $('img').length;
      const imagesWithAlt = $('img[alt]').length;
      const altPercentage = images > 0 ? Math.round((imagesWithAlt / images) * 100) : 0;

      this.results.imageAlt = {
        status: altPercentage >= 80 ? 'PASS' : 'WARN',
        totalImages: images,
        imagesWithAlt: imagesWithAlt,
        percentage: altPercentage,
        message: `${altPercentage}% of images have alt text`
      };
      return this.results.imageAlt;
    } catch (error) {
      this.results.imageAlt = { status: 'FAIL', error: error.message };
      return this.results.imageAlt;
    }
  }

  /**
   * Analyze page content length
   */
  async testContentLength() {
    try {
      const response = await axios.get(this.baseUrl);
      const $ = cheerio.load(response.data);

      const bodyText = $('body').text();
      const wordCount = bodyText.split(/\s+/).filter(w => w.length > 0).length;

      this.results.contentLength = {
        status: wordCount >= 300 ? 'PASS' : 'WARN',
        wordCount: wordCount,
        characterCount: bodyText.length,
        message: `Page contains ${wordCount} words`
      };
      return this.results.contentLength;
    } catch (error) {
      this.results.contentLength = { status: 'FAIL', error: error.message };
      return this.results.contentLength;
    }
  }

  /**
   * Run all content audit tests
   */
  async runAllTests() {
    console.log('📝 Running Content Audit...');
    await this.testMetaTags();
    await this.testHeadingStructure();
    await this.testImageAltText();
    await this.testContentLength();
    return this.results;
  }
}

module.exports = ContentAudit;
