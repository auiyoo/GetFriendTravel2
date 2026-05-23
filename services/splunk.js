/**
 * Splunk REST API Client
 * Connects to Splunk via REST API and executes SPL searches.
 * Falls back to mock data when Splunk is not configured.
 */
const axios = require('axios');
const https = require('https');
const config = require('../config');

const httpsAgent = new https.Agent({ rejectUnauthorized: false });

class SplunkClient {
  constructor() {
    this.cfg = config.splunk;
    this.baseUrl = `${this.cfg.ssl ? 'https' : 'http'}://${this.cfg.host}:${this.cfg.port}`;
    this.sessionToken = null;
    this.authHeader = this._buildAuthHeader();
  }

  _buildAuthHeader() {
    if (this.cfg.token) return `Bearer ${this.cfg.token}`;
    const b64 = Buffer.from(`${this.cfg.username}:${this.cfg.password}`).toString('base64');
    return `Basic ${b64}`;
  }

  _req(method, path, data = null, params = {}) {
    return axios({
      method,
      url: `${this.baseUrl}${path}`,
      headers: { Authorization: this.authHeader, 'Content-Type': 'application/x-www-form-urlencoded' },
      params: { output_mode: 'json', ...params },
      data,
      httpsAgent,
      timeout: 30000,
    });
  }

  /* Run a blocking one-shot search and return rows */
  async search(spl) {
    // Create search job
    const jobRes = await this._req('post', '/services/search/jobs',
      new URLSearchParams({ search: `search ${spl}`, exec_mode: 'blocking' }).toString()
    );
    const sid = jobRes.data.sid;

    // Fetch results
    const res = await this._req('get', `/services/search/jobs/${sid}/results`, null, { count: 0 });
    return res.data.results || [];
  }

  /* Run time-series search (timechart) */
  async timechart(spl, earliest = '-1h', latest = 'now') {
    const rows = await this.search(`${spl} earliest=${earliest} latest=${latest}`);
    return rows;
  }

  async isConnected() {
    try {
      await this._req('get', '/services/server/info');
      return true;
    } catch { return false; }
  }
}

/* ─── SPL Query Library ─────────────────────────────────────── */
const splunkClient = new SplunkClient();

async function getHealthScore() {
  const cfg = config.splunk;
  const spl = cfg.itsiEnabled
    ? `index=itsi_summary earliest=-5m | stats avg(health_score) as score`
    : `index=${cfg.index} sourcetype=health_check earliest=-5m | stats avg(score) as score`;
  const rows = await splunkClient.search(spl);
  return rows.length ? parseFloat(rows[0].score) : null;
}

async function getHealthByDomain() {
  const cfg = config.splunk;
  const spl = cfg.itsiEnabled
    ? `index=itsi_summary earliest=-5m | stats avg(health_score) as score by domain | sort - score`
    : `index=${cfg.index} sourcetype=domain_health earliest=-5m | stats avg(score) as score by domain`;
  return splunkClient.search(spl);
}

async function getTopAlerts(limit = 10) {
  const cfg = config.splunk;
  const spl = cfg.itsiEnabled
    ? `index=notable earliest=-15m | head ${limit} | table _time, urgency, rule_title, orig_host, _cd`
    : `index=${cfg.index} sourcetype=alerts earliest=-15m severity IN (critical,high,medium) | head ${limit} | table _time, severity, title, source`;
  return splunkClient.search(spl);
}

async function getSystemStatus() {
  const cfg = config.splunk;
  const spl = `index=${cfg.index} sourcetype=system_status earliest=-5m | stats count by status`;
  return splunkClient.search(spl);
}

async function getHealthTrend(earliest = '-1h') {
  const cfg = config.splunk;
  const spl = cfg.itsiEnabled
    ? `index=itsi_summary earliest=${earliest} | timechart span=5m avg(health_score) by domain`
    : `index=${cfg.index} sourcetype=domain_health earliest=${earliest} | timechart span=5m avg(score) by domain`;
  return splunkClient.search(spl);
}

async function getApplicationsHealth() {
  const cfg = config.splunk;
  const spl = `index=${cfg.index} sourcetype=app_health earliest=-5m | stats avg(score) as score by app | eval status=case(score>=90,"Good",score>=70,"Warning",true(),"Critical") | sort - score`;
  return splunkClient.search(spl);
}

async function getInfrastructureHealth() {
  const cfg = config.splunk;
  const spl = `index=${cfg.index} sourcetype=infra_health earliest=-5m | stats avg(score) as score by component | eval status=case(score>=90,"Good",score>=70,"Warning",true(),"Critical") | sort - score`;
  return splunkClient.search(spl);
}

async function getAlertDistribution() {
  const cfg = config.splunk;
  const spl = cfg.itsiEnabled
    ? `index=notable earliest=-1h | stats count by urgency`
    : `index=${cfg.index} sourcetype=alerts earliest=-1h | stats count by severity`;
  return splunkClient.search(spl);
}

async function getAlertsOverTime(earliest = '-1h') {
  const cfg = config.splunk;
  const spl = cfg.itsiEnabled
    ? `index=notable earliest=${earliest} | timechart span=5m count by urgency`
    : `index=${cfg.index} sourcetype=alerts earliest=${earliest} | timechart span=5m count by severity`;
  return splunkClient.search(spl);
}

async function getTopProblems() {
  const cfg = config.splunk;
  const spl = cfg.itsiEnabled
    ? `index=notable earliest=-1h | stats count as alert_count, latest(rule_title) as title by orig_host | sort - alert_count | head 5`
    : `index=${cfg.index} sourcetype=alerts earliest=-1h | stats count as alert_count, latest(title) as title by source | sort - alert_count | head 5`;
  return splunkClient.search(spl);
}

module.exports = {
  splunkClient,
  getHealthScore,
  getHealthByDomain,
  getTopAlerts,
  getSystemStatus,
  getHealthTrend,
  getApplicationsHealth,
  getInfrastructureHealth,
  getAlertDistribution,
  getAlertsOverTime,
  getTopProblems,
};
