/* ═══════════════════════════════════════════════
   IT Executive Dashboard — Frontend Controller
   ═══════════════════════════════════════════════ */

'use strict';

/* ─── Chart.js global defaults ─────────────────── */
Chart.defaults.font.family = "'Segoe UI', system-ui, sans-serif";
Chart.defaults.font.size   = 11;
Chart.defaults.color       = '#7f8c8d';
Chart.defaults.plugins.legend.position = 'bottom';

/* ─── Colors ────────────────────────────────────── */
const C = {
  good:     '#27ae60',
  warning:  '#e67e22',
  critical: '#e74c3c',
  medium:   '#f1c40f',
  accent:   '#2980b9',
  text:     '#2c3e50',
  muted:    '#7f8c8d',
  domain: {
    Applications:  '#3498db',
    Infrastructure:'#9b59b6',
    Network:       '#e67e22',
    Security:      '#27ae60',
    Databases:     '#1abc9c',
  }
};

function scoreColor(score) {
  if (score >= 90) return C.good;
  if (score >= 70) return C.warning;
  return C.critical;
}
function statusClass(score) {
  if (score >= 90) return 'good';
  if (score >= 70) return 'warning';
  return 'critical';
}

/* ─── Gauge Chart (Overall Health) ─────────────── */
let gaugeChart, statusChart, trendChart, alertDistChart, alertTimeChart;
const sparkCharts = {};

function createGauge(score) {
  const ctx = document.getElementById('gaugeChart');
  if (!ctx) return;
  if (gaugeChart) gaugeChart.destroy();
  const color = scoreColor(score);
  gaugeChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      datasets: [{
        data: [score, 100 - score],
        backgroundColor: [color, '#ecf0f1'],
        borderWidth: 0,
        circumference: 270,
        rotation: 225,
      }]
    },
    options: {
      cutout: '75%',
      responsive: true,
      maintainAspectRatio: true,
      plugins: { legend: { display: false }, tooltip: { enabled: false } },
      animation: { duration: 800, easing: 'easeOutQuart' },
    }
  });
}

function renderHealthScore(data) {
  document.getElementById('gaugeScore').textContent  = data.score;
  const statusEl = document.getElementById('gaugeStatus');
  statusEl.textContent  = data.status;
  statusEl.className    = `gauge-label ${statusClass(data.score)}`;
  const d = data.delta;
  document.getElementById('deltaValue').textContent =
    `vs yesterday ${d >= 0 ? '▲' : '▼'}${Math.abs(d)}`;
  document.getElementById('deltaValue').className =
    d >= 0 ? 'good' : 'critical';
  createGauge(data.score);
}

/* ─── Health by Domain ──────────────────────────── */
const DOMAIN_ICONS = {
  applications:  'grid',
  infrastructure:'server',
  network:       'git-branch',
  security:      'shield',
  databases:     'database',
};

