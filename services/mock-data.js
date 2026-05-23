/**
 * Mock Data Generator
 * Generates realistic IT monitoring data with random variance.
 * Used when Splunk is not configured.
 */

function jitter(base, range = 3) {
  return Math.round(Math.max(0, Math.min(100, base + (Math.random() - 0.5) * range * 2)));
}

function status(score) {
  if (score >= 90) return 'Good';
  if (score >= 70) return 'Warning';
  return 'Critical';
}

function color(score) {
  if (score >= 90) return 'good';
  if (score >= 70) return 'warning';
  return 'critical';
}

function timeAgo(minutes) {
  return new Date(Date.now() - minutes * 60 * 1000).toISOString();
}

/* ─── Health Score ─────────────────────────────────────────── */
function getHealthScore() {
  const score = jitter(92, 2);
  const yesterday = jitter(86, 2);
  return { score, max: 100, status: status(score), delta: score - yesterday, deltaLabel: 'vs yesterday' };
}

/* ─── Health by Domain ──────────────────────────────────────── */
function getHealthByDomain() {
  const domains = [
    { id: 'applications', name: 'Applications', icon: 'grid', base: 93 },
    { id: 'infrastructure', name: 'Infrastructure', icon: 'server', base: 90 },
    { id: 'network', name: 'Network', icon: 'git-branch', base: 88 },
    { id: 'security', name: 'Security', icon: 'shield', base: 95 },
    { id: 'databases', name: 'Databases', icon: 'database', base: 90 },
  ];
  return domains.map(d => {
    const score = jitter(d.base, 2);
    const trend = Array.from({ length: 12 }, (_, i) => jitter(d.base - (12 - i) * 0.3, 4));
    return { ...d, score, status: status(score), color: color(score), trend };
  });
}

/* ─── Top Alerts ────────────────────────────────────────────── */
function getTopAlerts() {
  return [
    {
      id: 'alert-001', severity: 'critical', severityLabel: 'CRITICAL',
      title: 'Database CPU usage is high',
      source: 'Core Banking DB Cluster', sourceType: 'Databases',
      time: timeAgo(2), timeLabel: '2m ago',
    },
    {
      id: 'alert-002', severity: 'high', severityLabel: 'HIGH',
      title: 'Payment Gateway Error Rate is high',
      source: 'Payment Gateway Service', sourceType: 'Application',
      time: timeAgo(4), timeLabel: '4m ago',
    },
    {
      id: 'alert-003', severity: 'medium', severityLabel: 'MEDIUM',
      title: 'Network latency is high',
      source: 'Bangkok - Data Center Link', sourceType: 'Network',
      time: timeAgo(7), timeLabel: '7m ago',
    },
  ];
}

/* ─── System Status ─────────────────────────────────────────── */
function getSystemStatus() {
  const total = 128;
  const critical = Math.round(Math.random() * 3) + 6;
  const warning = Math.round(Math.random() * 4) + 16;
  const healthy = total - critical - warning;
  return {
    total,
    healthy, healthyPct: Math.round((healthy / total) * 100),
    warning, warningPct: Math.round((warning / total) * 100),
    critical, criticalPct: Math.round((critical / total) * 100),
  };
}

/* ─── Infrastructure Topology ───────────────────────────────── */
function getInfrastructure() {
  return {
    channels: ['Mobile / Web', 'ATM / Branch'],
    layers: [
      {
        name: 'Application Services',
        services: [
          { name: 'API Gateway', statusLeft: 'good', statusRight: 'good' },
          { name: 'Digital Banking', statusLeft: 'good', statusRight: 'good' },
          { name: 'Payment Service', statusLeft: 'warning', statusRight: 'warning' },
          { name: 'Other Services', statusLeft: 'good', statusRight: 'good' },
        ]
      },
      {
        name: 'Data Layer',
        services: [
          { name: 'Core Banking', statusLeft: 'critical', statusRight: 'critical' },
          { name: 'Databases', statusLeft: 'warning', statusRight: 'warning' },
          { name: 'Cache', statusLeft: 'good', statusRight: 'good' },
          { name: 'File Storage', statusLeft: 'good', statusRight: 'good' },
        ]
      },
      {
        name: 'External Systems',
        services: [
          { name: 'Payment Network', statusLeft: 'good', statusRight: null },
          { name: 'Credit Bureau', statusLeft: 'good', statusRight: null },
        ]
      }
    ]
  };
}

/* ─── Health Trend (last 1h, every 5 min) ───────────────────── */
function getHealthTrend() {
  const now = Date.now();
  const points = 13;
  const span = 5 * 60 * 1000;
  const labels = Array.from({ length: points }, (_, i) => {
    const t = new Date(now - (points - 1 - i) * span);
    return t.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', hour12: false });
  });

  const domains = [
    { key: 'Applications', base: 93, color: '#3498db' },
    { key: 'Infrastructure', base: 90, color: '#9b59b6' },
    { key: 'Network', base: 88, color: '#e67e22' },
    { key: 'Security', base: 95, color: '#27ae60' },
    { key: 'Databases', base: 90, color: '#1abc9c' },
  ];

  const datasets = domains.map(d => ({
    label: d.key,
    color: d.color,
    data: Array.from({ length: points }, () => jitter(d.base, 4)),
  }));

  return { labels, datasets };
}

