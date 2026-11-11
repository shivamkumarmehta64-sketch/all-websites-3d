import * as THREE from 'three';

const GITHUB_USER = 'shivamkumarmehta64-sketch';
const CACHE_TTL_MS = 10 * 60 * 1000;

const PROJECTS = [
  {
    id: 'metshield-ai',
    name: 'MetShield-AI',
    repo: 'MetShield-AI',
    filter: 'web',
    domainLabel: 'MoES / IMD Real-Time QC',
    statusText: 'SIH 2026 · LIVE',
    statusColor: '#10b981',
    statusBg: 'rgba(16, 185, 129, 0.12)',
    iconClass: 'fa-solid fa-shield-halved',
    summary:
      'Real-time 3-tier quality control and Explainable AI anomaly detection for Automatic Weather Stations, compliant with WMO-No. 8 meteorological limits.',
    highlights: [
      'Tier 1–3 QC checks separating convective storms (ΔP + ΔRH) from thermistor faults',
      'Live Web Sensors API barometer fallback & moving-average packet imputation',
      'Official NIC/IMD formatted CSV audit log export on Vercel edge deployment'
    ],
    tech: ['Next.js', 'TypeScript', 'Recharts', 'WMO-No. 8', 'Vercel'],
    runtime: 'Next.js / Edge',
    footprint: 'Web App (Live)',
    platform: 'Web / Mobile',
    defaultStars: 1,
    defaultForks: 0,
    defaultVersion: 'SIH26073',
    website: 'https://aws2026-nu.vercel.app',
    github: `https://github.com/${GITHUB_USER}/MetShield-AI`,
    iconImg: 'assets/jatayu-seal.jpg',
    detailImg: 'assets/metshield-architecture.png',
    architecture:
      'Streams 20 simulated AWS telemetry nodes with a sliding ring-buffer persistence layer, Web Generic Sensor API barometric ingestion, and a 3-tier WMO-No. 8 thermodynamic storm-vs-spike classifier.'
  },
  {
    id: 'black-browser',
    name: 'Black Browser',
    repo: 'Black-Firefox',
    filter: 'desktop',
    domainLabel: 'Privacy-First Windows Browser',
    statusText: 'v9.1.0 SETUP',
    statusColor: '#38bdf8',
    statusBg: 'rgba(56, 189, 248, 0.12)',
    iconClass: 'fa-solid fa-globe',
    summary:
      'Fast, privacy-first native Windows 10/11 browser (~460 KB executable, <60 MB RAM) engineered in C# (.NET 4.8) + Microsoft WebView2 with zero cloud telemetry.',
    highlights: [
      '3-Layer AdShield (domain blocking, YouTube payload stripping & auto-skip)',
      'Windows DPAPI local password vault, bookmarks, QR share & MV2 extensions',
      'Signed-hash v9.1.0 Setup.exe & Portable ZIP + black://home Speed Dial'
    ],
    tech: ['C#', '.NET 4.8', 'WebView2', 'WinForms', 'AdShield', 'MIT'],
    runtime: 'C# / .NET 4.8',
    footprint: '~460 KB · <60 MB RAM',
    platform: 'Windows 10 / 11',
    defaultStars: 1,
    defaultForks: 0,
    defaultVersion: 'v9.1.0',
    website: 'https://shivamkumarmehta64-sketch.github.io/Black-Firefox/',
    github: `https://github.com/${GITHUB_USER}/Black-Firefox`,
    iconImg: 'assets/black-firefox-icon.png',
    detailImg: null,
    architecture:
      'Native WinForms shell hosting evergreen WebView2 runtime with custom ChromePainter dark glass chrome, 3-layer AdShield interceptor, DPAPI-encrypted local vault, and SHA-256 verified CI releases.'
  },
  {
    id: 'blacktube',
    name: 'BlackTube',
    repo: 'BlackTube',
    filter: 'desktop',
    domainLabel: 'Ad-Free Desktop Client',
    statusText: 'WINDOWS CLIENT',
    statusColor: '#f87171',
    statusBg: 'rgba(248, 113, 113, 0.12)',
    iconClass: 'fa-brands fa-youtube',
    summary:
      'Lightweight, distraction-free YouTube desktop client engineered in C# (.NET 4.8) and Microsoft WebView2 with zero telemetry and minimal RAM consumption.',
    highlights: [
      'Pure desktop playback without heavy Chromium/Electron memory overhead',
      'Built as companion media app to the Black Browser Windows ecosystem',
      'Clean native window chrome focused on low latency and privacy'
    ],
    tech: ['C#', '.NET 4.8', 'WebView2', 'WinForms', 'Zero Telemetry'],
    runtime: 'C# / .NET 4.8',
    footprint: 'Minimal RAM',
    platform: 'Windows x64',
    defaultStars: 0,
    defaultForks: 0,
    defaultVersion: 'v1.0 Source',
    website: null,
    github: `https://github.com/${GITHUB_USER}/BlackTube`,
    iconImg: 'assets/blacktube-icon.ico',
    detailImg: null,
    architecture:
      'Native Windows WebView2 container stripping ad scripts and telemetry endpoints while preserving hardware-accelerated video playback.'
  },
  {
    id: 'aerotech',
    name: 'aerotech',
    repo: 'aerotech',
    isPrivate: true,
    filter: 'security',
    domainLabel: 'Digital Forensics Platform',
    statusText: 'BIHAR PS-02',
    statusColor: '#a78bfa',
    statusBg: 'rgba(167, 139, 250, 0.12)',
    iconClass: 'fa-solid fa-user-secret',
    summary:
      'Autonomous Android APK Security & Digital Forensic Triage Platform built for Bihar Cybercrime Hackathon 2026 (PS-02), with ed25519 custody proofs and STIX 2.1 output.',
    highlights: [
      'Automated APK manifest, permission abuse, and DEX indicator triage',
      'Ed25519 signed forensic evidence packages aligned with BSA-2023 compliance',
      'STIX 2.1 threat intelligence export and analyst case-comparison dashboard'
    ],
    tech: ['Python', 'Streamlit', 'Android Forensics', 'ed25519', 'STIX 2.1'],
    runtime: 'Python / Streamlit',
    footprint: 'Private Case Repo',
    platform: 'Forensic Workstation',
    defaultStars: 0,
    defaultForks: 0,
    defaultVersion: 'Hackathon PS-02',
    website: null,
    github: `https://github.com/${GITHUB_USER}/aerotech`,
    iconImg: null,
    detailImg: 'assets/aerotech-dashboard.png',
    architecture:
      'Python triage pipeline decompiling suspicious APKs, scoring behavioral permissions, sealing hash manifests via ed25519 keys, and exporting STIX 2.1 IOC bundles.'
  }
];

