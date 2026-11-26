import * as THREE from 'three';

const GITHUB_USER = 'shivamkumarmehta64-sketch';
const CACHE_TTL_MS = 10 * 60 * 1000;
let staticReleasesPromise = null;

function loadStaticReleases() {
  if (!staticReleasesPromise) {
    staticReleasesPromise = fetch('./data/releases.json')
      .then(res => (res.ok ? res.json() : null))
      .catch(() => null);
  }
  return staticReleasesPromise;
}

const PROJECTS = [
  {
    id: 'metshield-ai',
    name: 'MetShield-AI',
    repo: 'MetShield-AI',
    hasReleases: false,
    filter: 'web',
    domainLabel: 'MoES / IMD Real-Time QC',
    statusText: 'SIH 2026 · LIVE',
    statusColor: '#2fb36d',
    statusBg: 'rgba(47, 179, 109, 0.12)',
    iconClass: 'fa-solid fa-shield-halved',
    summary:
      'Real-time 3-tier quality control and Explainable AI anomaly detection for Automatic Weather Stations, compliant with WMO-No. 8 meteorological limits.',
    highlights: [
      'Tier 1–3 QC checks separating convective storms (ΔP + ΔRH) from thermistor faults',
      '223/223 Vitest tests, bounded rate-limits, streaming body caps & sanitized telemetry',
      'Live Web Sensors API barometer fallback & official NIC/IMD CSV audit export'
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
    statusColor: '#3b9eff',
    statusBg: 'rgba(59, 158, 255, 0.12)',
    iconClass: 'fa-solid fa-globe',
    summary:
      'Fast, privacy-first native Windows 10/11 browser (~460 KB executable, <60 MB RAM) engineered in C# (.NET 4.8) + Microsoft WebView2 with zero cloud telemetry.',
    highlights: [
      '3-Layer AdShield (domain blocking, YouTube payload stripping & auto-skip)',
      'Fail-closed SHA-256 updater, Authenticode bootstrapper check & 22/22 security tests',
      'Windows DPAPI local password vault, SHA-pinned CI & black://home Speed Dial'
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
    statusColor: '#d49a2a',
    statusBg: 'rgba(212, 154, 42, 0.12)',
    iconClass: 'fa-brands fa-youtube',
    summary:
      'Lightweight, distraction-free YouTube desktop client engineered in C# (.NET 4.8) and Microsoft WebView2 with zero telemetry and minimal RAM consumption.',
    highlights: [
      'Pure desktop playback without heavy Chromium/Electron memory overhead',
      'NavigationStarting domain allowlist guarding against untrusted redirects',
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
    statusColor: '#d49a2a',
    statusBg: 'rgba(212, 154, 42, 0.12)',
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
    statusColor: '#3b9eff',
    statusBg: 'rgba(59, 158, 255, 0.12)',
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
    statusColor: '#2fb36d',
    statusBg: 'rgba(47, 179, 109, 0.12)',
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
  },
  {
    id: 'blue-browser-tauri',
    name: 'Blue Browser (Tauri)',
    repo: 'Blue-Browser-Tauri',
    hasReleases: false,
    filter: 'desktop',
    domainLabel: 'Cross-Platform Rust Browser',
    statusText: 'TAURI · RUST',
    statusColor: '#3b9eff',
    statusBg: 'rgba(59, 158, 255, 0.12)',
    iconClass: 'fa-solid fa-compass',
    summary:
      'Cross-platform companion to Black Browser engineered in Rust (Tauri) + TypeScript/React, targeting Windows, macOS, and Linux with native system WebViews.',
    highlights: [
      'Rust core backend paired with TypeScript/React chrome for low memory overhead',
      'Cross-platform packaging for Windows, macOS, and Linux desktops',
      'Zero-telemetry architecture sharing Black Browser privacy principles'
    ],
    tech: ['Rust', 'Tauri', 'TypeScript', 'React', 'Cross-Platform'],
    runtime: 'Rust / Tauri',
    footprint: 'Native WebView',
    platform: 'Win / macOS / Linux',
    defaultStars: 0,
    defaultForks: 0,
    defaultVersion: 'v0.1.0',
    website: null,
    github: `https://github.com/${GITHUB_USER}/Blue-Browser-Tauri`,
    iconImg: null,
    detailImg: null,
    architecture:
      'Tauri desktop shell combining a Rust IPC/process backend with a TypeScript + React frontend.'
  },
  {
    id: 'electronics-calculator',
    name: 'Electronics Calculator',
    repo: 'Electronics_Calculator',
    hasReleases: false,
    filter: 'security',
    domainLabel: 'ECE Scientific Android App',
    statusText: 'KOTLIN · ECE',
    statusColor: '#d49a2a',
    statusBg: 'rgba(212, 154, 42, 0.12)',
    iconClass: 'fa-solid fa-microchip',
    summary:
      'Native Kotlin Android scientific calculator built for ECE coursework — featuring trigonometric, logarithmic, factorial, and real-time mXparser expression evaluation.',
    highlights: [
      'Real-time mathematical expression parsing via mXparser (sin, cos, tan, log, n!)',
      'Clean Material mobile UI tuned for fast lab & exam calculations',
      '100% offline Android execution with zero network permissions'
    ],
    tech: ['Kotlin', 'Android', 'mXparser', 'ECE Lab Tool'],
    runtime: 'Android / Kotlin',
    footprint: 'Offline APK',
    platform: 'Android',
    defaultStars: 0,
    defaultForks: 0,
    defaultVersion: 'v1.0',
    website: null,
    github: `https://github.com/${GITHUB_USER}/Electronics_Calculator`,
    iconImg: null,
    detailImg: null,
    architecture:
      'Native Kotlin Android application delegating symbolic/scientific expression evaluation to mXparser offline.'
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

  // Prefer build-time static releases.json (zero GitHub API rate-limit issues at 1,000+ users)
  const staticJson = await loadStaticReleases();
  const staticEntry = staticJson?.repos?.[project.repo];
  if (staticEntry) {
    const data = {
      stars: staticEntry.stars ?? fallback.stars,
      forks: staticEntry.forks ?? fallback.forks,
      version: staticEntry.version || fallback.version,
      downloadUrl: sanitizeHttpUrl(staticEntry.downloadUrl),
      assetName: staticEntry.assetName || null,
      assetSize: staticEntry.assetSizeBytes ? formatBytes(staticEntry.assetSizeBytes) : '',
      zipUrl: sanitizeHttpUrl(staticEntry.zipUrl),
      shaUrl: sanitizeHttpUrl(staticEntry.shaUrl)
    };
    liveCache.set(project.id, data);
    return data;
  }

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
let openModalProjectId = null;
let lenisInstance = null;

function openModalShell() {
  lastFocusedElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  document.body.style.overflow = 'hidden';
  if (lenisInstance) lenisInstance.stop();
  modal.removeAttribute('inert');
  modal.setAttribute('aria-hidden', 'false');
  modal.classList.add('open');
  if (modalCloseBtn) modalCloseBtn.focus();
}

function closeModal() {
  if (!modal) return;
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  modal.setAttribute('inert', '');
  if (modalExternal) modalExternal.style.display = 'none';
  modalBody.innerHTML = '';
  openModalProjectId = null;
  document.body.style.overflow = '';
  if (lenisInstance) lenisInstance.start();
  if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
    lastFocusedElement.focus();
    lastFocusedElement = null;
  }
}

function openPreviewModal(project) {
  const safeUrl = sanitizeHttpUrl(project.website);
  if (!safeUrl || !modal) return;
  openModalProjectId = null;
  modalTitle.innerHTML = `<i class="${escapeHtml(project.iconClass)}" style="color: ${escapeHtml(project.statusColor)};"></i> ${escapeHtml(project.name)} — Live Preview`;
  modalExternal.href = safeUrl;
  modalExternal.style.display = 'inline-flex';
  if (project.id === 'metshield-ai') {
    modalBody.style.padding = '1.35rem';
    modalBody.innerHTML = `
      ${project.detailImg ? `<img src="${escapeHtml(project.detailImg)}" alt="${escapeHtml(project.name)} preview" style="width: 100%; max-height: 360px; object-fit: cover; object-position: top; border-radius: 12px; border: 1px solid var(--border); margin-bottom: 1rem;" />` : ''}
      <p style="color: var(--text-secondary); margin-bottom: 1rem;">${escapeHtml(project.name)} enforces strict <code>X-Frame-Options: DENY</code> security headers and cannot be embedded inside an iframe. Launch the live portal directly in a new tab:</p>
      <a href="${safeUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm"><i class="fa-solid fa-arrow-up-right-from-square"></i> Open ${escapeHtml(project.name)} Portal</a>`;
  } else {
    modalBody.style.padding = '0';
    modalBody.innerHTML = `<iframe class="preview-frame" src="${safeUrl}" title="${escapeHtml(project.name)} live preview" loading="lazy" sandbox="allow-scripts allow-same-origin allow-forms allow-popups" referrerpolicy="no-referrer"></iframe>`;
  }
  openModalShell();
}

function openDetailsModal(project) {
  if (!modal) return;
  openModalProjectId = project.id;
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
  if (e.key === 'Escape') {
    closeModal();
    const drawer = document.getElementById('mobile-nav-drawer');
    const mobBtn = document.getElementById('mobile-nav-btn');
    if (drawer?.classList.contains('open')) {
      drawer.classList.remove('open');
      mobBtn?.setAttribute('aria-expanded', 'false');
    }
  }
  if (e.key === 'Tab' && modal?.classList.contains('open')) {
    const focusables = Array.from(
      modal.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')
    ).filter(el => el.offsetParent !== null);
    if (focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
});

function openResumeModal() {
  if (!modal) return;
  modalTitle.innerHTML = '<i class="fa-solid fa-file-lines" style="color: var(--accent);"></i> Shivam Kumar Mehta — ECE &amp; Systems Resume';
  modalExternal.style.display = 'none';
  modalBody.style.padding = '1.65rem';
  modalBody.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:1rem;padding-bottom:1.1rem;border-bottom:1px solid var(--border);margin-bottom:1.25rem;">
      <div>
        <h3 style="font-size:1.55rem;font-weight:800;letter-spacing:-0.025em;margin-bottom:0.2rem;">Shivam Kumar Mehta</h3>
        <div style="color:var(--text-secondary);font-size:0.9rem;margin-bottom:0.45rem;">B.Tech Electronics &amp; Communication Engineering · Purnea College of Engineering (BEU, Bihar)</div>
        <div class="mono" style="display:flex;flex-wrap:wrap;gap:0.75rem;font-size:0.76rem;color:var(--text-muted);">
          <span>shivamkumarmehta64@gmail.com</span>
          <span>·</span>
          <a href="https://github.com/shivamkumarmehta64-sketch" target="_blank" rel="noopener noreferrer" style="color:var(--accent);">github.com/shivamkumarmehta64-sketch</a>
          <span>·</span>
          <a href="https://www.linkedin.com/in/shivam-kumar-mehta" target="_blank" rel="noopener noreferrer" style="color:var(--accent);">linkedin.com/in/shivam-kumar-mehta</a>
        </div>
      </div>
      <button id="print-resume-btn" type="button" class="btn btn-primary btn-sm"><i class="fa-solid fa-print"></i> Print / Save PDF</button>
    </div>

    <div style="display:grid;gap:1.25rem;font-size:0.88rem;line-height:1.55;">
      <div>
        <div class="mono" style="font-size:0.72rem;letter-spacing:0.12em;text-transform:uppercase;color:var(--accent);margin-bottom:0.45rem;">Education</div>
        <div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:0.5rem;">
          <strong>B.Tech in Electronics &amp; Communication Engineering (ECE)</strong>
          <span class="mono" style="color:var(--text-muted);font-size:0.78rem;">2023 – Present</span>
        </div>
        <div style="color:var(--text-secondary);">Purnea College of Engineering — Bihar Engineering University (BEU), Bihar</div>
      </div>

      <div>
        <div class="mono" style="font-size:0.72rem;letter-spacing:0.12em;text-transform:uppercase;color:var(--accent);margin-bottom:0.45rem;">Technical Skills (Verified Across 13 Public Repositories)</div>
        <div style="display:grid;gap:0.35rem;color:var(--text-secondary);">
          <div><strong style="color:var(--text);">Systems &amp; Desktop:</strong> C# (.NET 4.8), WinForms, Microsoft WebView2, Rust, Tauri v2, Windows DPAPI, Authenticode</div>
          <div><strong style="color:var(--text);">Web &amp; Frontend:</strong> TypeScript, Next.js (App Router), React, Tailwind CSS, HTML5/CSS3, Three.js (WebGL2)</div>
          <div><strong style="color:var(--text);">IoT, Mobile &amp; ECE:</strong> Kotlin, Android SDK, mXparser, WMO-No. 8 Telemetry QC, Web Generic Sensor API</div>
          <div><strong style="color:var(--text);">Security &amp; Testing:</strong> ML-KEM-768 (FIPS 203), AES-256-GCM, Ed25519, STIX 2.1, Vitest, Playwright, SHA-Pinned CI/CD</div>
        </div>
      </div>

      <div>
        <div class="mono" style="font-size:0.72rem;letter-spacing:0.12em;text-transform:uppercase;color:var(--accent);margin-bottom:0.55rem;">Key Engineering Projects</div>
        <div style="display:grid;gap:0.75rem;color:var(--text-secondary);">
          <div>
            <div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:0.5rem;">
              <strong style="color:var(--text);">MetShield-AI (MoES / IMD — SIH 2026)</strong>
              <span class="mono" style="font-size:0.75rem;color:var(--emerald);">223 / 223 Vitest · Next.js / TypeScript</span>
            </div>
            <div>Built 3-tier WMO-No. 8 quality control separating convective storms (ΔP ≤ -2.5 hPa + ΔRH ≥ +15%) from thermistor faults across 20 live AWS nodes, with bounded rate limits and streaming body guards.</div>
          </div>
          <div>
            <div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:0.5rem;">
              <strong style="color:var(--text);">Black Browser v9.1.0 &amp; BlackTube v1.0.0</strong>
              <span class="mono" style="font-size:0.75rem;color:var(--accent);">~460 KB · &lt;60 MB RAM · 22/22 Security Tests</span>
            </div>
            <div>Engineered native Windows 10/11 C# (.NET 4.8) + WebView2 apps with 3-Layer AdShield, DPAPI local password vault, Authenticode verification, and fail-closed SHA-256 releases.</div>
          </div>
          <div>
            <div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:0.5rem;">
              <strong style="color:var(--text);">Quantum Drone GCS &amp; aerotech Forensics</strong>
              <span class="mono" style="font-size:0.75rem;color:var(--text-muted);">ML-KEM-768 · Ed25519 · Bihar PS-02</span>
            </div>
            <div>Developed an air-gapped UAV Ground Control Station (ML-KEM-768 + AES-256-GCM) and a Python/Streamlit Android APK forensic triage pipeline with Ed25519 custody proofs and STIX 2.1 export.</div>
          </div>
          <div>
            <div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:0.5rem;">
              <strong style="color:var(--text);">Blue Browser (Tauri v0.1.0) &amp; Electronics Calculator</strong>
              <span class="mono" style="font-size:0.75rem;color:var(--text-muted);">Rust / Tauri · Kotlin / mXparser</span>
            </div>
            <div>Shipped a cross-platform Rust/React desktop browser (Windows/macOS/Linux) and an offline Kotlin Android scientific calculator tailored for ECE lab coursework.</div>
          </div>
        </div>
      </div>
    </div>
  `;
  const printBtn = document.getElementById('print-resume-btn');
  if (printBtn) printBtn.addEventListener('click', () => window.print());
  openModalShell();
}

function buildCardStageHtml(p) {
  if (p.id === 'metshield-ai') {
    return `
      <div class="stage-metshield">
        <div class="stage-ms-head">
          <div class="stage-ms-id">
            <img src="assets/jatayu-seal.jpg" alt="MetShield-AI Seal" loading="lazy" decoding="async" />
            <span>NAWS-QMS v4.2</span>
          </div>
          <span class="stage-ms-pill mono">WMO-No. 8</span>
        </div>
        <svg viewBox="0 0 320 74" class="stage-ms-wave" aria-hidden="true">
          <defs>
            <linearGradient id="msGradCard" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#30d158" stop-opacity="0.32" />
              <stop offset="100%" stop-color="#30d158" stop-opacity="0" />
            </linearGradient>
          </defs>
          <path d="M0,54 C35,52 60,48 92,42 C126,36 146,16 178,20 C210,24 234,48 270,44 C292,42 306,34 320,32 L320,74 L0,74 Z" fill="url(#msGradCard)" />
          <path d="M0,54 C35,52 60,48 92,42 C126,36 146,16 178,20 C210,24 234,48 270,44 C292,42 306,34 320,32" fill="none" stroke="#30d158" stroke-width="2" />
          <path d="M0,26 C40,28 70,32 106,38 C142,46 160,60 192,56 C224,52 260,34 320,30" fill="none" stroke="#0a84ff" stroke-width="1.6" stroke-dasharray="4 3" />
        </svg>
        <div class="stage-ms-metrics">
          <div class="stage-ms-cell"><span>QC Tiers</span><strong class="mono">3-Tier</strong></div>
          <div class="stage-ms-cell"><span>Nodes</span><strong class="mono">20 AWS</strong></div>
          <div class="stage-ms-cell"><span>Vitest</span><strong class="mono" style="color: var(--emerald);">223/223</strong></div>
        </div>
      </div>`;
  }
  if (p.detailImg) {
    return `<img src="${escapeHtml(p.detailImg)}" alt="${escapeHtml(p.name)} Preview" class="card-stage-inner" loading="lazy" decoding="async" />`;
  }
  if (p.iconImg) {
    return `
      <div class="stage-centered" style="--stage-glow: ${escapeHtml(p.statusBg)};">
        <img src="${escapeHtml(p.iconImg)}" alt="${escapeHtml(p.name)}" loading="lazy" decoding="async" />
        <div class="stage-centered-meta mono">${escapeHtml(p.runtime)} · ${escapeHtml(p.footprint)}</div>
      </div>`;
  }
  return `
    <div class="stage-centered" style="--stage-glow: ${escapeHtml(p.statusBg)};">
      <div class="stage-fa-badge" style="color: ${escapeHtml(p.statusColor)};">
        <i class="${escapeHtml(p.iconClass)}" aria-hidden="true"></i>
      </div>
      <div class="stage-centered-meta mono">${escapeHtml(p.runtime)} · ${escapeHtml(p.footprint)}</div>
    </div>`;
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

      const primaryAction = safeDl
        ? `<a href="${safeDl}" target="_blank" rel="noopener noreferrer" class="btn btn-emerald btn-sm">Download${meta.assetSize ? ` (${escapeHtml(meta.assetSize)})` : ''}</a>`
        : safeWeb
        ? `<button class="btn btn-primary btn-sm" data-action="preview" data-id="${escapeHtml(p.id)}">Live Preview</button>`
        : !p.isPrivate && safeGh
        ? `<a href="${safeGh}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm">Source</a>`
        : '';

      return `
      <article class="project-card" id="card-${escapeHtml(p.id)}">
        <div class="card-stage">
          ${buildCardStageHtml(p)}
        </div>

        <div class="card-body">
          <div class="card-top">
            <h3 class="card-title">${escapeHtml(p.name)}</h3>
            <span class="card-status mono" style="color: ${escapeHtml(p.statusColor)};">${escapeHtml(p.statusText)}</span>
          </div>

          <p class="card-desc">${escapeHtml(p.summary)}</p>

          <div class="card-meta-line mono">
            ${escapeHtml(p.domainLabel)} · ${escapeHtml(meta.version || p.defaultVersion)}
          </div>

          <div class="card-footer">
            ${primaryAction}
            <button class="btn btn-secondary btn-sm" data-action="details" data-id="${escapeHtml(p.id)}">Details</button>
            <button class="btn btn-secondary btn-sm spacer" data-action="share" data-id="${escapeHtml(p.id)}" title="Copy direct link" aria-label="Copy direct link for ${escapeHtml(p.name)}"><i class="fa-solid fa-link" aria-hidden="true"></i></button>
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

  document.querySelectorAll('[data-open-details]').forEach(btn => {
    btn.addEventListener('click', () => {
      const proj = PROJECTS.find(p => p.id === btn.getAttribute('data-open-details'));
      if (proj) openDetailsModal(proj);
    });
  });

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

  // 4 Interactive Ecosystem & Timeline Satellites orbiting the GitHub/ECE Core
  const satGroup = new THREE.Group();
  const satSpecs = [
    { id: 'metshield-ai', label: 'METSHIELD-AI · SIH 2026 (223 VITEST)', color: 0x2fb36d, hex: '#2fb36d', angle: 0, radius: 2.05 },
    { id: 'black-browser', label: 'BLACK BROWSER · v9.1.0 (~460 KB)', color: 0x3b9eff, hex: '#3b9eff', angle: Math.PI * 0.5, radius: 2.05 },
    { id: 'quantum-drone-gcs', label: 'QUANTUM DRONE · ML-KEM-768 PQC', color: 0x5e9eff, hex: '#5e9eff', angle: Math.PI, radius: 2.05 },
    { id: 'timeline', label: 'TIMELINE · 2023–26 BEU ECE → RELEASES', color: 0xd49a2a, hex: '#d49a2a', angle: Math.PI * 1.5, radius: 2.05 }
  ];
  const satGeo = new THREE.SphereGeometry(0.085, 18, 18);
  const satMeshes = [];
  satSpecs.forEach(spec => {
    const sat = new THREE.Mesh(satGeo, new THREE.MeshBasicMaterial({ color: spec.color }));
    sat.position.set(Math.cos(spec.angle) * spec.radius, 0, Math.sin(spec.angle) * spec.radius);
    sat.userData = spec;
    satGroup.add(sat);
    satMeshes.push(sat);
  });
  satGroup.rotation.x = Math.PI * 0.36;
  satGroup.rotation.y = Math.PI * 0.12;
  rootGroup.add(satGroup);

  // Dynamic connection beam from ECE/GitHub Core to active satellite
  const beamGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 0)]);
  const beamMat = new THREE.LineBasicMaterial({ color: 0x3b9eff, transparent: true, opacity: 0 });
  const beamLine = new THREE.Line(beamGeo, beamMat);
  scene.add(beamLine);

  const hudDot = document.getElementById('orbit-hud-dot');
  const hudText = document.getElementById('orbit-hud-text');
  const orbitChips = Array.from(document.querySelectorAll('.orbit-chip[data-orbit-id]'));
  let activeOrbitId = null;

  function setActiveOrbit(id) {
    activeOrbitId = id;
    const spec = satSpecs.find(s => s.id === id);
    if (hudText && hudDot) {
      if (spec) {
        hudText.textContent = spec.label;
        hudDot.style.background = spec.hex;
      } else {
        hudText.textContent = 'CORE · 13 GITHUB REPOS';
        hudDot.style.background = 'var(--emerald)';
      }
    }
    orbitChips.forEach(chip => {
      chip.classList.toggle('active', chip.getAttribute('data-orbit-id') === id);
    });
  }

  function triggerOrbitAction(id) {
    if (id === 'timeline') {
      const tl = document.getElementById('timeline');
      if (tl) tl.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    const proj = PROJECTS.find(p => p.id === id);
    if (proj) openDetailsModal(proj);
  }

  orbitChips.forEach(chip => {
    const id = chip.getAttribute('data-orbit-id');
    chip.addEventListener('pointerenter', () => setActiveOrbit(id));
    chip.addEventListener('pointerleave', () => setActiveOrbit(null));
    chip.addEventListener('click', () => triggerOrbitAction(id));
  });

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

  const raycaster = new THREE.Raycaster();
  const pointerNdc = new THREE.Vector2(99, 99);
  let targetX = 0;
  let targetY = 0;
  let pulseVelocity = 0;
  let hoveredMesh = null;

  container.addEventListener('pointermove', e => {
    const rect = container.getBoundingClientRect();
    targetX = ((e.clientX - rect.left) / rect.width - 0.5) * 0.75;
    targetY = ((e.clientY - rect.top) / rect.height - 0.5) * 0.75;
    pointerNdc.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    pointerNdc.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointerNdc, camera);
    const hits = raycaster.intersectObjects(satMeshes, false);
    hoveredMesh = hits[0]?.object || null;
    canvas.style.cursor = hoveredMesh ? 'pointer' : 'grab';
    if (hoveredMesh) setActiveOrbit(hoveredMesh.userData.id);
    else if (!e.target.closest('.orbit-chip')) setActiveOrbit(null);
  });
  container.addEventListener('pointerleave', () => {
    targetX = 0;
    targetY = 0;
    hoveredMesh = null;
    canvas.style.cursor = 'grab';
    setActiveOrbit(null);
  });
  container.addEventListener('pointerdown', e => {
    pulseVelocity = 0.08;
    if (hoveredMesh && e.target === canvas) {
      triggerOrbitAction(hoveredMesh.userData.id);
    }
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
  window.addEventListener('pagehide', () => renderer.dispose(), { once: true });

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

    // Satellite scale & dynamic radial beam from Core to active node
    let activeSat = null;
    for (const sat of satMeshes) {
      const isActive = sat.userData.id === activeOrbitId;
      const targetScale = isActive ? 1.65 : 1;
      sat.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.16);
      if (isActive) activeSat = sat;
    }
    if (activeSat) {
      const corePos = new THREE.Vector3();
      const satPos = new THREE.Vector3();
      coreMesh.getWorldPosition(corePos);
      activeSat.getWorldPosition(satPos);
      beamGeo.setFromPoints([corePos, satPos]);
      beamMat.color.setHex(activeSat.userData.color);
      beamMat.opacity += (0.75 - beamMat.opacity) * 0.2;
    } else {
      beamMat.opacity += (0 - beamMat.opacity) * 0.2;
    }

    renderer.render(scene, camera);
  }
  requestAnimationFrame(animate);
}

// ---------------------------------------------------------------------------
// Scroll-Reveal, Staggered Cascade & Telemetry Counter
// ---------------------------------------------------------------------------
function animateCounter(el, targetValue, duration = 900) {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion || Number.isNaN(targetValue)) {
    el.textContent = String(targetValue);
    return;
  }
  const start = performance.now();
  function tick(now) {
    const t = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    el.textContent = String(Math.round(eased * targetValue));
    if (t < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

let stripObserved = false;

function observeReveals() {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.querySelectorAll('.flagship-row').forEach(row => {
    row.classList.add('reveal', row.classList.contains('reversed') ? 'reveal-right' : 'reveal-left');
  });

  document.querySelectorAll('.ece-node').forEach((node, idx) => {
    node.classList.add('reveal');
    node.style.setProperty('--reveal-delay', `${idx * 55}ms`);
  });

  document.querySelectorAll('.bento-tile, .spec-item').forEach((item, idx) => {
    item.classList.add('reveal');
    item.style.setProperty('--reveal-delay', `${idx * 50}ms`);
  });

  document.querySelectorAll('.timeline-item').forEach((item, idx) => {
    item.classList.add('reveal');
    item.style.setProperty('--reveal-delay', `${idx * 55}ms`);
  });

  document.querySelectorAll('.matrix-box, .creator-band, .section-header').forEach(el => {
    el.classList.add('reveal');
  });

  document.querySelectorAll('#projects-grid .project-card').forEach((card, idx) => {
    card.classList.add('card-enter');
    card.style.setProperty('--card-delay', `${Math.min(idx, 7) * 55}ms`);
  });

  const revealTargets = document.querySelectorAll('.reveal');
  const cardTargets = document.querySelectorAll('#projects-grid .project-card.card-enter');
  if (reducedMotion || !('IntersectionObserver' in window)) {
    revealTargets.forEach(el => el.classList.add('in-view'));
    cardTargets.forEach(el => el.classList.add('in-view'));
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
    { threshold: 0.08, rootMargin: '0px 0px -15% 0px' }
  );

  revealTargets.forEach(el => {
    if (!el.classList.contains('in-view')) obs.observe(el);
  });

  const cardObs = new IntersectionObserver(
    entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          cardObs.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.01, rootMargin: '0px 0px 40px 0px' }
  );

  cardTargets.forEach(el => {
    if (!el.classList.contains('in-view')) cardObs.observe(el);
  });

  const strip = document.getElementById('gh-telemetry-strip');
  if (strip && !stripObserved) {
    stripObserved = true;
    const stripObs = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            strip.querySelectorAll('.gh-metric-val').forEach(valEl => {
              const num = parseInt(valEl.textContent.trim(), 10);
              if (!Number.isNaN(num)) animateCounter(valEl, num);
            });
            stripObs.unobserve(strip);
          }
        }
      },
      { threshold: 0.25 }
    );
    stripObs.observe(strip);
  }
}