/* ─── Applications Health ──────────────────────────────────── */
function getApplicationsHealth() {
  const apps = [
    { name: 'Mobile Banking', icon: 'smartphone', base: 96 },
    { name: 'Internet Banking', icon: 'monitor', base: 94 },
    { name: 'Payment Service', icon: 'credit-card', base: 72 },
    { name: 'Core Banking', icon: 'landmark', base: 89 },
    { name: 'ATM System', icon: 'dollar-sign', base: 85 },
    { name: 'Customer Portal', icon: 'users', base: 93 },
  ];
  return apps.map(a => {
    const score = jitter(a.base, 2);
    return { ...a, score, status: status(score), color: color(score) };
  });
}

/* ─── Infrastructure Health ─────────────────────────────────── */
function getInfrastructureHealth() {
  const items = [
    { name: 'Servers', icon: 'server', base: 92 },
    { name: 'Virtual Machines', icon: 'layers', base: 90 },
    { name: 'Containers', icon: 'box', base: 88 },
    { name: 'Storage', icon: 'hard-drive', base: 91 },
    { name: 'Backup Systems', icon: 'shield', base: 95 },
    { name: 'Data Centers', icon: 'database', base: 90 },
  ];
  return items.map(i => {
    const score = jitter(i.base, 2);
    return { ...i, score, status: status(score), color: color(score) };
  });
}

/* ─── Alert Distribution ────────────────────────────────────── */
function getAlertDistribution() {
  const critical = Math.round(Math.random() * 3) + 4;
  const high = Math.round(Math.random() * 4) + 7;
  const medium = Math.round(Math.random() * 6) + 12;
  const total = critical + high + medium;
  return {
    total,
    items: [
      { label: 'Critical', count: critical, pct: Math.round((critical / total) * 100), color: '#e74c3c' },
      { label: 'High', count: high, pct: Math.round((high / total) * 100), color: '#e67e22' },
      { label: 'Medium', count: medium, pct: Math.round((medium / total) * 100), color: '#f1c40f' },
    ]
  };
}

/* ─── Alerts Over Time ──────────────────────────────────────── */
function getAlertsOverTime() {
  const now = Date.now();
  const points = 13;
  const span = 5 * 60 * 1000;
  const labels = Array.from({ length: points }, (_, i) => {
    const t = new Date(now - (points - 1 - i) * span);
    return t.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', hour12: false });
  });
  const critical = Array.from({ length: points }, () => Math.round(Math.random() * 4));
  const high = Array.from({ length: points }, () => Math.round(Math.random() * 8) + 2);
  const medium = Array.from({ length: points }, () => Math.round(Math.random() * 10) + 5);
  return {
    labels,
    datasets: [
      { label: 'Critical', data: critical, color: '#e74c3c' },
      { label: 'High', data: high, color: '#e67e22' },
      { label: 'Medium', data: medium, color: '#f1c40f' },
    ]
  };
}

/* ─── Top Problem Areas ─────────────────────────────────────── */
function getTopProblems() {
  return [
    {
      name: 'Core Banking DB Cluster', category: 'Database',
      metric: 'CPU', value: `${jitter(92, 2)}%`, color: 'critical',
    },
    {
      name: 'Payment Gateway Service', category: 'Application',
      metric: 'Error Rate', value: `${(7 + Math.random() * 3).toFixed(1)}%`, color: 'high',
    },
    {
      name: 'Bangkok - DC Link', category: 'Network',
      metric: 'Latency', value: `${Math.round(200 + Math.random() * 40)}ms`, color: 'medium',
    },
  ];
}

/* ─── Full Snapshot (all panels) ───────────────────────────── */
function getAllMetrics() {
  return {
    healthScore: getHealthScore(),
    healthByDomain: getHealthByDomain(),
    topAlerts: getTopAlerts(),
    systemStatus: getSystemStatus(),
    infrastructure: getInfrastructure(),
    healthTrend: getHealthTrend(),
    applicationsHealth: getApplicationsHealth(),
    infrastructureHealth: getInfrastructureHealth(),
    alertDistribution: getAlertDistribution(),
    alertsOverTime: getAlertsOverTime(),
    topProblems: getTopProblems(),
    meta: {
      dataSource: 'mock',
      generatedAt: new Date().toISOString(),
      refreshInterval: 60,
    }
  };
}

module.exports = {
  getHealthScore, getHealthByDomain, getTopAlerts, getSystemStatus,
  getInfrastructure, getHealthTrend, getApplicationsHealth,
  getInfrastructureHealth, getAlertDistribution, getAlertsOverTime,
  getTopProblems, getAllMetrics,
};
