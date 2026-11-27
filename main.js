import * as THREE from 'three';
import anime from 'animejs';

const GITHUB_USER = 'shivamkumarmehta64-sketch';
const CACHE_TTL_MS = 10 * 60 * 1000;
const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const PROJECTS = [
  {
    id: 'metshield-ai',
    name: 'MetShield-AI',
    repo: 'MetShield-AI',
    filter: 'web',
    domainLabel: 'MoES / IMD · SIH 2026',
    statusColor: '#30d158',
    statusBg: 'rgba(48, 209, 88, 0.14)',
    iconClass: 'fa-solid fa-shield-halved',
    hook: 'Separates storms from broken sensors.',
    summary:
      'Autonomous 3-tier quality control and Explainable AI for Automatic Weather Stations. Differentiates genuine convective storms from thermistor faults in real time under WMO-No. 8 rules.',
    highlights: [
      '98.7% Macro F1 (20k frames), 0.005 ms p95 latency, and 212 passing tests',
      'Couples ΔP ≤ -2.5 hPa with ΔRH ≥ +15% and ΔT ≤ -1.5°C to eliminate false alarms',
      'Live Web Sensors API barometer fallback & official NIC/IMD CSV audit log export'
    ],
    tech: ['Next.js 16.4', 'TypeScript', 'Recharts', 'WMO-No. 8', 'Vercel'],
    runtime: 'Next.js / Edge',
    footprint: 'Zero-Cost Web App',
    platform: 'Web / Mobile Sensors',
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
    domainLabel: 'Native Windows Browser',
    statusColor: '#0a84ff',
    statusBg: 'rgba(10, 132, 255, 0.14)',
    iconClass: 'fa-solid fa-globe',
    hook: '460 KB executable. Under 60 MB RAM.',
    summary:
      'Native Windows 10/11 browser engineered in C# (.NET 4.8) and Microsoft WebView2. Delivers 3-layer AdShield and DPAPI local encryption with zero cloud telemetry.',
    highlights: [
      '3-Layer AdShield (domain blocking, YouTube payload stripping & auto-skip)',
      'Windows DPAPI local password vault, bookmarks, QR share & MV2 extensions',
      'Signed-hash v9.1.0 Setup.exe & Portable ZIP + black://home Speed Dial'
    ],
    tech: ['C#', '.NET 4.8', 'WebView2', 'DPAPI Vault', 'AdShield'],
    runtime: 'C# / .NET 4.8',
    footprint: '~460 KB · <60 MB RAM',
    platform: 'Windows 10 / 11',
    defaultStars: 1,
    defaultForks: 0,
    defaultVersion: 'v9.1.0',
    website: 'https://blackbrowser.vercel.app/',
    github: `https://github.com/${GITHUB_USER}/Black-Firefox`,
    iconImg: 'assets/black-firefox-icon.png',
    detailImg: null,
    architecture:
      'Native WinForms shell hosting evergreen WebView2 runtime with custom dark glass chrome, 3-layer AdShield interceptor, DPAPI-encrypted local vault, and SHA-256 verified CI releases.'
  },
  {
    id: 'blacktube',
    name: 'BlackTube',
    repo: 'BlackTube',
    filter: 'desktop',
    domainLabel: 'Native Windows Media',
    statusColor: '#ff453a',
    statusBg: 'rgba(255, 69, 58, 0.14)',
    iconClass: 'fa-brands fa-youtube',
    hook: 'Dedicated YouTube in a 99 KB binary.',
    summary:
      'Ultra-lightweight dedicated YouTube desktop app in C# .NET + WebView2 (~99 KB standalone, <50 MB RAM) featuring a 5-Tier AdShield, SponsorBlock, PiP, and Sleep Timer.',
    highlights: [
      '5-Tier Resilient AdShield (network blocker, /youtubei/v1/ stripper, 16x fallback)',
      'Built-in SponsorBlock auto-skip, Picture-in-Picture (Ctrl+Shift+P) & Sleep Timer',
      'Windows 11 DWM Immersive Dark Mode & edge-to-edge F11 borderless fullscreen'
    ],
    tech: ['C#', '.NET 4.8', 'WebView2', '5-Tier AdShield', 'SponsorBlock'],
    runtime: 'C# / .NET 4.8',
    footprint: '~99 KB · <50 MB RAM',
    platform: 'Windows 10 / 11',
    defaultStars: 0,
    defaultForks: 0,
    defaultVersion: 'v1.0 Source',
    website: null,
    github: `https://github.com/${GITHUB_USER}/BlackTube`,
    iconImg: 'assets/blacktube-icon.ico',
    detailImg: null,
    architecture:
      'Native Windows WebView2 container stripping ad scripts and /youtubei/v1/ ad payloads while supporting SponsorBlock API, frameless PiP, and DWM dark chrome.'
  },
  {
    id: 'mtube',
    name: 'mTube (YT-Desktop)',
    repo: 'mtube',
    filter: 'desktop',
    domainLabel: 'Cross-Platform Media',
    statusColor: '#ff453a',
    statusBg: 'rgba(255, 69, 58, 0.14)',
    iconClass: 'fa-solid fa-music',
    hook: 'YouTube & Music in one window.',
    summary:
      'Ad-free YouTube + YouTube Music desktop client (v2.1.0) with instant Ctrl+1 / Ctrl+2 tab switching, SponsorBlock, Picture-in-Picture, system tray controls, and media keys.',
    highlights: [
      'Dual-mode YouTube & YouTube Music switching (Ctrl+1 / Ctrl+2) in one window',
      'Keyboard media keys, close-to-tray playback controls, and SponsorBlock skip',
      'Portable Windows .exe release (v2.1.0) and Linux build support'
    ],
    tech: ['Electron', 'JavaScript', 'SponsorBlock', 'PiP', 'Media Keys'],
    runtime: 'Electron Desktop',
    footprint: 'v2.1.0 Portable',
    platform: 'Windows / Linux',
    defaultStars: 1,
    defaultForks: 0,
    defaultVersion: 'v2.1.0',
    website: null,
    github: `https://github.com/${GITHUB_USER}/mtube`,
    iconImg: null,
    detailImg: null,
    architecture:
      'Single-instance Electron shell integrating YouTube & YouTube Music views with global hardware media keys, system tray playback menu, and SponsorBlock filtering.'
  },
  {
    id: 'blue-browser',
    name: 'Blue Browser',
    repo: 'Blue-Browser-Tauri',
    filter: 'desktop',
    domainLabel: 'Cross-Platform Tauri',
    statusColor: '#64d2ff',
    statusBg: 'rgba(100, 210, 255, 0.14)',
    iconClass: 'fa-solid fa-compass',
    hook: 'Rust + Tauri cross-platform shell.',
    summary:
      'Cross-platform companion to Black Browser built with Rust, Tauri, TypeScript, and React—bringing lightweight native rendering to Windows, macOS, and Linux.',
    highlights: [
      'Rust-backed Tauri core eliminating heavy Electron memory overhead',
      'Modern TypeScript interface with system-native webview integration',
      'Unified architecture targeting Windows, macOS, and Linux desktops'
    ],
    tech: ['Rust', 'Tauri', 'TypeScript', 'Cross-Platform'],
    runtime: 'Rust / Tauri',
    footprint: 'Native Binary',
    platform: 'Win / macOS / Linux',
    defaultStars: 0,
    defaultForks: 0,
    defaultVersion: 'v1.0',
    website: null,
    github: `https://github.com/${GITHUB_USER}/Blue-Browser-Tauri`,
    iconImg: null,
    detailImg: null,
    architecture:
      'Tauri desktop architecture pairing a memory-safe Rust backend with a reactive TypeScript frontend over native OS webviews.'
  },
  {
    id: 'aerotech',
    name: 'aerotech',
    repo: 'aerotech',
    isPrivate: true,
    filter: 'security',
    domainLabel: 'Digital Forensics',
    statusColor: '#bf5af2',
    statusBg: 'rgba(191, 90, 242, 0.14)',
    iconClass: 'fa-solid fa-user-secret',
    hook: 'Court-ready Android APK triage.',
    summary:
      'Autonomous Android APK Security & Digital Forensic Triage Platform (Bihar Cybercrime Hackathon 2026 PS-02) with ed25519 custody proofs and STIX 2.1 intelligence export.',
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

const BENCHMARK_DATA = {
  ram: [
    { label: 'BlackTube (C# / WebView2)', val: '48 MB', pct: 8, color: '#ff453a' },
    { label: 'Black Browser (C# / WebView2)', val: '54 MB', pct: 10, color: '#0a84ff' },
    { label: 'mTube (Electron Portable)', val: '185 MB', pct: 28, color: '#bf5af2' },
    { label: 'Standard Chromium Browser', val: '680 MB', pct: 92, color: 'rgba(255,255,255,0.25)' }
  ],
  size: [
    { label: 'BlackTube Standalone Binary', val: '99 KB', pct: 7, color: '#ff453a' },
    { label: 'Black Browser Executable', val: '460 KB', pct: 18, color: '#0a84ff' },
    { label: 'Standard Electron App', val: '85,000+ KB', pct: 95, color: 'rgba(255,255,255,0.25)' }
  ],
  qc: [
    { label: 'Packet Loss Detection (Recorded)', val: '100.0%', pct: 100, color: '#30d158' },
    { label: 'MetShield-AI Macro F1 (20k Frames)', val: '98.7%', pct: 98.7, color: '#0a84ff' },
    { label: 'Single-Sample Spike Detection', val: '93.6%', pct: 93.6, color: '#64d2ff' },
    { label: 'Static Range Check Baseline', val: '18.6%', pct: 18.6, color: 'rgba(255,255,255,0.25)' }
  ]
};

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

  const cacheKey = `scrollx_promo_v1_${project.repo}`;
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
// Modal
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

  modalBody.style.padding = '1.5rem';
  modalBody.innerHTML = `
    ${project.detailImg ? `<img src="${escapeHtml(project.detailImg)}" alt="${escapeHtml(project.name)} architecture" style="width: 100%; max-height: 360px; object-fit: cover; object-position: top; border-radius: 14px; border: 1px solid var(--border); margin-bottom: 1.25rem;" />` : ''}
    <div style="font-size: 1.22rem; font-weight: 700; letter-spacing: -0.02em; margin-bottom: 0.4rem;">${escapeHtml(project.hook)}</div>
    <p style="color: var(--text-secondary); margin-bottom: 1.25rem; line-height: 1.55;">${escapeHtml(project.summary)}</p>
    <div style="padding: 1.15rem; border-radius: 14px; border: 1px solid var(--border); background: rgba(255,255,255,0.03); margin-bottom: 1.25rem;">
      <div class="mono" style="font-size: 0.74rem; color: ${escapeHtml(project.statusColor)}; margin-bottom: 0.4rem; text-transform: uppercase; letter-spacing: 0.05em;">System Architecture</div>
      <p style="font-size: 0.92rem; color: var(--text-secondary); line-height: 1.55;">${escapeHtml(project.architecture)}</p>
    </div>
    <ul style="list-style: none; display: grid; gap: 0.5rem; margin-bottom: 1.5rem; font-size: 0.9rem; color: var(--text-secondary);">
      ${project.highlights.map(h => `<li style="display: flex; align-items: baseline; gap: 0.6rem;"><i class="fa-solid fa-check" style="color: ${escapeHtml(project.statusColor)}; font-size: 0.75rem;"></i><span>${escapeHtml(h)}</span></li>`).join('')}
    </ul>
    <div style="display: flex; flex-wrap: wrap; gap: 0.65rem; align-items: center;">
      ${safeDl ? `<a href="${safeDl}" target="_blank" rel="noopener noreferrer" class="btn btn-blue btn-sm"><i class="fa-solid fa-download"></i> Download ${escapeHtml(meta.assetName)}</a>` : ''}
      ${sanitizeHttpUrl(meta.zipUrl) && meta.zipUrl !== safeDl ? `<a href="${sanitizeHttpUrl(meta.zipUrl)}" target="_blank" rel="noopener noreferrer" class="btn btn-glass btn-sm"><i class="fa-solid fa-file-zipper"></i> Portable .zip</a>` : ''}
      ${sanitizeHttpUrl(meta.shaUrl) ? `<a href="${sanitizeHttpUrl(meta.shaUrl)}" target="_blank" rel="noopener noreferrer" class="btn btn-glass btn-sm"><i class="fa-solid fa-shield-halved"></i> SHA256SUMS</a>` : ''}
      ${safeWeb ? `<a href="${safeWeb}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">Launch Live App</a>` : ''}
      ${!project.isPrivate && safeGh ? `<a href="${safeGh}" target="_blank" rel="noopener noreferrer" class="btn btn-link btn-sm">View Source on GitHub ›</a>` : '<span class="mono" style="font-size: 0.78rem; color: var(--text-muted);">Private hackathon repository — architecture overview shown above.</span>'}
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

document.querySelectorAll('[data-open-details]').forEach(btn => {
  btn.addEventListener('click', () => {
    const id = btn.getAttribute('data-open-details');
    const proj = PROJECTS.find(p => p.id === id);
    if (proj) openDetailsModal(proj);
  });
});

// ---------------------------------------------------------------------------
// Cursor Spotlight Effect (Motion Primitives style)
// ---------------------------------------------------------------------------
function bindSpotlights() {
  document.querySelectorAll('.spotlight-surface').forEach(el => {
    el.addEventListener('pointermove', e => {
      const rect = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${e.clientX - rect.left}px`);
      el.style.setProperty('--my', `${e.clientY - rect.top}px`);
    });
  });
}

