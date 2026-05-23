const express = require('express');
const router = express.Router();
const config = require('../config');
const mock = require('../services/mock-data');

// Use Splunk if configured, otherwise fall back to mock
async function getData(mockFn, splunkFn) {
  if (config.splunk.enabled && splunkFn) {
    try {
      const splunk = require('../services/splunk');
      const data = await splunkFn(splunk);
      if (data !== null && data !== undefined) return data;
    } catch (err) {
      console.warn('[Splunk] Query failed, using mock data:', err.message);
    }
  }
  return mockFn();
}

router.get('/health-score',        async (_, res) => res.json(await getData(mock.getHealthScore,        s => s.getHealthScore())));
router.get('/health-by-domain',    async (_, res) => res.json(await getData(mock.getHealthByDomain,    s => s.getHealthByDomain())));
router.get('/alerts',              async (_, res) => res.json(await getData(mock.getTopAlerts,         s => s.getTopAlerts())));
router.get('/system-status',       async (_, res) => res.json(await getData(mock.getSystemStatus,      s => s.getSystemStatus())));
router.get('/infrastructure',      async (_, res) => res.json(await getData(mock.getInfrastructure,    null)));
router.get('/health-trend',        async (_, res) => res.json(await getData(mock.getHealthTrend,       s => s.getHealthTrend())));
router.get('/applications',        async (_, res) => res.json(await getData(mock.getApplicationsHealth, s => s.getApplicationsHealth())));
router.get('/infrastructure-health', async (_, res) => res.json(await getData(mock.getInfrastructureHealth, s => s.getInfrastructureHealth())));
router.get('/alert-distribution',  async (_, res) => res.json(await getData(mock.getAlertDistribution, s => s.getAlertDistribution())));
router.get('/alerts-over-time',    async (_, res) => res.json(await getData(mock.getAlertsOverTime,   s => s.getAlertsOverTime())));
router.get('/top-problems',        async (_, res) => res.json(await getData(mock.getTopProblems,      s => s.getTopProblems())));

// Single endpoint for full dashboard snapshot (faster initial load)
router.get('/snapshot', async (_, res) => {
  res.json({
    healthScore:       await getData(mock.getHealthScore,         s => s.getHealthScore()),
    healthByDomain:    await getData(mock.getHealthByDomain,      s => s.getHealthByDomain()),
    topAlerts:         await getData(mock.getTopAlerts,           s => s.getTopAlerts()),
    systemStatus:      await getData(mock.getSystemStatus,        s => s.getSystemStatus()),
    infrastructure:    await getData(mock.getInfrastructure,      null),
    healthTrend:       await getData(mock.getHealthTrend,         s => s.getHealthTrend()),
    applicationsHealth: await getData(mock.getApplicationsHealth, s => s.getApplicationsHealth()),
    infrastructureHealth: await getData(mock.getInfrastructureHealth, s => s.getInfrastructureHealth()),
    alertDistribution: await getData(mock.getAlertDistribution,   s => s.getAlertDistribution()),
    alertsOverTime:    await getData(mock.getAlertsOverTime,      s => s.getAlertsOverTime()),
    topProblems:       await getData(mock.getTopProblems,         s => s.getTopProblems()),
    meta: {
      dataSource: config.splunk.enabled ? 'splunk' : 'mock',
      splunkHost: config.splunk.enabled ? config.splunk.host : null,
      generatedAt: new Date().toISOString(),
      refreshInterval: config.refreshInterval,
    }
  });
});

// Status / health-check
router.get('/status', async (_, res) => {
  let splunkConnected = false;
  if (config.splunk.enabled) {
    try {
      const { splunkClient } = require('../services/splunk');
      splunkConnected = await splunkClient.isConnected();
    } catch {}
  }
  res.json({
    server: 'ok',
    dataSource: config.splunk.enabled ? 'splunk' : 'mock',
    splunkEnabled: config.splunk.enabled,
    splunkConnected,
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
