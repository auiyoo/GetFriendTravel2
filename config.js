require('dotenv').config();

module.exports = {
  port: parseInt(process.env.PORT) || 3000,
  orgName: process.env.ORG_NAME || 'TrustBank',
  dashboardTitle: process.env.DASHBOARD_TITLE || 'Executive Overview',
  refreshInterval: parseInt(process.env.REFRESH_INTERVAL) || 60,

  splunk: {
    enabled: !!(process.env.SPLUNK_HOST && process.env.SPLUNK_HOST !== 'your-splunk-host.company.com'),
    host: process.env.SPLUNK_HOST || 'localhost',
    port: parseInt(process.env.SPLUNK_PORT) || 8089,
    username: process.env.SPLUNK_USERNAME || 'admin',
    password: process.env.SPLUNK_PASSWORD || '',
    token: process.env.SPLUNK_TOKEN || '',
    ssl: process.env.SPLUNK_SSL !== 'false',
    index: process.env.SPLUNK_INDEX || 'main',
    itsiEnabled: process.env.SPLUNK_ITSI === 'true',
  }
};
