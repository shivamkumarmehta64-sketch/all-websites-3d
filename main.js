import * as THREE from 'three';

const GITHUB_USER = 'shivamkumarmehta64-sketch';
const CACHE_TTL_MS = 10 * 60 * 1000;

const PROJECTS = [
  {
    id: 'metshield-ai',
    name: 'MetShield-AI',
    repo: 'MetShield-AI',
    hasReleases: false,
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
    hasReleases: true,
    filter: 'desktop',
    domainLabel: 'Ad-Free Desktop Client',
    statusText: 'v1.0.0 RELEASE',
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
    defaultVersion: 'v1.0.0',
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
  },
  {
    id: 'quantum-drone-gcs',
    name: 'Quantum Drone GCS',
    repo: 'quantum-drone-sih',
    hasReleases: false,
    filter: 'security',
    domainLabel: 'Post-Quantum UAV C2',
    statusText: 'CLOUDFLARE · LIVE',
    statusColor: '#64d2ff',
    statusBg: 'rgba(100, 210, 255, 0.12)',
    iconClass: 'fa-solid fa-satellite-dish',
    summary:
      'Hybrid Quantum-Resilient Drone Surveillance & Ground Control Station combining NIST FIPS 203 ML-KEM-768 post-quantum cryptography with AES-256-GCM air-gapped telemetry.',
    highlights: [
      'AES-256-GCM authenticated telemetry links with BB84 QKD & ML-KEM-768 fallback',
      'Monotonic anti-replay sequence validation and 6-DoF multi-UAV swarm control',
      'Zero-internet air-gapped tactical GCS deployed live on Cloudflare Pages'
    ],
    tech: ['ML-KEM-768', 'AES-256-GCM', 'Python', 'WebGL / HTML5', 'Cloudflare'],
    runtime: 'Edge / Python GCS',
    footprint: 'Air-Gapped C2',
    platform: 'Web / Field Node',
    defaultStars: 0,
    defaultForks: 0,
    defaultVersion: 'SIH PQC',
    website: 'https://quantum-drone-gcs.pages.dev',
    github: `https://github.com/${GITHUB_USER}/quantum-drone-sih`,
    iconImg: null,
    detailImg: 'assets/quantum-drone-gcs.png',
    architecture:
      'Zero-internet enclave pairing an edge cryptographic engine (AES-256-GCM + ML-KEM-768) with a browser-based tactical Ground Control Station and mobile field client.'
  },
  {
    id: 'cinematic-birthday',
    name: 'Cinematic Birthday',
    repo: 'cinematic-birthday',
    hasReleases: false,
    filter: 'web',
    domainLabel: 'Client-Side Experience',
    statusText: 'PAGES · LIVE',
    statusColor: '#bf5af2',
    statusBg: 'rgba(191, 90, 242, 0.12)',
    iconClass: 'fa-solid fa-wand-magic-sparkles',
    summary:
      '100% client-side interactive web experience turning photos and custom messages into a shareable, animated celebration link with zero server uploads.',
    highlights: [
      'Zero-upload client-side photo & message encoding for instant private sharing',
      'Fluid typography, responsive mobile staging, and choreographed animations',
      'Deployed globally on Cloudflare Pages and Vercel Edge with instant cold starts'
    ],
    tech: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Client-Side', 'Cloudflare'],
    runtime: 'Next.js / Edge',
    footprint: 'Zero Backend',
    platform: 'Web / Mobile',
    defaultStars: 0,
    defaultForks: 0,
    defaultVersion: 'Live Web',
    website: 'https://cinematic-birthday-3ou.pages.dev',
    github: `https://github.com/${GITHUB_USER}/cinematic-birthday`,
    iconImg: null,
    detailImg: 'assets/cinematic-birthday.png',
    architecture:
      'Static Next.js application encoding celebration payloads client-side with zero database dependency, deployed on Cloudflare Pages.'
  }
];

const liveCache = new Map();
let activeFilter = 'all';