const liveCache = new Map();
let activeFilter = 'all';

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function sanitizeHttpUrl(url) {
  if (!url || typeof url !== 'string') return null;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:' ? parsed.href : null;
  } catch {
    return null;
  }
}

function formatBytes(bytes) {
  if (!bytes || Number.isNaN(bytes)) return '';
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

async function fetchRepoTelemetry(project) {
  if (project.isPrivate) {
    const data = {
      stars: project.defaultStars,
      forks: project.defaultForks,
      version: project.defaultVersion,
      downloadUrl: null,
      assetName: null,
      assetSize: ''
    };
    liveCache.set(project.id, data);
    return data;
  }

  const cacheKey = `portfolio_v3_${project.repo}`;
  try {
    const cachedRaw = localStorage.getItem(cacheKey);
    if (cachedRaw) {
      const parsed = JSON.parse(cachedRaw);
      if (Date.now() - parsed.ts < CACHE_TTL_MS) {
        liveCache.set(project.id, parsed.data);
        return parsed.data;
      }
    }
  } catch {
    // Ignore storage read errors
  }

  const fallback = {
    stars: project.defaultStars,
    forks: project.defaultForks,
    version: project.defaultVersion,
    downloadUrl: null,
    assetName: null,
    assetSize: ''
  };

  try {
    const [repoRes, relRes] = await Promise.allSettled([
      fetch(`https://api.github.com/repos/${GITHUB_USER}/${project.repo}`),
      fetch(`https://api.github.com/repos/${GITHUB_USER}/${project.repo}/releases/latest`)
    ]);

    const data = { ...fallback };
    if (repoRes.status === 'fulfilled' && repoRes.value.ok) {
      const repoJson = await repoRes.value.json();
      data.stars = repoJson.stargazers_count ?? data.stars;
      data.forks = repoJson.forks_count ?? data.forks;
    }
    if (relRes.status === 'fulfilled' && relRes.value.ok) {
      const relJson = await relRes.value.json();
      if (relJson.tag_name) data.version = relJson.tag_name;
      if (Array.isArray(relJson.assets) && relJson.assets.length > 0) {
        const primary =
          relJson.assets.find(a => /-setup\.exe$/i.test(a.name)) ||
          relJson.assets.find(a => /\.exe$/i.test(a.name)) ||
          relJson.assets.find(a => /\.zip$/i.test(a.name)) ||
          relJson.assets[0];
        const zipAsset = relJson.assets.find(a => /\.zip$/i.test(a.name));
        const shaAsset = relJson.assets.find(a => /sha256/i.test(a.name));
        data.downloadUrl = sanitizeHttpUrl(primary.browser_download_url);
        data.assetName = primary.name || 'Release';
        data.assetSize = formatBytes(primary.size);
        data.zipUrl = zipAsset ? sanitizeHttpUrl(zipAsset.browser_download_url) : null;
        data.shaUrl = shaAsset ? sanitizeHttpUrl(shaAsset.browser_download_url) : null;
      }
    }

    liveCache.set(project.id, data);
    try {
      localStorage.setItem(cacheKey, JSON.stringify({ ts: Date.now(), data }));
    } catch {
      // Ignore storage quota errors
    }
    return data;
  } catch {
    liveCache.set(project.id, fallback);
    return fallback;
  }
}

function showToast(message) {
  const toast = document.getElementById('toast');
  const toastText = document.getElementById('toast-text');
  if (!toast || !toastText) return;
  toastText.textContent = message;
  toast.classList.add('show');
  window.clearTimeout(showToast._timer);
  showToast._timer = window.setTimeout(() => toast.classList.remove('show'), 2500);
}

// ---------------------------------------------------------------------------
// Modal (Live Preview & Case Study)
// ---------------------------------------------------------------------------
const modal = document.getElementById('app-modal');
const modalTitle = document.getElementById('modal-title-text');
const modalBody = document.getElementById('modal-body');
const modalExternal = document.getElementById('modal-external-link');
const modalCloseBtn = document.getElementById('modal-close-btn');

function closeModal() {
  if (!modal) return;
  modal.classList.remove('open');
  modalBody.innerHTML = '';
}

function openPreviewModal(project) {
  const safeUrl = sanitizeHttpUrl(project.website);
  if (!safeUrl || !modal) return;
  modalTitle.innerHTML = `<i class="${escapeHtml(project.iconClass)}" style="color: ${escapeHtml(project.statusColor)};"></i> ${escapeHtml(project.name)} — Live Preview`;
  modalExternal.href = safeUrl;
  modalExternal.style.display = 'inline-flex';
  modalBody.style.padding = '0';
  modalBody.innerHTML = `<iframe class="preview-frame" src="${safeUrl}" title="${escapeHtml(project.name)} live preview" loading="lazy"></iframe>`;
  modal.classList.add('open');
}

function openDetailsModal(project) {
  if (!modal) return;
  const meta = liveCache.get(project.id) || {};
  const safeWeb = sanitizeHttpUrl(project.website);
  const safeDl = sanitizeHttpUrl(meta.downloadUrl);
  const safeGh = sanitizeHttpUrl(project.github);

  modalTitle.innerHTML = `<i class="${escapeHtml(project.iconClass)}" style="color: ${escapeHtml(project.statusColor)};"></i> ${escapeHtml(project.name)}`;
  if (safeWeb) {
    modalExternal.href = safeWeb;
    modalExternal.style.display = 'inline-flex';
  } else {
    modalExternal.style.display = 'none';
  }

  modalBody.style.padding = '1.35rem';
  modalBody.innerHTML = `
    ${project.detailImg ? `<img src="${escapeHtml(project.detailImg)}" alt="${escapeHtml(project.name)} visual overview" style="width: 100%; max-height: 360px; object-fit: cover; object-position: top; border-radius: 12px; border: 1px solid var(--border); margin-bottom: 1.15rem;" />` : ''}
    <p style="color: var(--text-secondary); margin-bottom: 1rem;">${escapeHtml(project.summary)}</p>
    <div style="padding: 1rem; border-radius: 10px; border: 1px solid var(--border); background: rgba(255,255,255,0.02); margin-bottom: 1rem;">
      <div class="mono" style="color: var(--emerald); margin-bottom: 0.35rem;">ARCHITECTURE &amp; PIPELINE</div>
      <p style="font-size: 0.9rem; color: var(--text-secondary);">${escapeHtml(project.architecture)}</p>
    </div>
    <ul class="card-highlights" style="margin-bottom: 1.25rem;">
      ${project.highlights.map(h => `<li><i class="fa-solid fa-check"></i><span>${escapeHtml(h)}</span></li>`).join('')}
    </ul>
    <div style="display: flex; flex-wrap: wrap; gap: 0.6rem;">
      ${safeDl ? `<a href="${safeDl}" target="_blank" rel="noopener noreferrer" class="btn btn-emerald btn-sm"><i class="fa-solid fa-download"></i> Download ${escapeHtml(meta.assetName)}</a>` : ''}
      ${sanitizeHttpUrl(meta.zipUrl) && meta.zipUrl !== safeDl ? `<a href="${sanitizeHttpUrl(meta.zipUrl)}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm"><i class="fa-solid fa-file-zipper"></i> Portable .zip</a>` : ''}
      ${sanitizeHttpUrl(meta.shaUrl) ? `<a href="${sanitizeHttpUrl(meta.shaUrl)}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm"><i class="fa-solid fa-shield-halved"></i> SHA256SUMS</a>` : ''}
      ${safeWeb ? `<a href="${safeWeb}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm"><i class="fa-solid fa-arrow-up-right-from-square"></i> Launch Live App</a>` : ''}
      ${!project.isPrivate && safeGh ? `<a href="${safeGh}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm"><i class="fa-brands fa-github"></i> View Repository</a>` : '<span class="mono" style="color: var(--text-muted); align-self: center;">Private hackathon repository — architecture overview shown above.</span>'}
    </div>
  `;
  modal.classList.add('open');
}

if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
if (modal) {
  modal.addEventListener('click', e => {
    if (e.target === modal) closeModal();
  });
}
window.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});