function renderHealthByDomain(domains) {
  const grid = document.getElementById('domainGrid');
  grid.innerHTML = '';
  domains.forEach(d => {
    const col = scoreColor(d.score);
    const cls = statusClass(d.score);
    grid.innerHTML += `
      <div class="domain-item">
        <div class="domain-icon ${d.id}">
          <i data-feather="${DOMAIN_ICONS[d.id] || 'activity'}"></i>
        </div>
        <div class="domain-name">${d.name}</div>
        <div class="domain-score ${cls}">${d.score}</div>
        <div class="domain-status ${cls}">${d.status}</div>
        <div class="domain-spark"><canvas id="spark-${d.id}"></canvas></div>
      </div>`;
  });
  feather.replace();

  // Draw sparklines
  domains.forEach(d => {
    const ctx = document.getElementById(`spark-${d.id}`);
    if (!ctx) return;
    if (sparkCharts[d.id]) sparkCharts[d.id].destroy();
    const color = scoreColor(d.score);
    sparkCharts[d.id] = new Chart(ctx, {
      type: 'line',
      data: {
        labels: d.trend.map((_, i) => i),
        datasets: [{
          data: d.trend,
          borderColor: color,
          borderWidth: 1.5,
          pointRadius: 0,
          tension: 0.4,
          fill: false,
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { enabled: false } },
        scales: { x: { display: false }, y: { display: false } },
        animation: false,
        layout: { padding: 0 },
      }
    });
  });
}

/* ─── Top Alerts ────────────────────────────────── */
function renderAlerts(alerts) {
  document.getElementById('alertCountBadge').textContent = alerts.length;
  document.getElementById('alertBadge').textContent      = alerts.length;

  const icons = { critical: 'alert-circle', high: 'alert-triangle', medium: 'info' };
  document.getElementById('alertList').innerHTML = alerts.map(a => `
    <div class="alert-item">
      <i data-feather="${icons[a.severity] || 'alert-circle'}" class="alert-icon ${a.severity}"></i>
      <div class="alert-body">
        <div class="alert-severity ${a.severity}">${a.severityLabel}</div>
        <div class="alert-title">${a.title}</div>
        <div class="alert-source">${a.source}</div>
      </div>
      <div class="alert-time">${a.timeLabel}</div>
    </div>`).join('');
  feather.replace();
}

/* ─── System Status ─────────────────────────────── */
function renderSystemStatus(data) {
  document.getElementById('statusTotal').textContent = data.total;

  if (statusChart) statusChart.destroy();
  const ctx = document.getElementById('statusChart');
  statusChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Healthy', 'Warning', 'Critical'],
      datasets: [{
        data: [data.healthy, data.warning, data.critical],
        backgroundColor: [C.good, C.warning, C.critical],
        borderWidth: 2, borderColor: '#fff',
      }]
    },
    options: {
      cutout: '70%', responsive: true, maintainAspectRatio: true,
      plugins: { legend: { display: false }, tooltip: { enabled: true } },
      animation: { duration: 600 },
    }
  });

  document.getElementById('statusLegend').innerHTML = [
    { label: 'Healthy', count: data.healthy, pct: data.healthyPct, dot: C.good },
    { label: 'Warning', count: data.warning, pct: data.warningPct, dot: C.warning },
    { label: 'Critical', count: data.critical, pct: data.criticalPct, dot: C.critical },
  ].map(r => `
    <div class="status-leg-row">
      <span><span class="status-leg-dot" style="background:${r.dot}"></span>${r.label}</span>
      <span class="status-leg-count">${r.count} <span style="color:#bdc3c7">(${r.pct}%)</span></span>
    </div>`).join('');
}

/* ─── Health Trend Chart ────────────────────────── */
function renderHealthTrend(data) {
  if (trendChart) trendChart.destroy();
  const ctx = document.getElementById('trendChart');
  trendChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.labels,
      datasets: data.datasets.map(d => ({
        label: d.label,
        data: d.data,
        borderColor: d.color,
        backgroundColor: 'transparent',
        borderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 5,
        tension: 0.4,
      }))
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: {
          display: true,
          position: 'bottom',
          labels: { boxWidth: 10, padding: 12, font: { size: 11 } }
        }
      },
      scales: {
        x: { grid: { color: '#f0f2f5' }, ticks: { maxTicksLimit: 7 } },
        y: {
          min: 0, max: 100,
          grid: { color: '#f0f2f5' },
          ticks: { stepSize: 25 }
        }
      },
      animation: { duration: 600 },
    }
  });
}

/* ─── Applications Health ───────────────────────── */
const APP_ICONS = {
  'Mobile Banking':   'smartphone',
  'Internet Banking': 'monitor',
  'Payment Service':  'credit-card',
  'Core Banking':     'home',
  'ATM System':       'dollar-sign',
  'Customer Portal':  'users',
};