/** Escapes HTML special characters before interpolating untrusted strings into templates. */
function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Permits HTTPS URLs and local loopback HTTP URLs to prevent javascript: or mixed-content links. */
function sanitizeHttpUrl(url) {
  if (!url || typeof url !== 'string') return null;
  try {
    const parsed = new URL(url);
    if (parsed.protocol === 'https:') return parsed.href;
    if (parsed.protocol === 'http:' && (parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1')) {
      return parsed.href;
    }
    return null;
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

  const cacheKey = `portfolio_v4_${project.repo}`;
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
    const requests = [fetch(`https://api.github.com/repos/${GITHUB_USER}/${project.repo}`)];
    if (project.hasReleases !== false) {
      requests.push(fetch(`https://api.github.com/repos/${GITHUB_USER}/${project.repo}/releases/latest`));
    }
    const [repoRes, relRes] = await Promise.allSettled(requests);

    const data = { ...fallback };
    if (repoRes && repoRes.status === 'fulfilled' && repoRes.value.ok) {
      const repoJson = await repoRes.value.json();
      data.stars = repoJson.stargazers_count ?? data.stars;
      data.forks = repoJson.forks_count ?? data.forks;
    }
    if (relRes && relRes.status === 'fulfilled' && relRes.value.ok) {
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
let lastFocusedElement = null;

function openModalShell() {
  lastFocusedElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  document.body.style.overflow = 'hidden';
  modal.classList.add('open');
  if (modalCloseBtn) modalCloseBtn.focus();
}

function closeModal() {
  if (!modal) return;
  modal.classList.remove('open');
  modalBody.innerHTML = '';
  document.body.style.overflow = '';
  if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
    lastFocusedElement.focus();
    lastFocusedElement = null;
  }
}

function openPreviewModal(project) {
  const safeUrl = sanitizeHttpUrl(project.website);
  if (!safeUrl || !modal) return;
  modalTitle.innerHTML = `<i class="${escapeHtml(project.iconClass)}" style="color: ${escapeHtml(project.statusColor)};"></i> ${escapeHtml(project.name)} — Live Preview`;
  modalExternal.href = safeUrl;
  modalExternal.style.display = 'inline-flex';
  modalBody.style.padding = '0';
  modalBody.innerHTML = `<iframe class="preview-frame" src="${safeUrl}" title="${escapeHtml(project.name)} live preview" loading="lazy" sandbox="allow-scripts allow-same-origin allow-forms allow-popups" referrerpolicy="no-referrer"></iframe>`;
  openModalShell();
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
  openModalShell();
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
        <img src="assets/jatayu-seal.jpg" alt="MetShield AI Crest" class="stage-seal" />
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
  if (p.detailImg) {
    return `<img src="${escapeHtml(p.detailImg)}" alt="${escapeHtml(p.name)} Preview" class="card-stage-inner stage-screenshot" loading="lazy" decoding="async" />`;
  }
  return `<img src="assets/aerotech-dashboard.png" alt="${escapeHtml(p.name)} Preview" class="card-stage-inner stage-screenshot" loading="lazy" decoding="async" />`;
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
      <article class="project-card reveal" style="transition-delay: ${Math.min(visible.indexOf(p) * 45, 220)}ms;" id="card-${escapeHtml(p.id)}">
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
            <button class="btn btn-secondary btn-sm spacer" data-action="share" data-id="${escapeHtml(p.id)}" title="Copy direct link" aria-label="Copy direct link for ${escapeHtml(p.name)}"><i class="fa-solid fa-share-nodes" aria-hidden="true"></i></button>
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

  observeReveals();
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
    document.querySelectorAll('.filter-btn').forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-selected', 'false');
    });
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');
    activeFilter = btn.getAttribute('data-filter') || 'all';
    renderProjects();
  });
});