// ---------------------------------------------------------------------------
// Scroll UI: Progress Hairline, Active Nav, Back-to-Top & Lenis Smooth Scroll
// ---------------------------------------------------------------------------
function initScrollUI() {
  const progressBar = document.getElementById('scroll-progress');
  const backToTopBtn = document.getElementById('back-to-top');
  const navLinks = Array.from(document.querySelectorAll('.nav-links a[href^="#"]'));
  const sections = navLinks
    .map(link => {
      const id = link.getAttribute('href')?.slice(1);
      return id ? { link, el: document.getElementById(id) } : null;
    })
    .filter(item => item && item.el);

  let lenisLocal = null;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!reducedMotion) {
    Promise.all([
      import('https://cdn.jsdelivr.net/npm/lenis@1.1.20/+esm'),
      import('https://cdn.jsdelivr.net/npm/gsap@3.12.5/+esm'),
      import('https://cdn.jsdelivr.net/npm/gsap@3.12.5/ScrollTrigger/+esm')
    ])
      .then(([{ default: Lenis }, { gsap }, { ScrollTrigger }]) => {
        gsap.registerPlugin(ScrollTrigger);
        lenisLocal = new Lenis({
          duration: 1.05,
          easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          smoothWheel: true
        });
        lenisInstance = lenisLocal;
        lenisLocal.on('scroll', () => {
          updateScrollState();
          ScrollTrigger.update();
        });
        gsap.ticker.add(time => {
          lenisLocal.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);

        const heroStage = document.querySelector('.hero-stage');
        if (heroStage) {
          gsap.to(heroStage, {
            y: -28,
            ease: 'none',
            scrollTrigger: {
              trigger: '.hero',
              start: 'top top',
              end: 'bottom top',
              scrub: 0.6
            }
          });
        }
      })
      .catch(() => {
        // Fallback to native smooth scrolling
      });
  }

  function updateScrollState() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop || 0;
    const docHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight) - window.innerHeight;
    const progress = docHeight > 0 ? Math.min(Math.max(scrollTop / docHeight, 0), 1) : 0;
    if (progressBar) progressBar.style.transform = `scaleX(${progress.toFixed(4)})`;
    if (backToTopBtn) backToTopBtn.classList.toggle('visible', scrollTop > 420);

    const probeY = scrollTop + 140;
    let activeId = null;
    for (const { el } of sections) {
      if (el.offsetTop <= probeY) activeId = el.id;
    }
    for (const { link, el } of sections) {
      const isMatch = el.id === activeId;
      link.classList.toggle('active', isMatch);
      if (isMatch) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    }
  }

  window.addEventListener('scroll', updateScrollState, { passive: true });
  updateScrollState();

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      if (lenisInstance) lenisInstance.scrollTo(target, { offset: -72 });
      else target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
    });
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      if (lenisInstance) lenisInstance.scrollTo(0);
      else window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
    });
  }

  const copyEmailBtn = document.getElementById('copy-email-btn');
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', () => {
      const email = 'shivamkumarmehta64@gmail.com';
      if (navigator.clipboard) {
        navigator.clipboard.writeText(email).then(() => showToast(`Copied ${email}`)).catch(() => showToast(email));
      } else {
        showToast(email);
      }
    });
  }

  const themeBtn = document.getElementById('theme-toggle');
  function syncThemeUI(theme) {
    if (!themeBtn) return;
    const isLight = theme === 'light';
    themeBtn.setAttribute('aria-pressed', String(isLight));
    themeBtn.setAttribute('aria-label', isLight ? 'Switch to dark mode' : 'Switch to light mode');
    themeBtn.innerHTML = isLight
      ? '<i class="fa-solid fa-moon" aria-hidden="true"></i>'
      : '<i class="fa-solid fa-sun" aria-hidden="true"></i>';
  }
  syncThemeUI(document.documentElement.getAttribute('data-theme') || 'dark');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
      const next = current === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch {}
      syncThemeUI(next);
    });
  }
  const openResumeBtn = document.getElementById('open-resume-btn');
  if (openResumeBtn) openResumeBtn.addEventListener('click', openResumeModal);

  const mobBtn = document.getElementById('mobile-nav-btn');
  const mobDrawer = document.getElementById('mobile-nav-drawer');
  if (mobBtn && mobDrawer) {
    mobBtn.addEventListener('click', () => {
      const next = !mobDrawer.classList.contains('open');
      mobDrawer.classList.toggle('open', next);
      mobBtn.setAttribute('aria-expanded', String(next));
    });
    mobDrawer.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        mobDrawer.classList.remove('open');
        mobBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }
}

