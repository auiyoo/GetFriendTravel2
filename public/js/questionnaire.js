'use strict';

const TOTAL = 8;
let currentSection = 1;

const STEPS = [
  'ข้อมูลองค์กร', 'วัตถุประสงค์', 'แหล่งข้อมูล',
  'โครงสร้าง IT', 'Dashboard', 'ความพร้อม',
  'งบประมาณ', 'พิเศษ'
];

/* ─── Init ──────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  buildSteps();
  restoreFromStorage();
  updateUI();
  attachAutoSave();
});

function buildSteps() {
  const row = document.getElementById('stepsRow');
  row.innerHTML = STEPS.map((label, i) => `
    <div class="q-step" id="step-${i+1}" onclick="jumpTo(${i+1})">
      <div class="step-num">${i+1}</div>
      <div class="step-label">${label}</div>
    </div>`).join('');
}

/* ─── Navigation ─────────────────────────────────── */
function nextSection() {
  if (!validateSection(currentSection)) return;
  if (currentSection < TOTAL) {
    currentSection++;
    updateUI();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

function prevSection() {
  if (currentSection > 1) {
    currentSection--;
    updateUI();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

function jumpTo(n) {
  if (n < currentSection || validateSection(currentSection)) {
    currentSection = n;
    updateUI();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

function updateUI() {
  // Sections visibility
  document.querySelectorAll('.q-section').forEach(s => {
    s.classList.toggle('active', +s.dataset.section === currentSection);
  });

  // Step indicators
  document.querySelectorAll('.q-step').forEach((el, i) => {
    el.classList.remove('active', 'done');
    if (i + 1 === currentSection) el.classList.add('active');
    if (i + 1 < currentSection)   el.classList.add('done');
  });

  // Progress bar
  document.getElementById('progressBar').style.width =
    ((currentSection / TOTAL) * 100) + '%';

  // Buttons
  document.getElementById('btnBack').style.visibility =
    currentSection === 1 ? 'hidden' : 'visible';
  document.getElementById('btnNext').style.display =
    currentSection < TOTAL ? 'block' : 'none';
  document.getElementById('btnSubmit').style.display =
    currentSection === TOTAL ? 'block' : 'none';

  // Section label
  document.getElementById('sectionLabel').textContent =
    `หมวดที่ ${currentSection} จาก ${TOTAL}`;
}

/* ─── Validation ─────────────────────────────────── */
function validateSection(n) {
  const section = document.querySelector(`.q-section[data-section="${n}"]`);
  let ok = true;

  // Clear previous errors
  section.querySelectorAll('.q-input, .q-textarea').forEach(el => {
    el.style.borderColor = '';
  });

  // Check required fields
  section.querySelectorAll('[required]').forEach(el => {
    if (!el.value.trim()) {
      el.style.borderColor = '#e74c3c';
      ok = false;
    }
  });

  // Check required radio groups
  section.querySelectorAll('.q-radios').forEach(group => {
    const label = group.closest('.q-group')?.querySelector('.q-label');
    if (label?.classList.contains('required')) {
      const checked = group.querySelector('input[type="radio"]:checked');
      if (!checked) {
        group.style.outline = '2px solid #e74c3c';
        group.style.borderRadius = '6px';
        ok = false;
      } else {
        group.style.outline = '';
      }
    }
  });

  // Check required checkbox groups
  section.querySelectorAll('.q-checks').forEach(group => {
    const label = group.closest('.q-group')?.querySelector('.q-label');
    if (label?.classList.contains('required')) {
      const checked = group.querySelector('input[type="checkbox"]:checked');
      if (!checked) {
        group.style.outline = '2px solid #e74c3c';
        group.style.borderRadius = '6px';
        ok = false;
      } else {
        group.style.outline = '';
      }
    }
  });

  if (!ok) {
    const firstErr = section.querySelector('[style*="border-color: rgb(231"]') ||
                     section.querySelector('[style*="outline"]');
    firstErr?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  return ok;
}

/* ─── KPI dynamic add ────────────────────────────── */
function addKpi() {
  const list = document.getElementById('kpiList');
  const idx  = list.children.length + 1;
  const div  = document.createElement('div');
  div.className = 'kpi-row';
  div.innerHTML = `<input type="text" class="q-input" name="kpi[]" placeholder="KPI ที่ ${idx}">`;
  list.appendChild(div);
}

/* ─── Auto-save to localStorage ─────────────────── */
function attachAutoSave() {
  document.getElementById('qForm').addEventListener('change', saveToStorage);
  document.getElementById('qForm').addEventListener('input', debounce(saveToStorage, 800));
}

function debounce(fn, ms) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
}

function saveToStorage() {
  const data = collectFormData();
  localStorage.setItem('it_dashboard_questionnaire', JSON.stringify(data));
  const badge = document.getElementById('saveBadge');
  badge.style.display = 'flex';
  setTimeout(() => { badge.style.display = 'none'; }, 2000);
}

function restoreFromStorage() {
  const saved = localStorage.getItem('it_dashboard_questionnaire');
  if (!saved) return;
  try {
    const data = JSON.parse(saved);
    const form = document.getElementById('qForm');
    Object.entries(data).forEach(([name, value]) => {
      if (Array.isArray(value)) {
        value.forEach(v => {
          const el = form.querySelector(`input[name="${name}"][value="${v}"]`);
          if (el) el.checked = true;
        });
      } else {
        const el = form.querySelector(`[name="${name}"]`);
        if (el) {
          if (el.type === 'radio') {
            const r = form.querySelector(`input[name="${name}"][value="${value}"]`);
            if (r) r.checked = true;
          } else {
            el.value = value;
          }
        }
      }
    });
  } catch {}
}

/* ─── Collect all form data ──────────────────────── */
function collectFormData() {
  const form = document.getElementById('qForm');
  const data = {};
  const fd   = new FormData(form);

  for (const [key, val] of fd.entries()) {
    if (key.endsWith('[]')) {
      const k = key.slice(0, -2);
      if (!data[k]) data[k] = [];
      if (val.trim()) data[k].push(val.trim());
    } else {
      if (val.trim()) data[key] = val.trim();
    }
  }

  // checkboxes (FormData only includes checked ones, so capture unchecked groups too)
  form.querySelectorAll('input[type="checkbox"]').forEach(cb => {
    if (cb.checked && cb.name && !cb.name.endsWith('[]')) {
      if (!data[cb.name]) data[cb.name] = [];
      data[cb.name].push(cb.value);
    }
  });

  data._submittedAt = new Date().toISOString();
  return data;
}

/* ─── Submit & Generate Plan ─────────────────────── */
function submitForm() {
  if (!validateSection(currentSection)) return;
  const data = collectFormData();
  saveToStorage();
  const plan = generatePlan(data);
  document.getElementById('resultBody').innerHTML = plan;
  document.getElementById('resultModal').style.display = 'flex';
  document.body.style.overflow = 'hidden';
  window._lastData = data;
}

function closeModal() {
  document.getElementById('resultModal').style.display = 'none';
  document.body.style.overflow = '';
}

/* ─── Dashboard Plan Generator ───────────────────── */
function generatePlan(d) {
  const orgName = d.orgName || 'องค์กรของคุณ';
  const kpis    = (d.kpi || []).filter(Boolean);

  // Scoring: complexity, readiness, urgency
  const hasSplunk = (d.systems || []).includes('splunk');
  const hasManySource = ['4-6', '6+'].includes(d.sourceSystems);
  const budgetHigh = ['1m-3m', '>3m'].includes(d.budget);
  const timeline  = d.timeline || 'tbd';
  const maturity  = parseInt(d.dataMaturity) || 2;
  const dashTypes = d.dashType || [];
  const tools     = d.tool    || [];

  // Recommend tool
  let recTool = 'Power BI หรือ Looker Studio';
  if (hasSplunk)                 recTool = 'Splunk Dashboard + ITSI';
  else if (tools.includes('grafana'))  recTool = 'Grafana';
  else if (tools.includes('powerbi'))  recTool = 'Microsoft Power BI';
  else if (tools.includes('tableau'))  recTool = 'Tableau';
  else if (tools.includes('custom'))   recTool = 'Custom Web Dashboard (React/Vue)';
  else if (!budgetHigh && maturity <= 2) recTool = 'Looker Studio (Google) — ประหยัดงบ';

  // Timeline phases
  const phaseMap = {
    '1-3m':  ['Discovery (2w)', 'Build MVP (6w)', 'UAT & Launch (2w)'],
    '3-6m':  ['Discovery & Design (1m)', 'Data Integration (2m)', 'Dashboard Build (1m)', 'UAT (2w)', 'Go-Live'],
    '6-12m': ['Discovery (1m)', 'Data Governance (2m)', 'Integration (3m)', 'Build & Test (3m)', 'Training & Go-Live'],
    '>1y':   ['Assessment (2m)', 'Architecture (2m)', 'Phase 1 (4m)', 'Phase 2 (6m)', 'Continuous Improvement'],
    'tbd':   ['กำหนดร่วมกัน', 'ตามความพร้อม', 'แบบ Agile Sprint'],
  };
  const phases = phaseMap[timeline] || phaseMap['tbd'];

  // Recommendations
  const recs = [];
  if ((d.dataProblems || []).includes('scattered'))
    recs.push({ priority: 'high', title: 'ต้องทำ Data Integration ก่อน', detail: 'ข้อมูลกระจายหลายระบบ ควรสร้าง Data Pipeline รวมข้อมูลก่อน Build Dashboard' });
  if ((d.dataProblems || []).includes('inaccurate'))
    recs.push({ priority: 'high', title: 'Data Quality Cleanup', detail: 'ข้อมูลไม่ถูกต้อง ต้องกำหนด Data Governance และ Validation Rules' });
  if (hasSplunk)
    recs.push({ priority: 'medium', title: 'ใช้ Splunk ITSI + Dashboard Studio', detail: 'มี Splunk อยู่แล้ว — ต่อยอดด้วย ITSI Health Score + Alert Correlation ได้ทันที' });
  if (d.rbac === 'yes')
    recs.push({ priority: 'medium', title: 'ออกแบบ Role & Permission Matrix', detail: 'ต้องกำหนดสิทธิ์ก่อน Build — วางโครงสร้าง User, Role, Data Access ให้ชัดเจน' });
  if (maturity <= 2)
    recs.push({ priority: 'low', title: 'จัด Data Literacy Training', detail: 'ทีมงานยังใหม่กับ Data — ควร Train ผู้ใช้คู่กับการ Deploy Dashboard' });
  if ((d.alert || []).includes('line'))
    recs.push({ priority: 'medium', title: 'เชื่อมต่อ LINE Notify / LINE OA', detail: 'ตั้งค่า Webhook จาก Dashboard → LINE เพื่อส่ง Alert Real-time' });
  if (recs.length === 0)
    recs.push({ priority: 'low', title: 'เริ่มต้น MVP ได้เลย', detail: 'ความพร้อมองค์กรดี สามารถเริ่ม Dashboard แรกได้ภายใน 4–6 สัปดาห์' });

  const recHTML = recs.map(r => `
    <div class="rec-card priority-${r.priority}">
      <div class="rec-title">${r.title}</div>
      <div class="rec-detail">${r.detail}</div>
    </div>`).join('');

  const phaseHTML = phases.map((p, i) => `
    <div class="timeline-bar">
      <div class="tl-phase" style="background:${['#2980b9','#8e44ad','#27ae60','#e67e22','#1abc9c'][i%5]}">
        ${p}
      </div>
      ${i < phases.length - 1 ? '<span class="tl-arrow">→</span>' : ''}
    </div>`).join('');

  const kpiTagHTML = kpis.length
    ? `<div class="kpi-tags">${kpis.map(k => `<span class="kpi-tag">${k}</span>`).join('')}</div>`
    : '<p style="color:#7f8c8d;font-size:13px">ยังไม่ได้ระบุ KPI</p>';

  const dashTypeLabel = {
    executive: 'Executive Dashboard', operational: 'Operational Dashboard',
    financial: 'Financial Dashboard', sales: 'Sales Dashboard',
    hr: 'HR Dashboard', it: 'IT Infrastructure Dashboard',
  };
  const dashTypeList = dashTypes.map(t => dashTypeLabel[t] || t).join(', ') || 'ยังไม่ระบุ';

  return `
    <div class="result-org">
      <div class="result-org-name">${orgName}</div>
      <div class="result-org-sub">แผน IT Dashboard — สร้างเมื่อ ${new Date().toLocaleDateString('th-TH', { day:'numeric', month:'long', year:'numeric' })}</div>
    </div>

    <div class="result-section">
      <h3>📌 ข้อมูลสรุป</h3>
      <div class="result-grid">
        <div class="result-item">
          <div class="result-item-label">ขนาดองค์กร</div>
          <div class="result-item-value">${d.empCount || '-'} คน / ${d.branches || '-'} สาขา</div>
        </div>
        <div class="result-item">
          <div class="result-item-label">ระบบต้นทาง</div>
          <div class="result-item-value">${d.sourceSystems || '-'} ระบบ</div>
        </div>
        <div class="result-item">
          <div class="result-item-label">งบประมาณ</div>
          <div class="result-item-value">${d.budget || 'ยังไม่ระบุ'}</div>
        </div>
        <div class="result-item">
          <div class="result-item-label">ระยะเวลา</div>
          <div class="result-item-value">${d.timeline || 'ยังไม่ระบุ'}</div>
        </div>
      </div>
    </div>

    <div class="result-section">
      <h3>🎯 Dashboard ที่แนะนำ</h3>
      <div class="result-grid">
        <div class="result-item">
          <div class="result-item-label">Tool / Platform</div>
          <div class="result-item-value" style="color:#2980b9">${recTool}</div>
        </div>
        <div class="result-item">
          <div class="result-item-label">ประเภท Dashboard</div>
          <div class="result-item-value">${dashTypeList}</div>
        </div>
        <div class="result-item">
          <div class="result-item-label">ความถี่ Refresh</div>
          <div class="result-item-value">${d.refreshRate || '-'}</div>
        </div>
        <div class="result-item">
          <div class="result-item-label">Role-based Access</div>
          <div class="result-item-value">${d.rbac === 'yes' ? '✓ ต้องการ' : '— ไม่จำเป็น'}</div>
        </div>
      </div>
    </div>

    <div class="result-section">
      <h3>📊 KPI ที่ต้องการติดตาม</h3>
      ${kpiTagHTML}
    </div>

    <div class="result-section">
      <h3>⚡ คำแนะนำสำคัญ</h3>
      <div class="rec-cards">${recHTML}</div>
    </div>

    <div class="result-section">
      <h3>🗓 แนวทาง Timeline</h3>
      ${phaseHTML}
    </div>

    <div class="result-section">
      <h3>📋 ขั้นตอนถัดไป</h3>
      <div class="result-item" style="background:#fff;border:1px solid #dce3ea;border-radius:8px;padding:16px">
        <ol style="padding-left:18px;line-height:2;font-size:13px">
          <li>นัด Workshop สรุป Requirements ให้ละเอียดขึ้น (1–2 วัน)</li>
          <li>ออกแบบ Data Architecture และ Source Systems Integration</li>
          <li>สร้าง Prototype / Mockup Dashboard ให้ลูกค้า Approve</li>
          <li>พัฒนา MVP (Minimum Viable Product) — ${phases[0]}</li>
          <li>ทดสอบและ Train ผู้ใช้งาน</li>
          <li>Go-Live และ Support ระยะ Hypercare</li>
        </ol>
      </div>
    </div>`;
}

/* ─── Download JSON ──────────────────────────────── */
function downloadJSON() {
  const data = window._lastData || collectFormData();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `dashboard-requirements-${data.orgName || 'org'}-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
