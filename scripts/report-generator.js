/**
 * Report Generator
 * Creates comprehensive SEO testing reports in HTML, JSON, and CSV formats
 */

const fs = require('fs');
const path = require('path');

class ReportGenerator {
  constructor(testResults) {
    this.results = testResults;
    this.timestamp = new Date().toISOString();
    this.reportDir = path.join(__dirname, '../reports');
  }

  /**
   * Generate all report formats
   */
  async generateReport() {
    this.ensureReportDirectory();
    await this.generateHTMLReport();
    await this.generateJSONReport();
    await this.generateCSVReport();
    console.log('\n📊 Reports generated successfully!');
  }

  /**
   * Ensure reports directory exists
   */
  ensureReportDirectory() {
    if (!fs.existsSync(this.reportDir)) {
      fs.mkdirSync(this.reportDir, { recursive: true });
    }
  }

  /**
   * Generate HTML Report
   */
  async generateHTMLReport() {
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SEO Testing Report - Workza.ai</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f5f5f5; color: #333; }
        .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 8px; margin-bottom: 30px; }
        .header h1 { font-size: 32px; margin-bottom: 10px; }
        .header p { opacity: 0.9; }
        .report-section { background: white; padding: 25px; margin-bottom: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .section-title { font-size: 20px; font-weight: 600; margin-bottom: 20px; border-bottom: 3px solid #667eea; padding-bottom: 10px; }
        .metric { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 20px; }
        .metric-card { background: #f8f9fa; padding: 15px; border-radius: 6px; border-left: 4px solid #667eea; }
        .metric-card.pass { border-left-color: #28a745; }
        .metric-card.fail { border-left-color: #dc3545; }
        .metric-card.warn { border-left-color: #ffc107; }
        .metric-label { font-size: 12px; color: #666; text-transform: uppercase; }
        .metric-value { font-size: 20px; font-weight: 600; margin-top: 5px; }
        .status-badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
        .status-pass { background: #d4edda; color: #155724; }
        .status-fail { background: #f8d7da; color: #721c24; }
        .status-warn { background: #fff3cd; color: #856404; }
        table { width: 100%; border-collapse: collapse; margin-top: 15px; }
        th { background: #f8f9fa; padding: 12px; text-align: left; font-weight: 600; border-bottom: 2px solid #dee2e6; }
        td { padding: 12px; border-bottom: 1px solid #dee2e6; }
        tr:hover { background: #f8f9fa; }
        .footer { text-align: center; color: #666; margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔍 SEO Testing Report</h1>
            <p>Workza.ai - ${new Date(this.timestamp).toLocaleString()}</p>
        </div>

        <!-- Technical SEO Section -->
        <div class="report-section">
            <h2 class="section-title">🔧 Technical SEO Audit</h2>
            <div class="metric">
                ${this.generateTechnicalSEOMetrics()}
            </div>
        </div>

        <!-- Keywords Section -->
        <div class="report-section">
            <h2 class="section-title">🎯 Keyword Rankings</h2>
            <div class="metric">
                <div class="metric-card">
                    <div class="metric-label">Top Rankings (Top 10)</div>
                    <div class="metric-value">${this.results.keywordStats?.topRankings || 0}</div>
                </div>
                <div class="metric-card">
                    <div class="metric-label">Average Position</div>
                    <div class="metric-value">#${this.results.keywordStats?.averageRanking || 'N/A'}</div>
                </div>
                <div class="metric-card">
                    <div class="metric-label">Improving Keywords</div>
                    <div class="metric-value">${this.results.keywordStats?.improving || 0}</div>
                </div>
            </div>
            ${this.generateKeywordTable()}
        </div>

        <!-- Performance Section -->
        <div class="report-section">
            <h2 class="section-title">⚡ Performance Metrics</h2>
            <div class="metric">
                ${this.generatePerformanceMetrics()}
            </div>
        </div>

        <!-- Content Section -->
        <div class="report-section">
            <h2 class="section-title">📝 Content Audit</h2>
            <div class="metric">
                ${this.generateContentMetrics()}
            </div>
        </div>

        <!-- Mobile Section -->
        <div class="report-section">
            <h2 class="section-title">📱 Mobile Usability</h2>
            <div class="metric">
                ${this.generateMobileMetrics()}
            </div>
        </div>

        <div class="footer">
            <p>Report generated on ${new Date(this.timestamp).toLocaleString()}</p>
            <p>Workza.ai SEO Testing Automation Suite</p>
        </div>
    </div>
</body>
</html>
    `;

    const reportPath = path.join(this.reportDir, `report-${Date.now()}.html`);
    fs.writeFileSync(reportPath, htmlContent);
    console.log(`📄 HTML Report: ${reportPath}`);
  }

  /**
   * Generate JSON Report
   */
  async generateJSONReport() {
    const jsonReport = {
      timestamp: this.timestamp,
      summary: {
        website: 'https://workza.ai',
        testDate: new Date(this.timestamp).toLocaleString()
      },
      results: this.results
    };

    const reportPath = path.join(this.reportDir, `report-${Date.now()}.json`);
    fs.writeFileSync(reportPath, JSON.stringify(jsonReport, null, 2));
    console.log(`📋 JSON Report: ${reportPath}`);
  }

  /**
   * Generate CSV Report
   */
  async generateCSVReport() {
    let csvContent = 'Test Category,Test Name,Status,Value,Details\n';

    // Technical SEO
    if (this.results.technicalSEO) {
      Object.entries(this.results.technicalSEO).forEach(([key, value]) => {
        csvContent += `Technical SEO,${key},${value.status},${value.statusCode || 'N/A'},${value.message || ''}\n`;
      });
    }

    // Keywords
    if (this.results.keywords) {
      this.results.keywords.slice(0, 10).forEach(keyword => {
        csvContent += `Keywords,${keyword.keyword},${keyword.position <= 10 ? 'PASS' : 'WARN'},#${keyword.position},Search Volume: ${keyword.searchVolume}\n`;
      });
    }

    // Performance
    if (this.results.performance) {
      Object.entries(this.results.performance).forEach(([key, value]) => {
        csvContent += `Performance,${key},${value.status},${value.value} ${value.unit || ''},${value.message || ''}\n`;
      });
    }

    const reportPath = path.join(this.reportDir, `report-${Date.now()}.csv`);
    fs.writeFileSync(reportPath, csvContent);
    console.log(`📊 CSV Report: ${reportPath}`);
  }

  /**
   * Helper: Generate Technical SEO Metrics HTML
   */
  generateTechnicalSEOMetrics() {
    if (!this.results.technicalSEO) return '';
    return Object.entries(this.results.technicalSEO).map(([key, value]) => `
        <div class="metric-card ${value.status?.toLowerCase() || 'warn'}">
            <div class="metric-label">${key}</div>
            <div class="metric-value"><span class="status-badge status-${value.status?.toLowerCase() || 'warn'}">${value.status || 'UNKNOWN'}</span></div>
            <div style="font-size: 12px; color: #666; margin-top: 5px;">${value.message || ''}</div>
        </div>
    `).join('');
  }

  /**
   * Helper: Generate Performance Metrics HTML
   */
  generatePerformanceMetrics() {
    if (!this.results.performance) return '';
    return Object.entries(this.results.performance).map(([key, value]) => `
        <div class="metric-card ${value.status?.toLowerCase() || 'warn'}">
            <div class="metric-label">${key}</div>
            <div class="metric-value">${value.value} ${value.unit || ''}</div>
            <div style="font-size: 12px; color: #666; margin-top: 5px;">Threshold: ${value.threshold}</div>
        </div>
    `).join('');
  }

  /**
   * Helper: Generate Content Metrics HTML
   */
  generateContentMetrics() {
    if (!this.results.content) return '';
    return Object.entries(this.results.content).map(([key, value]) => {
      const statusClass = value.status ? value.status.toLowerCase() : 'warn';
      return `
        <div class="metric-card ${statusClass}">
            <div class="metric-label">${key}</div>
            <div class="metric-value"><span class="status-badge status-${statusClass}">${value.status || 'UNKNOWN'}</span></div>
            <div style="font-size: 12px; color: #666; margin-top: 5px;">${value.message || ''}</div>
        </div>
      `;
    }).join('');
  }

  /**
   * Helper: Generate Mobile Metrics HTML
   */
  generateMobileMetrics() {
    if (!this.results.mobile) return '';
    return Object.entries(this.results.mobile).map(([key, value]) => {
      const statusClass = value.status ? value.status.toLowerCase() : 'warn';
      return `
        <div class="metric-card ${statusClass}">
            <div class="metric-label">${key}</div>
            <div class="metric-value"><span class="status-badge status-${statusClass}">${value.status || 'UNKNOWN'}</span></div>
            <div style="font-size: 12px; color: #666; margin-top: 5px;">${value.message || ''}</div>
        </div>
      `;
    }).join('');
  }

  /**
   * Helper: Generate Keyword Table HTML
   */
  generateKeywordTable() {
    if (!this.results.keywords || this.results.keywords.length === 0) return '';
    
    return `
        <table>
            <thead>
                <tr>
                    <th>Keyword</th>
                    <th>Position</th>
                    <th>Search Volume</th>
                    <th>Trend</th>
                </tr>
            </thead>
            <tbody>
                ${this.results.keywords.slice(0, 20).map(kw => `
                    <tr>
                        <td>${kw.keyword}</td>
                        <td>#${kw.position}</td>
                        <td>${kw.searchVolume}</td>
                        <td>${kw.trend === 'up' ? '📈' : kw.trend === 'down' ? '📉' : '➡️'} ${kw.trend}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
  }
}

module.exports = ReportGenerator;