// ---------------------------------------------------------------------------
// ScrollX-UI Craft: Cursor Spotlight Cards & Animated Filter Tabs
// ---------------------------------------------------------------------------
function initSpotlightCards() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const selector = '.project-card, .ece-node, .flagship-media, .bento-tile';
  document.addEventListener('pointermove', e => {
    const card = e.target instanceof Element ? e.target.closest(selector) : null;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${(e.clientX - rect.left).toFixed(1)}px`);
    card.style.setProperty('--my', `${(e.clientY - rect.top).toFixed(1)}px`);
  }, { passive: true });
}

function initAnimatedFilterTabs() {
  const bar = document.querySelector('.filter-bar');
  if (!bar) return;

  const indicator = document.createElement('span');
  indicator.className = 'filter-pill-indicator';
  indicator.setAttribute('aria-hidden', 'true');
  bar.prepend(indicator);
  bar.classList.add('has-indicator');

  const syncIndicator = () => {
    const active = bar.querySelector('.filter-btn.active');
    if (!active) return;
    indicator.style.width = `${active.offsetWidth}px`;
    indicator.style.height = `${active.offsetHeight}px`;
    indicator.style.transform = `translate(${active.offsetLeft}px, ${active.offsetTop}px)`;
  };

  bar.addEventListener('click', e => {
    if (e.target instanceof Element && e.target.closest('.filter-btn')) {
      requestAnimationFrame(syncIndicator);
    }
  });
  window.addEventListener('resize', syncIndicator, { passive: true });
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(syncIndicator);
  }
  requestAnimationFrame(syncIndicator);
}

// ---------------------------------------------------------------------------
// Bootstrap
// ---------------------------------------------------------------------------
renderProjects();
renderDistributionTable();
observeReveals();
initScrollUI();
initSpotlightCards();
initAnimatedFilterTabs();
initHero3D();

async function updateGitHubStrip() {
  const staticJson = await loadStaticReleases();
  if (staticJson && typeof staticJson.publicRepos === 'number') {
    const el = document.getElementById('gh-total-repos');
    if (el) el.textContent = String(staticJson.publicRepos);
  } else {
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
  if (openModalProjectId) {
    const openProj = PROJECTS.find(p => p.id === openModalProjectId);
    if (openProj) openDetailsModal(openProj);
  }
});

const initialHash = window.location.hash.replace('#', '');
if (initialHash) {
  const match = PROJECTS.find(p => p.id === initialHash);
  if (match) openDetailsModal(match);
}