// ---------------------------------------------------------------------------
// Render Bento Grid & Distribution Matrix
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

      let primaryAction = '';
      if (safeDl) {
        primaryAction = `<a href="${safeDl}" target="_blank" rel="noopener noreferrer" class="btn btn-blue btn-sm"><i class="fa-solid fa-download"></i> Download ${meta.assetSize ? `(${escapeHtml(meta.assetSize)})` : ''}</a>`;
      } else if (safeWeb) {
        primaryAction = `<a href="${safeWeb}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm"><i class="fa-solid fa-arrow-up-right-from-square"></i> Launch Live</a>`;
      } else if (!p.isPrivate && safeGh) {
        primaryAction = `<a href="${safeGh}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">Explore Repo</a>`;
      } else {
        primaryAction = `<button class="btn btn-primary btn-sm" data-action="details" data-id="${escapeHtml(p.id)}">Read Case Study</button>`;
      }

      return `
      <article class="bento-card spotlight-surface" id="card-${escapeHtml(p.id)}">
        <div class="bento-top">
          <div class="bento-app-id">
            ${
              p.iconImg
                ? `<img src="${escapeHtml(p.iconImg)}" alt="${escapeHtml(p.name)} icon" class="bento-icon" />`
                : `<span class="bento-icon" style="background: ${escapeHtml(p.statusBg)}; color: ${escapeHtml(p.statusColor)};"><i class="${escapeHtml(p.iconClass)}" style="font-size: 1.15rem;"></i></span>`
            }
            <div>
              <div class="bento-kicker" style="color: ${escapeHtml(p.statusColor)};">${escapeHtml(p.domainLabel)}</div>
              <h3 class="bento-title">${escapeHtml(p.name)}</h3>
            </div>
          </div>
          <span class="mono" style="font-size: 0.76rem; color: var(--text-muted);">
            ${p.isPrivate ? '<i class="fa-solid fa-lock"></i> Private' : `${escapeHtml(meta.version)}`}
          </span>
        </div>

        <div class="bento-hook">${escapeHtml(p.hook)}</div>
        <p class="bento-desc">${escapeHtml(p.summary)}</p>

        <div class="bento-tags">
          ${p.tech.map(t => `<span class="bento-tag">${escapeHtml(t)}</span>`).join('')}
        </div>

        <div class="bento-footer">
          ${primaryAction}
          <button class="btn btn-glass btn-sm" data-action="details" data-id="${escapeHtml(p.id)}">Specs</button>
          ${!p.isPrivate && safeGh ? `<a href="${safeGh}" target="_blank" rel="noopener noreferrer" class="btn btn-link btn-sm">GitHub ›</a>` : ''}
          <button class="btn btn-glass btn-sm spacer" data-action="share" data-id="${escapeHtml(p.id)}" title="Copy link" aria-label="Copy link for ${escapeHtml(p.name)}">
            <i class="fa-solid fa-arrow-up-from-bracket"></i>
          </button>
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

      if (action === 'details') openDetailsModal(proj);
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

  bindSpotlights();
  if (!REDUCED_MOTION) {
    anime({
      targets: '#projects-grid .bento-card',
      opacity: [0, 1],
      translateY: [18, 0],
      delay: anime.stagger(55),
      duration: 500,
      easing: 'easeOutCubic'
    });
  }
}

function renderDistributionTable() {
  const tbody = document.getElementById('distribution-tbody');
  if (!tbody) return;

  tbody.innerHTML = PROJECTS.map(p => {
    const meta = liveCache.get(p.id) || { version: p.defaultVersion, downloadUrl: null, assetName: null, assetSize: '' };
    const safeDl = sanitizeHttpUrl(meta.downloadUrl);
    const safeWeb = sanitizeHttpUrl(p.website);
    const safeGh = sanitizeHttpUrl(p.github);

    if (p.id === 'black-browser' && safeDl) {
      const heroDl = document.getElementById('black-browser-hero-dl');
      if (heroDl) {
        heroDl.href = safeDl;
        heroDl.innerHTML = `<i class="fa-solid fa-download"></i> Download ${escapeHtml(meta.version)} (${escapeHtml(meta.assetSize || 'Setup')})`;
      }
    }

    let distCell = `<span class="mono" style="color: var(--text-muted);">Private Showcase</span>`;
    if (safeDl) {
      distCell = `<a href="${safeDl}" target="_blank" rel="noopener noreferrer" class="btn btn-blue btn-sm"><i class="fa-solid fa-download"></i> ${escapeHtml(meta.assetName)} ${meta.assetSize ? `(${escapeHtml(meta.assetSize)})` : ''}</a>`;
    } else if (safeWeb) {
      distCell = `<a href="${safeWeb}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">Launch Web App</a>`;
    } else if (!p.isPrivate && safeGh) {
      distCell = `<a href="${safeGh}/releases" target="_blank" rel="noopener noreferrer" class="btn btn-glass btn-sm"><i class="fa-brands fa-github"></i> Source / Releases</a>`;
    } else {
      distCell = `<button class="btn btn-glass btn-sm" data-table-details="${escapeHtml(p.id)}">Case Study</button>`;
    }

    return `
      <tr>
        <td>
          <div style="display: flex; align-items: center; gap: 0.7rem;">
            ${
              p.iconImg
                ? `<img src="${escapeHtml(p.iconImg)}" alt="" style="width: 28px; height: 28px; border-radius: 7px; object-fit: contain; padding: 2px; border: 1px solid var(--border);" />`
                : `<span style="width: 28px; height: 28px; border-radius: 7px; display: grid; place-items: center; background: ${escapeHtml(p.statusBg)}; color: ${escapeHtml(p.statusColor)};"><i class="${escapeHtml(p.iconClass)}" style="font-size: 0.72rem;"></i></span>`
            }
            <strong>${escapeHtml(p.name)}</strong>
          </div>
        </td>
        <td class="mono" style="font-size: 0.8rem;">${escapeHtml(p.runtime)} · ${escapeHtml(p.footprint)}</td>
        <td>${escapeHtml(p.platform)}</td>
        <td class="mono" style="color: var(--apple-green); font-size: 0.82rem;">${escapeHtml(meta.version || p.defaultVersion)}</td>
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
// Bklit-Style Interactive Animated Benchmark Chart (anime.js)
// ---------------------------------------------------------------------------
function renderBenchmarkChart(metric = 'ram') {
  const container = document.getElementById('chart-bars');
  if (!container) return;
  const rows = BENCHMARK_DATA[metric] || BENCHMARK_DATA.ram;

  container.innerHTML = rows
    .map(
      r => `
      <div>
        <div class="chart-row-meta">
          <strong>${escapeHtml(r.label)}</strong>
          <span class="mono" style="color: ${escapeHtml(r.color === 'rgba(255,255,255,0.25)' ? '#a1a1a6' : r.color)}; font-weight: 600;">${escapeHtml(r.val)}</span>
        </div>
        <div class="chart-track">
          <div class="chart-fill" data-target="${r.pct}" style="background: ${escapeHtml(r.color)};"></div>
        </div>
      </div>`
    )
    .join('');

  if (REDUCED_MOTION) {
    container.querySelectorAll('.chart-fill').forEach(el => {
      el.style.width = `${el.getAttribute('data-target')}%`;
    });
    return;
  }

  anime({
    targets: '#chart-bars .chart-fill',
    width: el => `${el.getAttribute('data-target')}%`,
    delay: anime.stagger(70),
    duration: 750,
    easing: 'easeOutExpo'
  });
}