function renderTableHealth(tbodyId, items) {
  const tbody = document.getElementById(tbodyId);
  tbody.innerHTML = items.map(a => {
    const icon = APP_ICONS[a.name] || a.icon || 'activity';
    return `<tr>
      <td>
        <div class="app-name-cell">
          <i data-feather="${icon}"></i>
          <span>${a.name}</span>
        </div>
      </td>
      <td><span class="score-val ${statusClass(a.score)}">${a.score}</span></td>
      <td><span class="status-tag ${statusClass(a.score)}">${a.status}</span></td>
    </tr>`;
  }).join('');
  feather.replace();
}

/* ─── Alert Distribution ────────────────────────── */
function renderAlertDistribution(data) {
  document.getElementById('distTotal').textContent = data.total;

  if (alertDistChart) alertDistChart.destroy();
  const ctx = document.getElementById('alertDistChart');
  alertDistChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: data.items.map(i => i.label),
      datasets: [{
        data: data.items.map(i => i.count),
        backgroundColor: data.items.map(i => i.color),
        borderWidth: 2, borderColor: '#fff',
      }]
    },
    options: {
      cutout: '65%', responsive: true, maintainAspectRatio: true,
      plugins: { legend: { display: false }, tooltip: { enabled: true } },
      animation: { duration: 600 },
    }
  });

  document.getElementById('distLegend').innerHTML = data.items.map(i => `
    <div class="dist-item">
      <span><span class="dist-dot" style="background:${i.color}"></span>${i.label}</span>
      <span><strong>${i.count}</strong> <span style="color:#bdc3c7">(${i.pct}%)</span></span>
    </div>`).join('');
}

/* ─── Alerts Over Time ──────────────────────────── */
function renderAlertsOverTime(data) {
  if (alertTimeChart) alertTimeChart.destroy();
  const ctx = document.getElementById('alertTimeChart');
  alertTimeChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.labels,
      datasets: data.datasets.map(d => ({
        label: d.label,
        data: d.data,
        borderColor: d.color,
        backgroundColor: d.color + '33',
        fill: true,
        borderWidth: 1.5,
        pointRadius: 0,
        tension: 0.3,
      }))
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: {
          display: true, position: 'bottom',
          labels: { boxWidth: 8, padding: 8, font: { size: 10 } }
        }
      },
      scales: {
        x: { grid: { display: false }, ticks: { maxTicksLimit: 5, font: { size: 10 } } },
        y: { min: 0, grid: { color: '#f0f2f5' }, ticks: { stepSize: 5 } }
      },
      animation: { duration: 600 },
    }
  });
}

/* ─── Top Problem Areas ─────────────────────────── */
function renderTopProblems(problems) {
  const colorMap = { critical: C.critical, high: C.warning, medium: C.medium };
  document.getElementById('problemList').innerHTML = problems.map(p => `
    <div class="problem-item">
      <div class="problem-dot ${p.color}" style="background:${colorMap[p.color] || C.muted}"></div>
      <div class="problem-body">
        <div class="problem-name">${p.name}</div>
        <div class="problem-cat">${p.category}</div>
        <div class="problem-metric">${p.metric}: <strong>${p.value}</strong></div>
      </div>
      <div class="problem-arrow"><i data-feather="chevron-right"></i></div>
    </div>`).join('');
  feather.replace();
}