function buildCardStageHtml(p) {
  if (p.id === 'metshield-ai') {
    return `
      <div class="card-stage-inner stage-metshield">
        <img src="assets/jatayu-seal.jpg" alt="Project JATAYU Crest" class="stage-seal" />
        <div class="tele-mini">
          <div class="tele-mini-metrics">
            <span>28.4°C</span>
            <span>998.4 hPa</span>
            <span>74% RH</span>
          </div>
          <svg viewBox="0 0 240 46" width="100%" height="44" aria-hidden="true">
            <path d="M0 32 C 30 30, 50 14, 80 18 C 110 22, 130 8, 160 14 C 190 20, 210 10, 240 12" fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round"/>
            <path d="M0 38 C 40 36, 70 28, 110 31 C 150 34, 180 24, 240 26" fill="none" stroke="#38bdf8" stroke-width="1.8" stroke-dasharray="4 4"/>
          </svg>
          <div class="mono" style="font-size: 0.68rem; color: #6ee7b7;">WMO-NO. 8 TIER 1-3 · 20 AWS NODES</div>
        </div>
      </div>`;
  }
  if (p.id === 'black-browser') {
    return `
      <div class="card-stage-inner stage-browser">
        <div class="browser-mockup">
          <div class="browser-chrome">
            <div class="dots"><span></span><span></span><span></span></div>
            <div class="browser-url">🔒 black://home · Speed Dial</div>
          </div>
          <div class="browser-center">
            <img src="assets/black-firefox-icon.png" alt="Black Browser Icon" class="app-emblem" />
            <div>
              <div style="font-weight: 700; font-size: 0.92rem; color: #f8fafc;">Black Browser v9.1.0</div>
              <div class="mono" style="font-size: 0.7rem; color: #7dd3fc;">~460 KB · 3-Layer AdShield · DPAPI Vault</div>
            </div>
          </div>
        </div>
      </div>`;
  }
  if (p.id === 'blacktube') {
    return `
      <div class="card-stage-inner stage-player">
        <div class="player-mockup">
          <div class="player-screen">
            <img src="assets/blacktube-icon.ico" alt="BlackTube Icon" class="app-emblem" />
            <div style="flex: 1;">
              <div style="font-weight: 700; font-size: 0.92rem; color: #f8fafc;">BlackTube Desktop</div>
              <div class="mono" style="font-size: 0.7rem; color: #fda4af;">WebView2 Playback · 0 Telemetry · Low RAM</div>
            </div>
            <span style="width: 34px; height: 34px; border-radius: 999px; background: rgba(239,68,68,0.2); border: 1px solid rgba(248,113,113,0.45); display: grid; place-items: center; color: #f87171;">
              <i class="fa-solid fa-play" style="font-size: 0.75rem;"></i>
            </span>
          </div>
          <div class="player-bar"><div class="player-bar-fill"></div></div>
        </div>
      </div>`;
  }
  return `<img src="assets/aerotech-dashboard.png" alt="aerotech Forensic Triage Dashboard" class="card-stage-inner stage-screenshot" />`;
}