document.querySelectorAll('.chart-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.chart-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    renderBenchmarkChart(tab.getAttribute('data-metric') || 'ram');
  });
});

// ---------------------------------------------------------------------------
// ScrollX Sticky Horizontal Scroll Engine + Top Progress Bar
// ---------------------------------------------------------------------------
function initScrollX() {
  const progressBar = document.getElementById('scroll-progress');
  const wrapper = document.getElementById('scrollx-wrapper');
  const track = document.getElementById('scrollx-track');
  const dots = document.querySelectorAll('.scrollx-dot-btn');

  function updateOnScroll() {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (progressBar && docHeight > 0) {
      progressBar.style.width = `${Math.min(100, Math.max(0, (window.scrollY / docHeight) * 100))}%`;
    }

    if (REDUCED_MOTION || window.innerWidth <= 920 || !wrapper || !track) return;

    const rect = wrapper.getBoundingClientRect();
    const scrollable = wrapper.offsetHeight - window.innerHeight;
    if (scrollable <= 0) return;

    const progress = Math.min(1, Math.max(0, -rect.top / scrollable));
    const maxTranslate = Math.max(0, track.scrollWidth - track.parentElement.clientWidth);
    track.style.transform = `translate3d(${-progress * maxTranslate}px, 0, 0)`;

    const activeIdx = Math.min(dots.length - 1, Math.round(progress * (dots.length - 1)));
    dots.forEach((d, idx) => d.classList.toggle('active', idx === activeIdx));
  }

  let ticking = false;
  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateOnScroll();
          ticking = false;
        });
        ticking = true;
      }
    },
    { passive: true }
  );

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const idx = Number(dot.getAttribute('data-slide') || 0);
      if (REDUCED_MOTION || window.innerWidth <= 920) {
        const cards = track?.querySelectorAll('.scrollx-card');
        cards?.[idx]?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        return;
      }
      const wrapperTop = wrapper.offsetTop;
      const scrollable = wrapper.offsetHeight - window.innerHeight;
      const targetY = wrapperTop + (idx / Math.max(1, dots.length - 1)) * scrollable;
      window.scrollTo({ top: targetY, behavior: 'smooth' });
    });
  });

  updateOnScroll();
}