/* ─── Clock ─────────────────────────────────────── */
function updateClock() {
  const el = document.getElementById('topbarTime');
  const now = new Date();
  el.textContent = now.toLocaleTimeString('th-TH', {
    hour: '2-digit', minute: '2-digit', hour12: false
  }) + '\n' + now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

/* ─── Data Source Badge ─────────────────────────── */
function updateDataSourceBadge(meta) {
  const badge = document.getElementById('dataSourceBadge');
  const footer = document.getElementById('footerSource');
  if (meta?.dataSource === 'splunk') {
    badge.textContent = '● Splunk Live';
    badge.classList.add('splunk');
    footer.textContent = `Data provided by Splunk  (${meta.splunkHost || ''})`;
  } else {
    badge.textContent = '● Mock Data';
    badge.classList.remove('splunk');
    footer.textContent = 'Data provided by Mock Data';
  }
}

/* ─── Full Render ───────────────────────────────── */
function renderAll(d) {
  if (d.healthScore)          renderHealthScore(d.healthScore);
  if (d.healthByDomain)       renderHealthByDomain(d.healthByDomain);
  if (d.topAlerts)            renderAlerts(d.topAlerts);
  if (d.systemStatus)         renderSystemStatus(d.systemStatus);
  if (d.healthTrend)          renderHealthTrend(d.healthTrend);
  if (d.applicationsHealth)   renderTableHealth('appHealthBody', d.applicationsHealth);
  if (d.infrastructureHealth) renderTableHealth('infraHealthBody', d.infrastructureHealth);
  if (d.alertDistribution)    renderAlertDistribution(d.alertDistribution);
  if (d.alertsOverTime)       renderAlertsOverTime(d.alertsOverTime);
  if (d.topProblems)          renderTopProblems(d.topProblems);
  if (d.meta)                 updateDataSourceBadge(d.meta);
}

/* ─── Bootstrap ─────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  feather.replace();
  setInterval(updateClock, 1000);
  updateClock();

  // Render immediately with client mock (works with no backend)
  renderAll(generateClientMock());

  // Auto-refresh mock data every 60 seconds (simulate live updates)
  setInterval(() => renderAll(generateClientMock()), 60000);

  // Try to upgrade to live backend (Node.js) if available
  tryLiveBackend();
});

function tryLiveBackend() {
  // Quick health-check to see if Node.js backend is running
  fetch('/api/status', { signal: AbortSignal.timeout(2000) })
    .then(r => r.ok ? r.json() : null)
    .then(status => {
      if (!status) return;
      // Backend found — switch to WebSocket live mode
      const socket = io({
        transports: ['websocket', 'polling'],
        reconnectionAttempts: 5,
      });
      socket.on('connect', () => {
        document.getElementById('autoRefresh').textContent = '● Auto refresh: Live (WS)';
      });
      socket.on('metrics-update', renderAll);
    })
    .catch(() => {
      // No backend — continue with client mock (already rendering)
    });
}


/* ─── Client-side mock (zero backend needed) ──────── */
function jit(base, r = 3) { return Math.round(Math.max(0, Math.min(100, base + (Math.random() - .5) * r * 2))); }
function st(s)  { return s >= 90 ? 'Good' : s >= 70 ? 'Warning' : 'Critical'; }
function stc(s) { return s >= 90 ? 'good' : s >= 70 ? 'warning' : 'critical'; }

function generateClientMock() {
  const score = jit(92, 2);
  const now = Date.now();
  const labels = Array.from({ length: 13 }, (_, i) => {
    const t = new Date(now - (12 - i) * 5 * 60000);
    return t.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', hour12: false });
  });

  const domains = [
    { id: 'applications', name: 'Applications', base: 93 },
    { id: 'infrastructure', name: 'Infrastructure', base: 90 },
    { id: 'network', name: 'Network', base: 88 },
    { id: 'security', name: 'Security', base: 95 },
    { id: 'databases', name: 'Databases', base: 90 },
  ].map(d => {
    const s = jit(d.base, 2);
    return { ...d, score: s, status: st(s), color: stc(s),
      trend: Array.from({ length: 12 }, () => jit(d.base, 4)) };
  });

  const critical = Math.round(Math.random() * 3) + 4;
  const high     = Math.round(Math.random() * 4) + 7;
  const medium   = Math.round(Math.random() * 6) + 12;
  const distTotal = critical + high + medium;

  return {
    healthScore: { score, max: 100, status: st(score), delta: score - 86 },
    healthByDomain: domains,
    topAlerts: [
      { id: '1', severity: 'critical', severityLabel: 'CRITICAL', title: 'Database CPU usage is high', source: 'Core Banking DB Cluster', timeLabel: '2m ago' },
      { id: '2', severity: 'high',     severityLabel: 'HIGH',     title: 'Payment Gateway Error Rate is high', source: 'Payment Gateway Service', timeLabel: '4m ago' },
      { id: '3', severity: 'medium',   severityLabel: 'MEDIUM',   title: 'Network latency is high', source: 'Bangkok - Data Center Link', timeLabel: '7m ago' },
    ],
    systemStatus: {
      total: 128,
      healthy: 102, healthyPct: 80,
      warning: 18,  warningPct: 14,
      critical: 8,  criticalPct: 6,
    },
    healthTrend: {
      labels,
      datasets: [
        { label: 'Applications',   data: Array.from({ length: 13 }, () => jit(93, 4)), color: C.domain.Applications },
        { label: 'Infrastructure', data: Array.from({ length: 13 }, () => jit(90, 4)), color: C.domain.Infrastructure },
        { label: 'Network',        data: Array.from({ length: 13 }, () => jit(88, 4)), color: C.domain.Network },
        { label: 'Security',       data: Array.from({ length: 13 }, () => jit(95, 4)), color: C.domain.Security },
        { label: 'Databases',      data: Array.from({ length: 13 }, () => jit(90, 4)), color: C.domain.Databases },
      ]
    },
    applicationsHealth: [
      { name: 'Mobile Banking',   score: jit(96,2), icon: 'smartphone' },
      { name: 'Internet Banking', score: jit(94,2), icon: 'monitor'    },
      { name: 'Payment Service',  score: jit(72,3), icon: 'credit-card'},
      { name: 'Core Banking',     score: jit(89,2), icon: 'home'       },
      { name: 'ATM System',       score: jit(85,2), icon: 'dollar-sign'},
      { name: 'Customer Portal',  score: jit(93,2), icon: 'users'      },
    ].map(a => ({ ...a, status: st(a.score), color: stc(a.score) })),
    infrastructureHealth: [
      { name: 'Servers',          score: jit(92,2), icon: 'server'     },
      { name: 'Virtual Machines', score: jit(90,2), icon: 'layers'     },
      { name: 'Containers',       score: jit(88,2), icon: 'box'        },
      { name: 'Storage',          score: jit(91,2), icon: 'hard-drive' },
      { name: 'Backup Systems',   score: jit(95,2), icon: 'shield'     },
      { name: 'Data Centers',     score: jit(90,2), icon: 'database'   },
    ].map(a => ({ ...a, status: st(a.score), color: stc(a.score) })),
    alertDistribution: {
      total: distTotal,
      items: [
        { label: 'Critical', count: critical, pct: Math.round(critical / distTotal * 100), color: C.critical },
        { label: 'High',     count: high,     pct: Math.round(high / distTotal * 100),     color: C.warning  },
        { label: 'Medium',   count: medium,   pct: Math.round(medium / distTotal * 100),   color: C.medium   },
      ]
    },
    alertsOverTime: {
      labels,
      datasets: [
        { label: 'Critical', data: Array.from({ length: 13 }, () => Math.round(Math.random() * 4)),       color: C.critical },
        { label: 'High',     data: Array.from({ length: 13 }, () => Math.round(Math.random() * 8) + 2),   color: C.warning  },
        { label: 'Medium',   data: Array.from({ length: 13 }, () => Math.round(Math.random() * 10) + 5),  color: C.medium   },
      ]
    },
    topProblems: [
      { name: 'Core Banking DB Cluster', category: 'Database',    metric: 'CPU',        value: `${jit(92,3)}%`,    color: 'critical' },
      { name: 'Payment Gateway Service', category: 'Application', metric: 'Error Rate', value: `${(7 + Math.random() * 3).toFixed(1)}%`, color: 'high' },
      { name: 'Bangkok - DC Link',       category: 'Network',     metric: 'Latency',    value: `${Math.round(200 + Math.random() * 40)}ms`, color: 'medium' },
    ],
    meta: { dataSource: 'client-mock', generatedAt: new Date().toISOString() }
  };
}