// ---------------------------------------------------------------------------
// Render Project Cards & Distribution Matrix
// ---------------------------------------------------------------------------
function renderProjects() {
  const grid = document.getElementById('projects-grid');
  if (!grid) return;

  const visible = activeFilter === 'all' ? PROJECTS : PROJECTS.filter(p => p.filter === activeFilter);
  grid.innerHTML = visible
    .map(p => {
      const meta = liveCache.get(p.id) || {
        stars: p.defaultStars,
        forks: p.defaultForks,
        version: p.defaultVersion,
        downloadUrl: null,
        assetName: null,
        assetSize: ''
      };
      const safeWeb = sanitizeHttpUrl(p.website);
      const safeDl = sanitizeHttpUrl(meta.downloadUrl);
      const safeGh = sanitizeHttpUrl(p.github);

      return `
      <article class="project-card" id="card-${escapeHtml(p.id)}">
        <div class="card-stage">
          ${buildCardStageHtml(p)}
          <div class="stage-overlay">
            <span class="stage-label">
              <i class="${escapeHtml(p.iconClass)}" style="color: ${escapeHtml(p.statusColor)};"></i>
              <span>${escapeHtml(p.domainLabel)}</span>
            </span>
            <span class="status-pill" style="background: ${escapeHtml(p.statusBg)}; color: ${escapeHtml(p.statusColor)};">
              ${escapeHtml(p.statusText)}
            </span>
          </div>
        </div>

        <div class="card-body">
          <div class="card-title-row">
            <div class="card-title-group">
              ${p.iconImg ? `<img src="${escapeHtml(p.iconImg)}" alt="" class="card-mini-icon" />` : `<span class="card-mini-icon" style="display: grid; place-items: center; background: ${escapeHtml(p.statusBg)}; color: ${escapeHtml(p.statusColor)};"><i class="${escapeHtml(p.iconClass)}" style="font-size: 0.75rem;"></i></span>`}
              <h3 class="card-title">${escapeHtml(p.name)}</h3>
            </div>
            <div class="card-stats">
              ${p.isPrivate ? '<span><i class="fa-solid fa-lock"></i> Private</span>' : `<span><i class="fa-regular fa-star"></i> ${meta.stars}</span><span><i class="fa-solid fa-code-fork"></i> ${meta.forks}</span>`}
            </div>
          </div>

          <p class="card-desc">${escapeHtml(p.summary)}</p>

          <ul class="card-highlights">
            ${p.highlights.map(h => `<li><i class="fa-solid fa-check"></i><span>${escapeHtml(h)}</span></li>`).join('')}
          </ul>

          <div class="tech-row">
            ${p.tech.map(t => `<span class="tech-tag">${escapeHtml(t)}</span>`).join('')}
          </div>

          <div class="card-footer">
            ${safeDl ? `<a href="${safeDl}" target="_blank" rel="noopener noreferrer" class="btn btn-emerald btn-sm"><i class="fa-solid fa-download"></i> Download ${meta.assetSize ? `(${escapeHtml(meta.assetSize)})` : ''}</a>` : ''}
            ${safeWeb ? `<button class="btn btn-primary btn-sm" data-action="preview" data-id="${escapeHtml(p.id)}"><i class="fa-solid fa-display"></i> Live Preview</button><a href="${safeWeb}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm"><i class="fa-solid fa-arrow-up-right-from-square"></i> Launch</a>` : ''}
            ${!p.isPrivate && safeGh ? `<a href="${safeGh}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm"><i class="fa-brands fa-github"></i> Source</a>` : ''}
            <button class="btn btn-secondary btn-sm" data-action="details" data-id="${escapeHtml(p.id)}"><i class="fa-solid fa-circle-info"></i> Details</button>
            <button class="btn btn-secondary btn-sm spacer" data-action="share" data-id="${escapeHtml(p.id)}" title="Copy direct link"><i class="fa-solid fa-share-nodes"></i></button>
          </div>
        </div>
      </article>`;
    })
    .join('');

  grid.querySelectorAll('[data-action]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const action = btn.getAttribute('data-action');
      const proj = PROJECTS.find(item => item.id === id);
      if (!proj) return;

      if (action === 'preview') openPreviewModal(proj);
      else if (action === 'details') openDetailsModal(proj);
      else if (action === 'share') {
        const shareUrl = `${window.location.origin}${window.location.pathname}#${proj.id}`;
        if (navigator.clipboard) {
          navigator.clipboard.writeText(shareUrl).then(() => showToast(`Copied link for ${proj.name}`)).catch(() => showToast(shareUrl));
        } else {
          showToast(shareUrl);
        }
      }
    });
  });
}