// ---------------------------------------------------------------------------
// Interactive 3D Systems Core with Gravitas & Scroll-Drive (Three.js 0.160.0)
// ---------------------------------------------------------------------------
function initHero3D() {
  const canvas = document.getElementById('hero-3d-canvas');
  const fallbackEl = document.getElementById('hero-3d-fallback');
  if (!canvas || !canvas.parentElement) return;

  const showFallback = () => {
    canvas.style.display = 'none';
    if (fallbackEl) fallbackEl.style.display = 'grid';
  };

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  } catch {
    showFallback();
    return;
  }

  let contextLost = false;
  canvas.addEventListener('webglcontextlost', e => {
    e.preventDefault();
    contextLost = true;
    showFallback();
  });

  const container = canvas.parentElement;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, container.clientWidth / container.clientHeight, 0.1, 100);
  camera.position.set(0, 0, 5.4);

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.matchMedia('(pointer: coarse)').matches;
  renderer.setPixelRatio(isMobile ? 1 : Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(container.clientWidth, container.clientHeight, false);

  const rootGroup = new THREE.Group();
  scene.add(rootGroup);

  // Outer architectural wireframe icosahedron
  const outerGeo = new THREE.IcosahedronGeometry(1.48, 1);
  const outerWire = new THREE.WireframeGeometry(outerGeo);
  const outerMat = new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.45 });
  const outerMesh = new THREE.LineSegments(outerWire, outerMat);
  rootGroup.add(outerMesh);

  // Inner high-mass faceted core
  const coreGeo = new THREE.OctahedronGeometry(0.84, 0);
  const coreMat = new THREE.MeshStandardMaterial({
    color: 0x10b981,
    emissive: 0x064e3b,
    emissiveIntensity: 0.65,
    metalness: 0.82,
    roughness: 0.22,
    flatShading: true
  });
  const coreMesh = new THREE.Mesh(coreGeo, coreMat);
  rootGroup.add(coreMesh);

  // Primary & secondary counter-rotating gimbal halos
  const ringGeo = new THREE.TorusGeometry(2.05, 0.014, 8, 96);
  const ringMat = new THREE.MeshBasicMaterial({ color: 0xa78bfa, transparent: true, opacity: 0.38 });
  const ringMesh = new THREE.Mesh(ringGeo, ringMat);
  ringMesh.rotation.x = Math.PI * 0.36;
  ringMesh.rotation.y = Math.PI * 0.12;
  rootGroup.add(ringMesh);

  const gimbalGeo = new THREE.TorusGeometry(1.78, 0.01, 8, 84);
  const gimbalMat = new THREE.MeshBasicMaterial({ color: 0x0a84ff, transparent: true, opacity: 0.28 });
  const gimbalMesh = new THREE.Mesh(gimbalGeo, gimbalMat);
  gimbalMesh.rotation.x = -Math.PI * 0.28;
  gimbalMesh.rotation.z = Math.PI * 0.22;
  rootGroup.add(gimbalMesh);

  // 3 Domain Satellites (MetShield Emerald, Black Browser Blue, Quantum Violet)
  const satGroup = new THREE.Group();
  const satSpecs = [
    { color: 0x30d158, angle: 0, radius: 2.05 },
    { color: 0x0a84ff, angle: (Math.PI * 2) / 3, radius: 2.05 },
    { color: 0xbf5af2, angle: (Math.PI * 4) / 3, radius: 2.05 }
  ];
  const satGeo = new THREE.SphereGeometry(0.065, 16, 16);
  satSpecs.forEach(spec => {
    const sat = new THREE.Mesh(satGeo, new THREE.MeshBasicMaterial({ color: spec.color }));
    sat.position.set(Math.cos(spec.angle) * spec.radius, 0, Math.sin(spec.angle) * spec.radius);
    satGroup.add(sat);
  });
  satGroup.rotation.x = Math.PI * 0.36;
  satGroup.rotation.y = Math.PI * 0.12;
  rootGroup.add(satGroup);

  // Sparse ambient starfield
  const count = isMobile ? 55 : 95;
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

  const keyLight = new THREE.DirectionalLight(0x38bdf8, 2.3);
  keyLight.position.set(3, 4, 5);
  scene.add(keyLight);

  const rimLight = new THREE.DirectionalLight(0x10b981, 1.9);
  rimLight.position.set(-4, -2, 3);
  scene.add(rimLight);
  scene.add(new THREE.AmbientLight(0xffffff, 0.45));

  let targetX = 0;
  let targetY = 0;
  let pulseVelocity = 0;
  container.addEventListener('pointermove', e => {
    const rect = container.getBoundingClientRect();
    targetX = ((e.clientX - rect.left) / rect.width - 0.5) * 0.75;
    targetY = ((e.clientY - rect.top) / rect.height - 0.5) * 0.75;
  });
  container.addEventListener('pointerleave', () => {
    targetX = 0;
    targetY = 0;
  });
  container.addEventListener('pointerdown', () => {
    pulseVelocity = 0.08;
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
    if (contextLost) return;
    requestAnimationFrame(animate);
    if (!isVisible) {
      last = now;
      return;
    }
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;

    // Scroll-driven depth & pitch (never blocks page scroll)
    const scrollNorm = Math.min(window.scrollY / 650, 1);
    camera.position.z = 5.4 + scrollNorm * 0.9;
    camera.position.y = -scrollNorm * 0.35;

    // Weighted inertia + click impulse
    pulseVelocity *= 0.92;
    const speedBoost = 1 + pulseVelocity * 18;
    outerMesh.rotation.y += dt * 0.22 * speedBoost;
    outerMesh.rotation.x += dt * 0.11 * speedBoost;
    coreMesh.rotation.y -= dt * 0.35 * speedBoost;
    ringMesh.rotation.z += dt * 0.16 * speedBoost;
    gimbalMesh.rotation.z -= dt * 0.21 * speedBoost;
    satGroup.rotation.y += dt * 0.28 * speedBoost;

    const coreScale = 1 + pulseVelocity * 1.1;
    coreMesh.scale.setScalar(coreScale);

    rootGroup.rotation.y += (targetX - rootGroup.rotation.y) * 0.055;
    rootGroup.rotation.x += (targetY + scrollNorm * 0.22 - rootGroup.rotation.x) * 0.055;

    renderer.render(scene, camera);
  }
  requestAnimationFrame(animate);
}