// ---------------------------------------------------------------------------
// Anime.js Hero Entrance & SVG Path Drawing
// ---------------------------------------------------------------------------
function initAnimeMotion() {
  if (REDUCED_MOTION) return;

  anime({
    targets: '.hero-anim',
    opacity: [0, 1],
    translateY: [20, 0],
    delay: anime.stagger(90),
    duration: 750,
    easing: 'easeOutExpo'
  });

  const svgLine = document.querySelector('.anime-svg-line');
  if (svgLine) {
    const len = svgLine.getTotalLength();
    svgLine.style.strokeDasharray = len;
    svgLine.style.strokeDashoffset = len;
    anime({
      targets: svgLine,
      strokeDashoffset: [len, 0],
      duration: 1600,
      easing: 'easeInOutSine',
      loop: true,
      direction: 'alternate',
      endDelay: 800
    });
  }
}

// ---------------------------------------------------------------------------
// Three.js Systems Core
// ---------------------------------------------------------------------------
function initHero3D() {
  const canvas = document.getElementById('hero-3d-canvas');
  if (!canvas || !canvas.parentElement) return;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  } catch {
    return;
  }

  const container = canvas.parentElement;
  const scene = new THREE.Scene();
  const initW = Math.max(container.clientWidth, 1);
  const initH = Math.max(container.clientHeight, 1);
  const camera = new THREE.PerspectiveCamera(40, initW / initH, 0.1, 100);
  camera.position.set(0, 0, 5.6);

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(initW, initH, false);

  const rootGroup = new THREE.Group();
  scene.add(rootGroup);

  const outerGeo = new THREE.IcosahedronGeometry(1.5, 1);
  const outerWire = new THREE.WireframeGeometry(outerGeo);
  const outerMat = new THREE.LineBasicMaterial({ color: 0x0a84ff, transparent: true, opacity: 0.42 });
  const outerMesh = new THREE.LineSegments(outerWire, outerMat);
  rootGroup.add(outerMesh);

  const coreGeo = new THREE.OctahedronGeometry(0.86, 0);
  const coreMat = new THREE.MeshStandardMaterial({
    color: 0x30d158,
    emissive: 0x064e3b,
    emissiveIntensity: 0.45,
    metalness: 0.85,
    roughness: 0.18,
    flatShading: true
  });
  const coreMesh = new THREE.Mesh(coreGeo, coreMat);
  rootGroup.add(coreMesh);

  const ringGeo1 = new THREE.TorusGeometry(2.15, 0.012, 12, 110);
  const ringMat1 = new THREE.MeshBasicMaterial({ color: 0x64d2ff, transparent: true, opacity: 0.4 });
  const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
  ring1.rotation.x = Math.PI * 0.38;
  ring1.rotation.y = Math.PI * 0.12;
  rootGroup.add(ring1);

  const ringGeo2 = new THREE.TorusGeometry(1.88, 0.009, 10, 96);
  const ringMat2 = new THREE.MeshBasicMaterial({ color: 0xbf5af2, transparent: true, opacity: 0.3 });
  const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
  ring2.rotation.x = -Math.PI * 0.28;
  ring2.rotation.y = Math.PI * 0.35;
  rootGroup.add(ring2);

  const count = 80;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 10;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 6;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 4 - 1;
  }
  const starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const starMat = new THREE.PointsMaterial({ color: 0xf5f5f7, size: 0.032, transparent: true, opacity: 0.45 });
  scene.add(new THREE.Points(starGeo, starMat));

  const keyLight = new THREE.DirectionalLight(0x0a84ff, 2.4);
  keyLight.position.set(3, 4, 5);
  scene.add(keyLight);

  const rimLight = new THREE.DirectionalLight(0x30d158, 2.0);
  rimLight.position.set(-4, -2, 3);
  scene.add(rimLight);
  scene.add(new THREE.AmbientLight(0xffffff, 0.5));

  let targetX = 0;
  let targetY = 0;
  container.addEventListener('pointermove', e => {
    const rect = container.getBoundingClientRect();
    targetX = ((e.clientX - rect.left) / rect.width - 0.5) * 0.85;
    targetY = ((e.clientY - rect.top) / rect.height - 0.5) * 0.85;
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

  let isVisible = true;
  const io = new IntersectionObserver(entries => {
    isVisible = entries[0]?.isIntersecting ?? true;
  });
  io.observe(container);

  if (REDUCED_MOTION) {
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

    outerMesh.rotation.y += dt * 0.22;
    outerMesh.rotation.x += dt * 0.11;
    coreMesh.rotation.y -= dt * 0.36;
    ring1.rotation.z += dt * 0.18;
    ring2.rotation.z -= dt * 0.14;

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
renderBenchmarkChart('ram');
initScrollX();
initAnimeMotion();
initHero3D();
bindSpotlights();

Promise.all(PROJECTS.map(fetchRepoTelemetry)).then(() => {
  renderProjects();
  renderDistributionTable();
});

const initialHash = window.location.hash.replace('#', '');
if (initialHash) {
  const match = PROJECTS.find(p => p.id === initialHash);
  if (match) openDetailsModal(match);
}