function renderDistributionTable() {
  const tbody = document.getElementById('distribution-tbody');
  if (!tbody) return;

  tbody.innerHTML = PROJECTS.map(p => {
    const meta = liveCache.get(p.id) || { version: p.defaultVersion, downloadUrl: null, assetName: null, assetSize: '' };
    const safeDl = sanitizeHttpUrl(meta.downloadUrl);
    const safeWeb = sanitizeHttpUrl(p.website);
    const safeGh = sanitizeHttpUrl(p.github);

    let distCell = `<span class="mono" style="color: var(--text-muted);">Private Showcase</span>`;
    if (safeDl) {
      distCell = `<a href="${safeDl}" target="_blank" rel="noopener noreferrer" class="btn btn-emerald btn-sm"><i class="fa-solid fa-download"></i> ${escapeHtml(meta.assetName)} ${meta.assetSize ? `(${escapeHtml(meta.assetSize)})` : ''}</a>`;
    } else if (safeWeb) {
      distCell = `<a href="${safeWeb}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm"><i class="fa-solid fa-arrow-up-right-from-square"></i> Launch Web App</a>`;
    } else if (!p.isPrivate && safeGh) {
      distCell = `<a href="${safeGh}/releases" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm"><i class="fa-brands fa-github"></i> Source / Releases</a>`;
    } else {
      distCell = `<button class="btn btn-secondary btn-sm" data-table-details="${escapeHtml(p.id)}"><i class="fa-solid fa-file-shield"></i> Case Study</button>`;
    }

    return `
      <tr>
        <td>
          <div class="card-title-group">
            ${p.iconImg ? `<img src="${escapeHtml(p.iconImg)}" alt="" class="card-mini-icon" />` : `<span class="card-mini-icon" style="display: grid; place-items: center; background: ${escapeHtml(p.statusBg)}; color: ${escapeHtml(p.statusColor)};"><i class="${escapeHtml(p.iconClass)}" style="font-size: 0.72rem;"></i></span>`}
            <strong>${escapeHtml(p.name)}</strong>
          </div>
        </td>
        <td class="mono">${escapeHtml(p.runtime)} · ${escapeHtml(p.footprint)}</td>
        <td>${escapeHtml(p.platform)}</td>
        <td class="mono" style="color: var(--emerald);">${escapeHtml(meta.version || p.defaultVersion)}</td>
        <td>${distCell}</td>
      </tr>`;
  }).join('');

  tbody.querySelectorAll('[data-table-details]').forEach(btn => {
    btn.addEventListener('click', () => {
      const proj = PROJECTS.find(p => p.id === btn.getAttribute('data-table-details'));
      if (proj) openDetailsModal(proj);
    });
  });
}

