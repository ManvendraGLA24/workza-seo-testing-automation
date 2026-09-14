module.exports = {
  // Website configuration
  website: {
    url: 'https://workza.ai',
    name: 'Workza.ai'
  },

  // Target keywords
  keywords: [
    'HRMS platform',
    'employee management system',
    'payroll software',
    'HR management',
    'workforce management',
    'attendance tracking',
    'leave management'
  ],

  // API Keys and Credentials
  apis: {
    googleSearchConsole: process.env.GSC_API_KEY,
    semrush: process.env.SEMRUSH_API_KEY,
    ahrefs: process.env.AHREFS_API_KEY,
    moz: process.env.MOZ_API_KEY
  },

  // Performance thresholds
  performance: {
    lcp: 2500,        // Largest Contentful Paint (ms)
    fid: 100,         // First Input Delay (ms)
    cls: 0.1,         // Cumulative Layout Shift
    pageLoadTime: 3000 // Total page load time (ms)
  },

  // SEO targets
  seo: {
    minDomainAuthority: 30,
    minBacklinks: 100,
    minKeywordRankings: 50
  },

  // Scheduling
  schedule: {
    dailyTests: '0 0 * * *',      // Daily at midnight
    weeklyReports: '0 0 * * 0',   // Weekly on Sunday
    monthlyAnalysis: '0 0 1 * *'  // Monthly on 1st
  },

  // Notification settings
  notifications: {
    email: process.env.NOTIFICATION_EMAIL,
    slack: process.env.SLACK_WEBHOOK,
    discord: process.env.DISCORD_WEBHOOK
  }
};
