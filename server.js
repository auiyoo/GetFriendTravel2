const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');
const cron = require('node-cron');
const config = require('./config');
const mock = require('./services/mock-data');
const apiRouter = require('./routes/api');

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, { cors: { origin: '*' } });

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Inject config into every HTML response
app.use((req, res, next) => {
  res.locals.config = config;
  next();
});

// API routes
app.use('/api', apiRouter);

// Catch-all: serve index.html for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

/* ─── WebSocket: push metrics updates ───────────────────────── */
let latestMetrics = mock.getAllMetrics();

async function refreshMetrics() {
  if (config.splunk.enabled) {
    try {
      const splunk = require('./services/splunk');
      latestMetrics = {
        healthScore:          await splunk.getHealthScore(),
        healthByDomain:       await splunk.getHealthByDomain(),
        topAlerts:            await splunk.getTopAlerts(),
        systemStatus:         await splunk.getSystemStatus(),
        infrastructure:       mock.getInfrastructure(),
        healthTrend:          await splunk.getHealthTrend(),
        applicationsHealth:   await splunk.getApplicationsHealth(),
        infrastructureHealth: await splunk.getInfrastructureHealth(),
        alertDistribution:    await splunk.getAlertDistribution(),
        alertsOverTime:       await splunk.getAlertsOverTime(),
        topProblems:          await splunk.getTopProblems(),
        meta: { dataSource: 'splunk', generatedAt: new Date().toISOString(), refreshInterval: config.refreshInterval }
      };
    } catch (err) {
      console.warn('[WS] Splunk refresh failed:', err.message);
      latestMetrics = mock.getAllMetrics();
      latestMetrics.meta.dataSource = 'mock-fallback';
    }
  } else {
    latestMetrics = mock.getAllMetrics();
  }
  io.emit('metrics-update', latestMetrics);
  console.log(`[${new Date().toLocaleTimeString()}] Metrics refreshed — source: ${latestMetrics.meta?.dataSource || 'mock'}`);
}

// Schedule periodic refresh
const cronExpr = `*/${config.refreshInterval} * * * * *`;
cron.schedule(`0 */${Math.ceil(config.refreshInterval / 60)} * * * *`, refreshMetrics);

io.on('connection', (socket) => {
  console.log(`[WS] Client connected: ${socket.id}`);
  socket.emit('metrics-update', latestMetrics); // immediate snapshot on connect
  socket.on('disconnect', () => console.log(`[WS] Client disconnected: ${socket.id}`));
  socket.on('force-refresh', refreshMetrics);
});

httpServer.listen(config.port, () => {
  const src = config.splunk.enabled ? `Splunk (${config.splunk.host}:${config.splunk.port})` : 'Mock Data';
  console.log('');
  console.log('  ╔══════════════════════════════════════╗');
  console.log(`  ║  IT Dashboard  →  http://localhost:${config.port}  ║`);
  console.log(`  ║  Data source : ${src.padEnd(22)}║`);
  console.log(`  ║  Refresh     : every ${config.refreshInterval}s             ║`);
  console.log('  ╚══════════════════════════════════════╝');
  console.log('');
  refreshMetrics();
});