document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeFilter = btn.getAttribute('data-filter') || 'all';
    renderProjects();
  });
});

// ---------------------------------------------------------------------------
// Subtle Interactive 3D Geometric Hero (Three.js 0.160.0)
// ---------------------------------------------------------------------------
function initHero3D() {
  const canvas = document.getElementById('hero-3d-canvas');
  if (!canvas || !canvas.parentElement) return;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  } catch {
    return; // Graceful 2D fallback if WebGL is unavailable
  }

  const container = canvas.parentElement;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, container.clientWidth / container.clientHeight, 0.1, 100);
  camera.position.set(0, 0, 5.2);

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(container.clientWidth, container.clientHeight, false);

  const rootGroup = new THREE.Group();
  scene.add(rootGroup);

  // Outer sleek wireframe icosahedron
  const outerGeo = new THREE.IcosahedronGeometry(1.45, 1);
  const outerWire = new THREE.WireframeGeometry(outerGeo);
  const outerMat = new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.48 });
  const outerMesh = new THREE.LineSegments(outerWire, outerMat);
  rootGroup.add(outerMesh);

  // Inner faceted solid core
  const coreGeo = new THREE.OctahedronGeometry(0.82, 0);
  const coreMat = new THREE.MeshStandardMaterial({
    color: 0x10b981,
    emissive: 0x064e3b,
    emissiveIntensity: 0.6,
    metalness: 0.75,
    roughness: 0.25,
    flatShading: true
  });
  const coreMesh = new THREE.Mesh(coreGeo, coreMat);
  rootGroup.add(coreMesh);

  // Clean orbital halo ring
  const ringGeo = new THREE.TorusGeometry(2.05, 0.012, 8, 96);
  const ringMat = new THREE.MeshBasicMaterial({ color: 0xa78bfa, transparent: true, opacity: 0.35 });
  const ringMesh = new THREE.Mesh(ringGeo, ringMat);
  ringMesh.rotation.x = Math.PI * 0.36;
  ringMesh.rotation.y = Math.PI * 0.12;
  rootGroup.add(ringMesh);

  // Sparse ambient starfield
  const count = 90;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 9;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 6;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 4 - 1;
  }
  const starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const starMat = new THREE.PointsMaterial({ color: 0xe4e4e7, size: 0.035, transparent: true, opacity: 0.55 });
  scene.add(new THREE.Points(starGeo, starMat));

  const keyLight = new THREE.DirectionalLight(0x38bdf8, 2.2);
  keyLight.position.set(3, 4, 5);
  scene.add(keyLight);

  const rimLight = new THREE.DirectionalLight(0x10b981, 1.8);
  rimLight.position.set(-4, -2, 3);
  scene.add(rimLight);
  scene.add(new THREE.AmbientLight(0xffffff, 0.45));

  let targetX = 0;
  let targetY = 0;
  container.addEventListener('pointermove', e => {
    const rect = container.getBoundingClientRect();
    targetX = ((e.clientX - rect.left) / rect.width - 0.5) * 0.7;
    targetY = ((e.clientY - rect.top) / rect.height - 0.5) * 0.7;
  });
  container.addEventListener('pointerleave', () => {
    targetX = 0;
    targetY = 0;
  });

  const ro = new ResizeObserver(() => {
    const w = container.clientWidth;
    const h = container.clientHeight;
    if (!w || !h) return;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  });
  ro.observe(container);

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let isVisible = true;
  const io = new IntersectionObserver(entries => {
    isVisible = entries[0]?.isIntersecting ?? true;
  });
  io.observe(container);

  if (prefersReducedMotion) {
    renderer.render(scene, camera);
    return;
  }

  let last = performance.now();
  function animate(now) {
    requestAnimationFrame(animate);
    if (!isVisible) {
      last = now;
      return;
    }
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;

    outerMesh.rotation.y += dt * 0.28;
    outerMesh.rotation.x += dt * 0.14;
    coreMesh.rotation.y -= dt * 0.42;
    ringMesh.rotation.z += dt * 0.2;

    rootGroup.rotation.y += (targetX - rootGroup.rotation.y) * 0.06;
    rootGroup.rotation.x += (targetY - rootGroup.rotation.x) * 0.06;

    renderer.render(scene, camera);
  }
  requestAnimationFrame(animate);
}

// ---------------------------------------------------------------------------
// Bootstrap
// ---------------------------------------------------------------------------
renderProjects();
renderDistributionTable();
initHero3D();

Promise.all(PROJECTS.map(fetchRepoTelemetry)).then(() => {
  renderProjects();
  renderDistributionTable();
});

const initialHash = window.location.hash.replace('#', '');
if (initialHash) {
  const match = PROJECTS.find(p => p.id === initialHash);
  if (match) openDetailsModal(match);
}