// ---------------------------------------------------------------------------
// Apple Keynote Scroll-Reveal Observer
// ---------------------------------------------------------------------------
function observeReveals() {
  const targets = document.querySelectorAll('.reveal, .spotlight-card, .pillar-card, .creator-band');
  if (!('IntersectionObserver' in window)) {
    targets.forEach(el => el.classList.add('in-view'));
    return;
  }
  const obs = new IntersectionObserver(
    entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          obs.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
  );
  targets.forEach(el => {
    if (!el.classList.contains('reveal')) el.classList.add('reveal');
    obs.observe(el);
  });
}

// ---------------------------------------------------------------------------
// Bootstrap
// ---------------------------------------------------------------------------
renderProjects();
renderDistributionTable();
observeReveals();
initHero3D();

async function updateGitHubStrip() {
  try {
    const res = await fetch(`https://api.github.com/users/${GITHUB_USER}`);
    if (res.ok) {
      const userJson = await res.json();
      const el = document.getElementById('gh-total-repos');
      if (el && typeof userJson.public_repos === 'number') {
        el.textContent = String(userJson.public_repos);
      }
    }
  } catch {
    // Keep fallback count
  }
  let liveApps = 0;
  let releaseCount = 0;
  for (const p of PROJECTS) {
    const meta = liveCache.get(p.id);
    if (p.website) liveApps += 1;
    if (meta?.downloadUrl) releaseCount += 1;
  }
  const liveEl = document.getElementById('gh-live-apps');
  const relEl = document.getElementById('gh-active-releases');
  const stripEl = document.getElementById('gh-telemetry-strip');
  if (liveEl) liveEl.textContent = String(liveApps);
  if (relEl && releaseCount > 0) relEl.textContent = String(releaseCount);
  if (stripEl) stripEl.setAttribute('aria-busy', 'false');
}

Promise.all(PROJECTS.map(fetchRepoTelemetry)).then(() => {
  renderProjects();
  renderDistributionTable();
  updateGitHubStrip();
});

const initialHash = window.location.hash.replace('#', '');
if (initialHash) {
  const match = PROJECTS.find(p => p.id === initialHash);
  if (match) openDetailsModal(match);
}
