import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// =========================================================================
// 1. SOUND SYNTHESIZER ENGINE & AMBIENT SPACE DRONE (WEB AUDIO API)
// =========================================================================
let audioCtx = null;
let soundEnabled = localStorage.getItem('portfolio_sound') !== 'false';
let ambientDroneGain = null;
let ambientFilter = null;
let droneOsc1 = null;
let droneOsc2 = null;
let droneOsc3 = null;
let audioAnalyser = null;
const audioFreqData = new Uint8Array(32);
const audioTimeData = new Uint8Array(64);

const audioVisCanvas = document.getElementById('audio-visualizer-canvas');
const audioVisCtx = audioVisCanvas ? audioVisCanvas.getContext('2d') : null;

function initAudioContext() {
    if (!audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
            audioCtx = new AudioContext();
            try {
                audioAnalyser = audioCtx.createAnalyser();
                audioAnalyser.fftSize = 64;
                audioAnalyser.smoothingTimeConstant = 0.82;
                audioAnalyser.connect(audioCtx.destination);
            } catch (e) {
                console.warn("Analyser init skipped:", e);
            }
            setupAmbientDrone();
        }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}

function getAudioOutputNode() {
    if (audioAnalyser) return audioAnalyser;
    if (audioCtx) return audioCtx.destination;
    return null;
}

function setupAmbientDrone() {
    if (!audioCtx) return;
    try {
        const outNode = getAudioOutputNode();
        if (!outNode) return;

        ambientFilter = audioCtx.createBiquadFilter();
        ambientFilter.type = 'lowpass';
        ambientFilter.frequency.setValueAtTime(260, audioCtx.currentTime);
        ambientFilter.Q.setValueAtTime(3.5, audioCtx.currentTime);

        ambientDroneGain = audioCtx.createGain();
        ambientDroneGain.gain.setValueAtTime(soundEnabled ? 0.025 : 0.0001, audioCtx.currentTime);

        droneOsc1 = audioCtx.createOscillator();
        droneOsc1.type = 'sine';
        droneOsc1.frequency.setValueAtTime(55.0, audioCtx.currentTime); // A1 note

        droneOsc2 = audioCtx.createOscillator();
        droneOsc2.type = 'triangle';
        droneOsc2.frequency.setValueAtTime(110.0, audioCtx.currentTime); // A2 note
        droneOsc2.detune.setValueAtTime(4, audioCtx.currentTime);

        droneOsc3 = audioCtx.createOscillator();
        droneOsc3.type = 'sine';
        droneOsc3.frequency.setValueAtTime(164.81, audioCtx.currentTime); // E3 fifth note
        droneOsc3.detune.setValueAtTime(-6, audioCtx.currentTime);

        const subGain = audioCtx.createGain();
        subGain.gain.setValueAtTime(0.5, audioCtx.currentTime);

        droneOsc1.connect(ambientFilter);
        droneOsc2.connect(ambientFilter);
        droneOsc3.connect(subGain);
        subGain.connect(ambientFilter);

        ambientFilter.connect(ambientDroneGain);
        ambientDroneGain.connect(outNode);

        droneOsc1.start();
        droneOsc2.start();
        droneOsc3.start();
    } catch (e) {
        console.warn("Ambient drone initialization skipped:", e);
    }
}

function modulateAmbientDrone(intensity) {
    if (!audioCtx || !ambientFilter || !soundEnabled) return;
    const targetFreq = 220 + Math.min(Math.max(intensity, 0), 1) * 380;
    ambientFilter.frequency.setTargetAtTime(targetFreq, audioCtx.currentTime, 0.4);
}

function playSound(type) {
    if (!soundEnabled) return;
    try {
        initAudioContext();
        if (!audioCtx) return;

        const now = audioCtx.currentTime;
        const outNode = getAudioOutputNode();
        if (!outNode) return;

        if (type === 'hover') {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(540, now);
            osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);
            gain.gain.setValueAtTime(0.035, now);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
            osc.connect(gain);
            gain.connect(outNode);
            osc.start(now);
            osc.stop(now + 0.08);
        } else if (type === 'select') {
            [440, 659.25, 880].forEach((freq, idx) => {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(freq, now + idx * 0.04);
                gain.gain.setValueAtTime(0.05, now + idx * 0.04);
                gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.04 + 0.35);
                osc.connect(gain);
                gain.connect(outNode);
                osc.start(now + idx * 0.04);
                osc.stop(now + idx * 0.04 + 0.35);
            });
        } else if (type === 'warp') {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(160, now);
            osc.frequency.exponentialRampToValueAtTime(740, now + 0.4);
            gain.gain.setValueAtTime(0.045, now);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);
            osc.connect(gain);
            gain.connect(outNode);
            osc.start(now);
            osc.stop(now + 0.45);
        } else if (type === 'blip') {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(720, now);
            osc.frequency.exponentialRampToValueAtTime(360, now + 0.06);
            gain.gain.setValueAtTime(0.04, now);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);
            osc.connect(gain);
            gain.connect(outNode);
            osc.start(now);
            osc.stop(now + 0.06);
        } else if (type === 'success') {
            [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, now + idx * 0.05);
                gain.gain.setValueAtTime(0.045, now + idx * 0.05);
                gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.05 + 0.25);
                osc.connect(gain);
                gain.connect(outNode);
                osc.start(now + idx * 0.05);
                osc.stop(now + idx * 0.05 + 0.25);
            });
        } else if (type === 'mahoraga-adapt') {
            // High metallic anvil clack + celestial chime
            const osc1 = audioCtx.createOscillator();
            const gain1 = audioCtx.createGain();
            osc1.type = 'triangle';
            osc1.frequency.setValueAtTime(2400, now);
            osc1.frequency.exponentialRampToValueAtTime(750, now + 0.12);
            gain1.gain.setValueAtTime(0.09, now);
            gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);
            osc1.connect(gain1);
            gain1.connect(outNode);
            osc1.start(now);
            osc1.stop(now + 0.15);

            // Deep mechanical Dharmachakra snap
            const osc2 = audioCtx.createOscillator();
            const gain2 = audioCtx.createGain();
            osc2.type = 'sawtooth';
            osc2.frequency.setValueAtTime(260, now);
            osc2.frequency.exponentialRampToValueAtTime(45, now + 0.28);
            gain2.gain.setValueAtTime(0.095, now);
            gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);
            osc2.connect(gain2);
            gain2.connect(outNode);
            osc2.start(now);
            osc2.stop(now + 0.28);

            // Harmonizing celestial adaptation resonance
            [1320, 1760, 2200].forEach((freq, idx) => {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, now + 0.04 + idx * 0.03);
                gain.gain.setValueAtTime(0.045, now + 0.04 + idx * 0.03);
                gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);
                osc.connect(gain);
                gain.connect(outNode);
                osc.start(now + 0.04 + idx * 0.03);
                osc.stop(now + 0.45);
            });
        } else if (type === 'domain-expansion') {
            // Low cursed Buddhist temple bell + demonic resonance
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(120, now);
            osc.frequency.exponentialRampToValueAtTime(28, now + 1.2);
            gain.gain.setValueAtTime(0.14, now);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.4);
            osc.connect(gain);
            gain.connect(outNode);
            osc.start(now);
            osc.stop(now + 1.4);
        }
    } catch (e) {}
}

function drawAudioVisualizer() {
    if (!audioVisCtx || !audioVisCanvas) return;
    const w = audioVisCanvas.width;
    const h = audioVisCanvas.height;
    audioVisCtx.clearRect(0, 0, w, h);

    if (!audioAnalyser || !soundEnabled) {
        // Subtle resting baseline wave
        audioVisCtx.strokeStyle = 'rgba(0, 242, 254, 0.22)';
        audioVisCtx.lineWidth = 1.5;
        audioVisCtx.beginPath();
        audioVisCtx.moveTo(0, h / 2);
        for (let x = 0; x < w; x += 4) {
            audioVisCtx.lineTo(x, h / 2 + Math.sin(x * 0.12 + performance.now() * 0.0025) * 2);
        }
        audioVisCtx.stroke();
        return;
    }

    audioAnalyser.getByteFrequencyData(audioFreqData);
    audioAnalyser.getByteTimeDomainData(audioTimeData);

    const barCount = 18;
    const barWidth = (w / barCount) - 1.5;
    for (let i = 0; i < barCount; i++) {
        const val = audioFreqData[i] / 255.0;
        const barHeight = Math.max(val * (h - 6), 2);
        const grad = audioVisCtx.createLinearGradient(0, h, 0, h - barHeight);
        grad.addColorStop(0, 'rgba(99, 102, 241, 0.8)');
        grad.addColorStop(1, 'rgba(0, 242, 254, 0.95)');
        audioVisCtx.fillStyle = grad;
        audioVisCtx.fillRect(i * (barWidth + 1.5), h - barHeight, barWidth, barHeight);
    }

    // Overlay glowing wave
    audioVisCtx.strokeStyle = 'rgba(255, 255, 255, 0.65)';
    audioVisCtx.lineWidth = 1.2;
    audioVisCtx.beginPath();
    const slice = w / audioTimeData.length;
    for (let i = 0; i < audioTimeData.length; i++) {
        const v = audioTimeData[i] / 128.0;
        const y = (v * h) / 2;
        if (i === 0) audioVisCtx.moveTo(0, y);
        else audioVisCtx.lineTo(i * slice, y);
    }
    audioVisCtx.stroke();
}

function triggerHaptic(duration = 15) {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
        try { navigator.vibrate(duration); } catch (e) {}
    }
}

// Sound toggle button in HUD
const soundBtn = document.getElementById('btn-sound');
const soundStatus = document.getElementById('sound-status');
const soundIcon = document.getElementById('sound-icon');

function updateSoundUI() {
    if (soundBtn && soundStatus && soundIcon) {
        soundStatus.textContent = soundEnabled ? "Audio: On" : "Audio: Muted";
        soundIcon.className = soundEnabled ? "fa-solid fa-volume-high" : "fa-solid fa-volume-xmark";
        soundBtn.style.opacity = soundEnabled ? "1" : "0.7";
    }
    if (ambientDroneGain && audioCtx) {
        ambientDroneGain.gain.setTargetAtTime(soundEnabled ? 0.025 : 0.0001, audioCtx.currentTime, 0.2);
    }
}
updateSoundUI();

if (soundBtn) {
    soundBtn.addEventListener('click', () => {
        soundEnabled = !soundEnabled;
        localStorage.setItem('portfolio_sound', soundEnabled ? 'true' : 'false');
        updateSoundUI();
        if (soundEnabled) {
            initAudioContext();
            playSound('blip');
        }
    });
}

// =========================================================================
// 2. PRIMARY DEPLOYED ECOSYSTEM PROJECTS WITH RICH WEBSITE METADATA
// =========================================================================
const projects = [
    {
        id: "metshield-ai",
        name: "MetShield-AI",
        repo: "MetShield-AI",
        filterCategory: "web",
        category: "MoES / IMD Real-Time QC (SIH 2026)",
        desc: "Project JATAYU (SIH26073) — Real-time 3-tier Quality Control & Explainable AI anomaly detection system for MoES / IMD Automatic Weather Stations, compliant with WMO-No. 8 standards.",
        github: "https://github.com/shivamkumarmehta64-sketch/MetShield-AI",
        website: "https://aws2026-nu.vercel.app",
        displayUrl: "aws2026-nu.vercel.app",
        color: 0x10b981,
        accent: "#34d399",
        iconSymbol: "🛡️",
        iconFa: "fa-solid fa-shield-halved",
        badgeText: "SIH 2026 • LIVE VERCEL",
        headline: "METSHIELD-AI // NAWS-QMS",
        tagline: "WMO-No. 8 3-Tier QC • Thermodynamic Storm Discriminator • XAI",
        defaultLanguage: "TypeScript",
        defaultStars: 1,
        defaultForks: 0,
        defaultVersion: "SIH 2026 Live",
        techStack: ["Next.js", "TypeScript", "Recharts", "Supabase", "WMO-No. 8", "Vercel"],
        moonFeatures: ["3-Tier QC", "XAI SHAP", "Live AWS Feed"]
    },
    {
        id: "black-firefox",
        name: "Black Firefox",
        repo: "Black-Firefox",
        filterCategory: "desktop",
        category: "Native Proton WebView2 Browser",
        desc: "Ultra-compact native Windows browser (~86 KB binary) built in C# (.NET 4.8) pairing Firefox Proton styling with WebView2 speed, 3-layer ad blocking, and one-click uBlock Origin MV2.",
        github: "https://github.com/shivamkumarmehta64-sketch/Black-Firefox",
        website: null,
        displayUrl: "native://black-firefox",
        color: 0x3b82f6,
        accent: "#60a5fa",
        iconSymbol: "🦊",
        iconFa: "fa-brands fa-firefox-browser",
        badgeText: "NATIVE ~86KB BINARY",
        headline: "BLACK FIREFOX PROTON",
        tagline: "C# (.NET 4.8) • 3-Layer AdBlock • Zero-Telemetry",
        defaultLanguage: "C#",
        defaultStars: 1,
        defaultForks: 0,
        defaultVersion: "MIT Release",
        techStack: ["C#", ".NET 4.8", "WebView2", "WinForms", "AdBlock Engine", "uBlock MV2"],
        moonFeatures: ["~86KB Size", "3-Layer AdBlock", "Proton UI"]
    },
    {
        id: "aerotech",
        name: "aerotech",
        repo: "aerotech",
        isPrivate: true,
        filterCategory: "quantum",
        category: "Digital Forensics & APK Security",
        desc: "Autonomous Android APK Security & Digital Forensic Triage Platform built for Bihar Cybercrime Hackathon 2026 (PS-02). Features ed25519 chain-of-custody verification and STIX 2.1 threat intel.",
        github: "https://github.com/shivamkumarmehta64-sketch/aerotech",
        website: null,
        displayUrl: "forensics://aerotech.ps02",
        color: 0x8b5cf6,
        accent: "#a78bfa",
        iconSymbol: "🔐",
        iconFa: "fa-solid fa-user-secret",
        badgeText: "CYBERCRIME PS-02",
        headline: "AEROTECH FORENSIC TRIAGE",
        tagline: "Autonomous APK Analysis • ed25519 Evidence • STIX 2.1",
        defaultLanguage: "Python",
        defaultStars: 0,
        defaultForks: 0,
        defaultVersion: "PS-02 Private",
        techStack: ["Python", "Streamlit", "Android Forensics", "ed25519", "STIX 2.1", "BSA-2023"],
        moonFeatures: ["APK Triage", "ed25519 Proof", "STIX 2.1"]
    },
    {
        id: "blacktube",
        name: "BlackTube",
        repo: "BlackTube",
        filterCategory: "media",
        category: "Ad-Free Desktop YouTube Client",
        desc: "Ultra-lightweight, ad-free YouTube desktop client engineered in C# (.NET 4.8) + Microsoft WebView2 with zero telemetry and minimal RAM footprint.",
        github: "https://github.com/shivamkumarmehta64-sketch/BlackTube",
        website: null,
        displayUrl: "native://blacktube.app",
        color: 0xef4444,
        accent: "#f87171",
        iconSymbol: "📺",
        iconFa: "fa-brands fa-youtube",
        badgeText: "ZERO TELEMETRY",
        headline: "BLACKTUBE DESKTOP",
        tagline: "Ad-Free YouTube • WebView2 Engine • Minimal RAM",
        defaultLanguage: "C#",
        defaultStars: 0,
        defaultForks: 0,
        defaultVersion: "v1.0 MIT",
        techStack: ["C#", ".NET 4.8", "WebView2", "WinForms", "Ad-Free", "Low RAM"],
        moonFeatures: ["Zero Ads", "Minimal RAM", "Pure Playback"]
    },
    {
        id: "shivam-profile",
        name: "Shivam Profile & LinkedIn",
        repo: "shivamkumarmehta64-sketch",
        filterCategory: "web",
        category: "ECE @ PCE • IoT & Android Dev",
        desc: "Shivam Kumar Mehta — ECE @ Purnea College of Engineering (Govt. of Bihar). Embedded Systems & IoT Developer, Android & Flutter builder, and SIH 2026 innovator.",
        github: "https://github.com/shivamkumarmehta64-sketch",
        website: "https://www.linkedin.com/in/shivam-kumar-mehta",
        allowIframe: false,
        launchLabel: "LinkedIn",
        displayUrl: "linkedin.com/in/shivam-kumar-mehta",
        color: 0x6366f1,
        accent: "#818cf8",
        iconSymbol: "👨‍💻",
        iconFa: "fa-brands fa-linkedin",
        badgeText: "PORTFOLIO & LINKEDIN",
        headline: "SHIVAM KUMAR MEHTA",
        tagline: "ECE @ PCE • Embedded & IoT • Android & Flutter • SIH 2026",
        defaultLanguage: "C/C++ & Kotlin",
        defaultStars: 0,
        defaultForks: 0,
        defaultVersion: "Profile Hub",
        techStack: ["C / C++", "Kotlin", "Flutter", "Embedded IoT", "C# / .NET", "TypeScript"],
        moonFeatures: ["LinkedIn", "GitHub", "SIH 2026"]
    }
];

// =========================================================================
// 3. LIVE GITHUB API DATA FETCHING & LOCALSTORAGE CACHE
// =========================================================================
const GITHUB_ORG = "shivamkumarmehta64-sketch";
const liveDataCache = {};

function sanitizeUrl(url) {
    if (!url || typeof url !== 'string') return null;
    try {
        const parsed = new URL(url, window.location.origin);
        if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
            return parsed.href;
        }
    } catch (e) {}
    return null;
}

function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

async function fetchProjectLiveData(project) {
    if (project.isPrivate) {
        const fallback = {
            stars: project.defaultStars,
            forks: project.defaultForks,
            language: project.defaultLanguage,
            version: project.defaultVersion,
            releaseUrl: project.github,
            downloadUrl: null
        };
        liveDataCache[project.id] = fallback;
        return fallback;
    }

    const cacheKey = `gh_cache_${project.repo}`;
    const cached = localStorage.getItem(cacheKey);
    const now = Date.now();

    if (cached) {
        try {
            const parsed = JSON.parse(cached);
            if (now - parsed.timestamp < 10 * 60 * 1000) { // 10 minutes cache
                liveDataCache[project.id] = parsed.data;
                return parsed.data;
            }
        } catch (e) {}
    }

    try {
        const [repoRes, relRes] = await Promise.allSettled([
            fetch(`https://api.github.com/repos/${GITHUB_ORG}/${project.repo}`),
            fetch(`https://api.github.com/repos/${GITHUB_ORG}/${project.repo}/releases/latest`)
        ]);

        let repoData = {};
        let releaseData = {};

        if (repoRes.status === "fulfilled" && repoRes.value && repoRes.value.ok) {
            repoData = await repoRes.value.json();
        }
        if (relRes.status === "fulfilled" && relRes.value && relRes.value.ok) {
            releaseData = await relRes.value.json();
        }

        const data = {
            stars: repoData.stargazers_count !== undefined ? repoData.stargazers_count : project.defaultStars,
            forks: repoData.forks_count !== undefined ? repoData.forks_count : project.defaultForks,
            language: repoData.language || project.defaultLanguage,
            version: releaseData.tag_name || project.defaultVersion,
            releaseUrl: releaseData.html_url || `${project.github}/releases`,
            downloadUrl: releaseData.assets && releaseData.assets.length > 0 ? releaseData.assets[0].browser_download_url : null
        };

        liveDataCache[project.id] = data;
        localStorage.setItem(cacheKey, JSON.stringify({ timestamp: now, data }));
        return data;
    } catch (err) {
        const fallback = {
            stars: project.defaultStars,
            forks: project.defaultForks,
            language: project.defaultLanguage,
            version: project.defaultVersion,
            releaseUrl: `${project.github}/releases`,
            downloadUrl: null
        };
        liveDataCache[project.id] = fallback;
        return fallback;
    }
}

// Prefetch GitHub metadata in background
projects.forEach(p => fetchProjectLiveData(p));

// =========================================================================
// 4. THEME DEFINITIONS & COLOR PALETTES
// =========================================================================
const themes = {
    cosmic: {
        c1: new THREE.Color(0x0a0628),
        c2: new THREE.Color(0x4a154b),
        c3: new THREE.Color(0x00d2ff),
        coreColor: 0x6366f1,
        ambient: 0.65
    },
    cyberpunk: {
        c1: new THREE.Color(0x1a0033),
        c2: new THREE.Color(0xff0055),
        c3: new THREE.Color(0x00ffff),
        coreColor: 0xff007f,
        ambient: 0.85
    },
    "high-contrast": {
        c1: new THREE.Color(0x000000),
        c2: new THREE.Color(0x222222),
        c3: new THREE.Color(0x555555),
        coreColor: 0xfbbf24,
        ambient: 1.05
    },
    sepia: {
        c1: new THREE.Color(0x1a0f05),
        c2: new THREE.Color(0x542d0c),
        c3: new THREE.Color(0xd97706),
        coreColor: 0xd97706,
        ambient: 0.75
    },
    sukuna: {
        c1: new THREE.Color(0x060002), // Abyssal obsidian void
        c2: new THREE.Color(0x5c000f), // Blood red Malevolent Shrine vortex
        c3: new THREE.Color(0xff0033), // Cursed crimson flame
        coreColor: 0xff0033,
        ambient: 0.85
    }
};

let currentThemeKey = localStorage.getItem('portfolio_theme') || 'cosmic';
if (!themes[currentThemeKey]) {
    currentThemeKey = 'cosmic';
    localStorage.setItem('portfolio_theme', 'cosmic');
}
document.documentElement.setAttribute('data-theme', currentThemeKey);
const themeSelector = document.getElementById('theme-switcher');
if (themeSelector) themeSelector.value = currentThemeKey;

let currentDisplayMode = localStorage.getItem('portfolio_display_mode') || 'windows';
if (!['windows', 'spheres', 'monoliths'].includes(currentDisplayMode)) {
    currentDisplayMode = 'windows';
    localStorage.setItem('portfolio_display_mode', 'windows');
}
const displayModeSelector = document.getElementById('display-mode-switcher');
if (displayModeSelector) displayModeSelector.value = currentDisplayMode;

// =========================================================================
// 5. THREE.JS SCENE, CAMERA & LIGHTS
// =========================================================================
const canvas = document.getElementById('webgl-canvas');
const scene = new THREE.Scene();

const isMobile = window.innerWidth < 768;
const defaultCameraPos = new THREE.Vector3(0, isMobile ? 14 : 10.5, isMobile ? 28 : 24);
const defaultLookAt = new THREE.Vector3(0, 1.4, 0);

const camera = new THREE.PerspectiveCamera(
    isMobile ? 65 : 55,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.copy(defaultCameraPos);

const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: false,
    powerPreference: "high-performance"
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.25;

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.maxDistance = 55;
controls.minDistance = 3.5;
controls.target.copy(defaultLookAt);
controls.enablePan = true;

// Lights
const activeTheme = themes[currentThemeKey] || themes.cosmic;
const ambientLight = new THREE.AmbientLight(0xffffff, activeTheme.ambient ?? 0.75);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0x90b0ff, 1.8);
dirLight.position.set(12, 22, 15);
scene.add(dirLight);

const dirLight2 = new THREE.DirectionalLight(0xffffff, 0.8);
dirLight2.position.set(-15, -10, -12);
scene.add(dirLight2);

const pointLightCore = new THREE.PointLight(0x6366f1, 3.5, 50);
pointLightCore.position.set(0, 1.5, 0);
scene.add(pointLightCore);

// Dynamic Interactive 3D Spotlight (Tracks hovered/selected website)
const hoverSpotLight = new THREE.SpotLight(0x00f2fe, 5, 45, Math.PI / 5, 0.4, 1.2);
hoverSpotLight.position.set(0, 16, 20);
scene.add(hoverSpotLight);
scene.add(hoverSpotLight.target);

// Cyber Perspective Grid Floor
const gridHelper = new THREE.GridHelper(140, 70, 0x6366f1, 0x1e293b);
gridHelper.position.y = -11;
gridHelper.material.transparent = true;
gridHelper.material.opacity = 0.28;
scene.add(gridHelper);

// Radial Holographic Grid Disc
const cyberDiscGeo = new THREE.RingGeometry(0.5, 42, 64);
const cyberDiscMat = new THREE.MeshBasicMaterial({
    color: 0x00f2fe,
    transparent: true,
    opacity: 0.06,
    side: THREE.DoubleSide
});
const cyberDisc = new THREE.Mesh(cyberDiscGeo, cyberDiscMat);
cyberDisc.rotation.x = Math.PI * 0.5;
cyberDisc.position.y = -10.9;
scene.add(cyberDisc);

// Floating Ambient Holographic Stardust Embers
const emberCount = 350;
const emberGeo = new THREE.BufferGeometry();
const emberPos = new Float32Array(emberCount * 3);
const emberData = [];
for (let i = 0; i < emberCount; i++) {
    emberPos[i * 3] = (Math.random() - 0.5) * 55;
    emberPos[i * 3 + 1] = -10 + Math.random() * 22;
    emberPos[i * 3 + 2] = (Math.random() - 0.5) * 55;
    emberData.push({
        origY: emberPos[i * 3 + 1],
        speed: 0.006 + Math.random() * 0.012,
        phase: Math.random() * Math.PI * 2
    });
}
emberGeo.setAttribute('position', new THREE.BufferAttribute(emberPos, 3));
const emberMat = new THREE.PointsMaterial({
    size: 0.45,
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.75,
    blending: THREE.AdditiveBlending
});
const embers = new THREE.Points(emberGeo, emberMat);
scene.add(embers);

// =========================================================================
// 6. GALAXY & NEBULA VOLUMETRIC GLSL SHADER
// =========================================================================
const nebulaVertexShader = `
varying vec3 vWorldPosition;
void main() {
    vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const nebulaFragmentShader = `
uniform float u_time;
uniform vec3 u_color1;
uniform vec3 u_color2;
uniform vec3 u_color3;
varying vec3 vWorldPosition;

vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);

    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);

    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;

    i = mod289(i);
    vec4 p = permute(permute(permute(
                i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));

    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);

    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}

float fbm(vec3 p) {
    float total = 0.0;
    float amp = 0.55;
    float freq = 1.0;
    for(int i = 0; i < 4; i++) {
        total += snoise(p * freq) * amp;
        freq *= 2.05;
        amp *= 0.48;
    }
    return total;
}

void main() {
    vec3 dir = normalize(vWorldPosition);
    float t = u_time * 0.025;

    vec3 p1 = dir * 1.8 + vec3(sin(t * 0.5) * 0.2, t * 0.35, cos(t * 0.3) * 0.2);
    vec3 p2 = dir * 3.2 - vec3(t * 0.25, cos(t * 0.4) * 0.1, sin(t * 0.2) * 0.3);

    float n1 = fbm(p1);
    float n2 = fbm(p2);

    float nebula = smoothstep(-0.2, 0.85, n1 + n2 * 0.6);
    float dust = smoothstep(0.1, 0.9, n2);

    vec3 col = u_color1;
    col = mix(col, u_color2, clamp(n1 * 1.2, 0.0, 1.0));
    col = mix(col, u_color3, clamp(dust * 0.75, 0.0, 1.0));
    col += u_color3 * pow(nebula, 3.0) * 0.5;

    float starFactor = pow(clamp(snoise(dir * 65.0), 0.0, 1.0), 16.0) * 1.6;
    col += vec3(0.95, 0.98, 1.0) * starFactor;

    gl_FragColor = vec4(col, 1.0);
}
`;

const nebulaUniforms = {
    u_time: { value: 0 },
    u_color1: { value: themes[currentThemeKey].c1.clone() },
    u_color2: { value: themes[currentThemeKey].c2.clone() },
    u_color3: { value: themes[currentThemeKey].c3.clone() }
};

const nebulaMaterial = new THREE.ShaderMaterial({
    vertexShader: nebulaVertexShader,
    fragmentShader: nebulaFragmentShader,
    uniforms: nebulaUniforms,
    side: THREE.BackSide,
    depthWrite: false
});

const nebulaSphere = new THREE.Mesh(new THREE.SphereGeometry(300, 36, 36), nebulaMaterial);
scene.add(nebulaSphere);

// 3D Parallax Starfield
const starCount = 2800;
const starGeo = new THREE.BufferGeometry();
const starPositions = new Float32Array(starCount * 3);

for (let i = 0; i < starCount; i++) {
    const r = 35 + Math.random() * 115;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos((Math.random() * 2) - 1);

    starPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    starPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    starPositions[i * 3 + 2] = r * Math.cos(phi);
}

starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
const starMat = new THREE.PointsMaterial({
    size: 0.65,
    color: 0xe2e8f0,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending
});
const starField = new THREE.Points(starGeo, starMat);
scene.add(starField);

// =========================================================================
// 7. SHOOTING COMETS 3D PARTICLE ENGINE
// =========================================================================
const cometCount = 3;
const cometTails = 12;
const cometTotalPoints = cometCount * cometTails;
const cometPositions = new Float32Array(cometTotalPoints * 3);
const cometColors = new Float32Array(cometTotalPoints * 3);
const comets = [];

for (let i = 0; i < cometCount; i++) {
    comets.push({
        active: false,
        head: new THREE.Vector3(),
        vel: new THREE.Vector3(),
        history: [],
        life: 0,
        maxLife: 80,
        nextSpawn: i * 2.5 + Math.random() * 2.0
    });
}

const cometGeo = new THREE.BufferGeometry();
cometGeo.setAttribute('position', new THREE.BufferAttribute(cometPositions, 3));
cometGeo.setAttribute('color', new THREE.BufferAttribute(cometColors, 3));

const cometMat = new THREE.PointsMaterial({
    size: 0.85,
    vertexColors: true,
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending
});
const cometPoints = new THREE.Points(cometGeo, cometMat);
scene.add(cometPoints);

function spawnComet(comet) {
    const angle = Math.random() * Math.PI * 2;
    const startY = 15 + Math.random() * 20;
    comet.head.set(
        Math.cos(angle) * 45,
        startY,
        Math.sin(angle) * 45
    );
    const target = new THREE.Vector3(
        (Math.random() - 0.5) * 20,
        -5 - Math.random() * 10,
        (Math.random() - 0.5) * 20
    );
    comet.vel.subVectors(target, comet.head).normalize().multiplyScalar(0.9 + Math.random() * 0.4);
    comet.history = [];
    comet.life = 0;
    comet.maxLife = 65 + Math.floor(Math.random() * 30);
    comet.active = true;
}

function updateComets(delta) {
    const posAttr = cometGeo.attributes.position;
    const colAttr = cometGeo.attributes.color;
    let ptr = 0;

    comets.forEach(c => {
        if (!c.active) {
            c.nextSpawn -= delta;
            if (c.nextSpawn <= 0) {
                spawnComet(c);
            }
        } else {
            c.head.add(c.vel);
            c.history.unshift(c.head.clone());
            if (c.history.length > cometTails) c.history.pop();
            c.life++;

            if (c.life >= c.maxLife) {
                c.active = false;
                c.nextSpawn = 3.5 + Math.random() * 4.0;
            }
        }

        for (let j = 0; j < cometTails; j++) {
            const idx = ptr + j;
            if (c.active && c.history[j]) {
                const p = c.history[j];
                posAttr.setXYZ(idx, p.x, p.y, p.z);
                const fade = Math.max(0, 1 - j / cometTails) * (1 - c.life / c.maxLife);
                colAttr.setXYZ(idx, 0.4 * fade, 0.9 * fade, 1.0 * fade);
            } else {
                posAttr.setXYZ(idx, 0, -999, 0);
                colAttr.setXYZ(idx, 0, 0, 0);
            }
        }
        ptr += cometTails;
    });

    posAttr.needsUpdate = true;
    colAttr.needsUpdate = true;
}

// =========================================================================
// 8. CENTRAL STELLAR CONSTELLATION CORE
// =========================================================================
const coreGroup = new THREE.Group();
coreGroup.position.set(0, 1.4, 0);

const coreIcoGeo = new THREE.IcosahedronGeometry(1.5, 2);
const coreIcoMat = new THREE.MeshStandardMaterial({
    color: themes[currentThemeKey].coreColor,
    emissive: themes[currentThemeKey].coreColor,
    emissiveIntensity: 0.9,
    roughness: 0.2,
    wireframe: true
});
const coreMesh = new THREE.Mesh(coreIcoGeo, coreIcoMat);
coreGroup.add(coreMesh);

const crystalGeo = new THREE.OctahedronGeometry(0.85, 0);
const crystalMat = new THREE.MeshPhysicalMaterial({
    color: 0x00f2fe,
    emissive: 0x00d2ff,
    emissiveIntensity: 0.6,
    roughness: 0.1,
    transmission: 0.75,
    thickness: 1.2
});
const innerCrystal = new THREE.Mesh(crystalGeo, crystalMat);
coreGroup.add(innerCrystal);

const coreRings = [];
[2.2, 2.8, 3.4].forEach((radius, i) => {
    const ringGeo = new THREE.RingGeometry(radius, radius + 0.04, 64);
    const ringMat = new THREE.MeshBasicMaterial({
        color: (i === 1) ? 0x00f2fe : (i === 2 ? 0xff2a7a : 0x6366f1),
        transparent: true,
        opacity: 0.35,
        side: THREE.DoubleSide
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI * 0.3 * (i + 1);
    ringMesh.rotation.y = Math.PI * 0.25 * (i + 1);
    coreGroup.add(ringMesh);
    coreRings.push(ringMesh);
});
scene.add(coreGroup);

// =========================================================================
// 8B. MAHORAGA ADAPTATION WHEEL (八握剣異戒神将魔虚羅の法輪)
// =========================================================================
const mahoragaGroup = new THREE.Group();
mahoragaGroup.position.set(0, 3.7, 0); // Hovering directly above central stellar core
mahoragaGroup.rotation.x = 0.28; // Tilted forward for cinematic presence

// Wheel Materials
const wheelGoldMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    emissive: 0x92400e,
    emissiveIntensity: 0.45,
    roughness: 0.25,
    metalness: 0.94
});
const wheelAccMat = new THREE.MeshStandardMaterial({
    color: 0xfde047,
    emissive: 0xd97706,
    emissiveIntensity: 0.55,
    roughness: 0.2,
    metalness: 0.95
});
const wheelCursedCoreMat = new THREE.MeshStandardMaterial({
    color: 0xff0033,
    emissive: 0xff0055,
    emissiveIntensity: 1.4,
    roughness: 0.15
});

// Rotating sub-group that steps when adapting
const mahoragaWheel = new THREE.Group();
mahoragaGroup.add(mahoragaWheel);

// 1. Outer Dharmachakra Torus Rim
const outerRimGeo = new THREE.TorusGeometry(2.15, 0.085, 16, 64);
const outerRimMesh = new THREE.Mesh(outerRimGeo, wheelGoldMat);
mahoragaWheel.add(outerRimMesh);

// Inner Concentric Accent Rim
const innerRimGeo = new THREE.TorusGeometry(1.88, 0.038, 12, 64);
const innerRimMesh = new THREE.Mesh(innerRimGeo, wheelAccMat);
mahoragaWheel.add(innerRimMesh);

// 2. Central Hub
const hubGeo = new THREE.CylinderGeometry(0.56, 0.56, 0.16, 24);
const hubMesh = new THREE.Mesh(hubGeo, wheelGoldMat);
hubMesh.rotation.x = Math.PI * 0.5;
mahoragaWheel.add(hubMesh);

// Central Cursed Adaptation Core Gem (Octahedron)
const hubGemGeo = new THREE.OctahedronGeometry(0.34, 0);
const hubGemMesh = new THREE.Mesh(hubGemGeo, wheelCursedCoreMat);
mahoragaWheel.add(hubGemMesh);

// 3. 8 Sacred Spokes & 8 Divergent Sila Outer Handles
const spokeCount = 8;
const spokeGeo = new THREE.CylinderGeometry(0.045, 0.045, 1.58, 12);
const collarGeo = new THREE.CylinderGeometry(0.068, 0.068, 0.06, 12);
const handleGeo = new THREE.CylinderGeometry(0.042, 0.042, 0.44, 12);
const handleKnobGeo = new THREE.SphereGeometry(0.08, 12, 12);

for (let i = 0; i < spokeCount; i++) {
    const angle = (i / spokeCount) * Math.PI * 2;
    const spokeHolder = new THREE.Group();
    spokeHolder.rotation.z = angle;

    // Spoke shaft (from hub r=0.45 to rim r=2.0)
    const spoke = new THREE.Mesh(spokeGeo, wheelGoldMat);
    spoke.position.y = 1.18;
    spokeHolder.add(spoke);

    // Decorative ornamental collars
    const collar1 = new THREE.Mesh(collarGeo, wheelAccMat);
    collar1.position.y = 0.76;
    spokeHolder.add(collar1);

    const collar2 = new THREE.Mesh(collarGeo, wheelAccMat);
    collar2.position.y = 1.62;
    spokeHolder.add(collar2);

    // Outer Divergent Sila Handle (protruding beyond outer rim)
    const handle = new THREE.Mesh(handleGeo, wheelGoldMat);
    handle.position.y = 2.36;
    spokeHolder.add(handle);

    const knob = new THREE.Mesh(handleKnobGeo, wheelAccMat);
    knob.position.y = 2.58;
    spokeHolder.add(knob);

    // Cross T-flange on handle
    const crossBarGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.24, 10);
    const crossBar = new THREE.Mesh(crossBarGeo, wheelAccMat);
    crossBar.rotation.z = Math.PI * 0.5;
    crossBar.position.y = 2.48;
    spokeHolder.add(crossBar);

    mahoragaWheel.add(spokeHolder);
}

// 4. Glowing Cursed Halo Ring behind the wheel
const haloRingGeo = new THREE.RingGeometry(1.65, 2.38, 48);
const haloRingMat = new THREE.MeshBasicMaterial({
    color: 0xffaa00,
    transparent: true,
    opacity: 0.22,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending
});
const haloRing = new THREE.Mesh(haloRingGeo, haloRingMat);
mahoragaWheel.add(haloRing);

// Interaction metadata
const projectRaycastTargets = [];
hubMesh.userData = { isMahoraga: true };
outerRimMesh.userData = { isMahoraga: true };
projectRaycastTargets.push(hubMesh, outerRimMesh);

scene.add(mahoragaGroup);

// Mahoraga Adaptation State
let mahoragaTargetRotZ = 0;
let mahoragaAdaptStep = 0;
let mahoragaAutoTimer = 0;

function adaptMahoraga(manual = false) {
    mahoragaAdaptStep++;
    mahoragaTargetRotZ += Math.PI / 4; // 45° step rotation (one full spoke click!)
    playSound('mahoraga-adapt');

    // Visual pulse
    hubGemMesh.scale.set(1.7, 1.7, 1.7);
    haloRingMat.opacity = 0.8;
    wheelGoldMat.emissiveIntensity = 1.2;

    setTimeout(() => {
        hubGemMesh.scale.set(1.0, 1.0, 1.0);
        haloRingMat.opacity = 0.22;
        wheelGoldMat.emissiveIntensity = 0.45;
    }, 380);

    // Spawn golden or crimson cursed shockwave from core
    const shockColor = currentThemeKey === 'sukuna' ? 0xff0033 : 0xf59e0b;
    createSpaceShockwave(0, 0, shockColor);

    showToast(
        `[ 八握剣・適応完了 // MAHORAGA ADAPTATION #${mahoragaAdaptStep} ]`,
        "fa-solid fa-dharmachakra"
    );
}

// =========================================================================
// 8C. SUKUNA DOMAIN EXPANSION: MALEVOLENT SHRINE (伏魔御厨子) FX
// =========================================================================
// Floating Blood Ash & Cursed Embers
const bloodAshCount = 450;
const bloodAshGeo = new THREE.BufferGeometry();
const bloodAshPos = new Float32Array(bloodAshCount * 3);
const bloodAshData = [];
for (let i = 0; i < bloodAshCount; i++) {
    bloodAshPos[i * 3] = (Math.random() - 0.5) * 65;
    bloodAshPos[i * 3 + 1] = -11 + Math.random() * 24;
    bloodAshPos[i * 3 + 2] = (Math.random() - 0.5) * 65;
    bloodAshData.push({
        speed: 0.018 + Math.random() * 0.028,
        drift: (Math.random() - 0.5) * 0.012
    });
}
bloodAshGeo.setAttribute('position', new THREE.BufferAttribute(bloodAshPos, 3));
const bloodAshMat = new THREE.PointsMaterial({
    size: 0.55,
    color: 0xff0033,
    transparent: true,
    opacity: currentThemeKey === 'sukuna' ? 0.85 : 0,
    blending: THREE.AdditiveBlending
});
const bloodAsh = new THREE.Points(bloodAshGeo, bloodAshMat);
scene.add(bloodAsh);

// Dimensional Cleave & Dismantle 3D Slashes
const slashCount = 14;
const slashes = [];
const slashGroup = new THREE.Group();
scene.add(slashGroup);

for (let i = 0; i < slashCount; i++) {
    const bladeGeo = new THREE.PlaneGeometry(0.14, 18 + Math.random() * 12);
    const bladeMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending
    });
    const mesh = new THREE.Mesh(bladeGeo, bladeMat);
    mesh.position.set(0, -999, 0);
    slashGroup.add(mesh);
    slashes.push({
        mesh,
        active: false,
        life: 0,
        maxLife: 26,
        vel: new THREE.Vector3(),
        nextSpawn: Math.random() * 2.0
    });
}

function spawnCleaveSlash() {
    const s = slashes.find(item => !item.active);
    if (!s) return;
    s.active = true;
    s.life = 0;
    s.maxLife = 22 + Math.floor(Math.random() * 12);
    const angle = Math.random() * Math.PI * 2;
    const dist = 4 + Math.random() * 22;
    const y = -5 + Math.random() * 14;
    s.mesh.position.set(Math.cos(angle) * dist, y, Math.sin(angle) * dist);
    s.mesh.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
    );
    s.vel.set(
        (Math.random() - 0.5) * 0.45,
        (Math.random() - 0.5) * 0.22,
        (Math.random() - 0.5) * 0.45
    );
    s.mesh.material.opacity = 0.95;
    s.mesh.scale.set(1, 1, 1);
}

function updateCleaveSlashes(delta, motionFactor) {
    if (currentThemeKey !== 'sukuna') {
        slashes.forEach(s => {
            if (s.active) {
                s.mesh.material.opacity *= 0.85;
                if (s.mesh.material.opacity < 0.02) {
                    s.active = false;
                    s.mesh.position.set(0, -999, 0);
                }
            }
        });
        return;
    }

    slashes.forEach(s => {
        if (!s.active) {
            s.nextSpawn -= delta;
            if (s.nextSpawn <= 0) {
                spawnCleaveSlash();
                s.nextSpawn = 0.35 + Math.random() * 0.7;
            }
        } else {
            s.life++;
            s.mesh.position.add(s.vel);
            const progress = s.life / s.maxLife;
            s.mesh.material.opacity = Math.sin(progress * Math.PI) * 0.9;
            s.mesh.scale.x = 1.0 + progress * 2.2;
            if (s.life >= s.maxLife) {
                s.active = false;
                s.mesh.position.set(0, -999, 0);
            }
        }
    });
}

// Domain Expansion Screen Tremor & Activation
let domainShakeFrames = 0;

function activateDomainExpansion() {
    domainShakeFrames = 42; // Camera tremor frames
    playSound('domain-expansion');

    applyTheme('sukuna');
    if (themeSelector) themeSelector.value = 'sukuna';

    // Barrage of cutting Cleave slashes
    for (let i = 0; i < 8; i++) {
        setTimeout(() => {
            spawnCleaveSlash();
            playSound('hover');
        }, i * 65);
    }

    // Adapt Mahoraga
    setTimeout(() => {
        adaptMahoraga(true);
    }, 450);

    showToast("領域展開: 伏魔御厨子 (Domain Expansion: Malevolent Shrine)", "fa-solid fa-torii-gate");
}

// =========================================================================
// 9. HIGH-DPI PROCEDURAL WEBSITE SCREEN TEXTURE ENGINE (2048x1280 HD)
// =========================================================================
function generateWebsiteTextureCanvas(project) {
    const W = 2048;
    const H = 1280;
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');

    // 1. Deep Space Slate / OLED Dark Background
    const bgGrad = ctx.createLinearGradient(0, 0, W, H);
    bgGrad.addColorStop(0, '#090d16');
    bgGrad.addColorStop(0.4, '#06080f');
    bgGrad.addColorStop(1, '#030408');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    // Subtle Precision Engineering Grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.035)';
    ctx.lineWidth = 1.5;
    for (let x = 0; x < W; x += 64) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (let y = 0; y < H; y += 64) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }

    // Ambient Lighting Flare at Top-Right
    const flareGrad = ctx.createRadialGradient(W * 0.85, 120, 20, W * 0.85, 120, 600);
    flareGrad.addColorStop(0, `${project.accent}28`);
    flareGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = flareGrad;
    ctx.fillRect(0, 0, W, H);

    // 2. Realistic Production Browser Chrome & Navigation Bar (Top 110px)
    ctx.fillStyle = 'rgba(13, 17, 30, 0.96)';
    ctx.fillRect(0, 0, W, 110);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(0, 110); ctx.lineTo(W, 110); ctx.stroke();

    // macOS Traffic Light Buttons
    const dots = [
        { x: 50, y: 55, c: '#ef4444' },
        { x: 88, y: 55, c: '#f59e0b' },
        { x: 126, y: 55, c: '#10b981' }
    ];
    dots.forEach(d => {
        ctx.beginPath();
        ctx.arc(d.x, d.y, 11, 0, Math.PI * 2);
        ctx.fillStyle = d.c;
        ctx.fill();
    });

    // Navigation Chevron Arrows (< > ↻)
    ctx.font = '700 24px sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.fillText('‹', 180, 64);
    ctx.fillText('›', 215, 64);
    ctx.fillText('↻', 250, 63);

    // Active Browser Tab
    ctx.save();
    ctx.fillStyle = 'rgba(22, 29, 50, 0.9)';
    ctx.beginPath();
    ctx.roundRect(310, 24, 360, 64, [12, 12, 0, 0]);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.stroke();

    // Tab Icon & Name
    ctx.font = '700 22px "Space Grotesk", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`${project.iconSymbol}  ${project.name}`, 335, 63);
    ctx.font = '600 20px sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.fillText('×', 635, 63);
    ctx.restore();

    // URL Address Bar (Pill)
    const urlX = 700, urlY = 25, urlW = 1000, urlH = 60;
    ctx.fillStyle = 'rgba(6, 9, 20, 0.9)';
    ctx.beginPath();
    ctx.roundRect(urlX, urlY, urlW, urlH, 30);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.14)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // SSL Padlock & URL
    ctx.font = '700 20px "JetBrains Mono", monospace';
    ctx.fillStyle = '#10b981';
    ctx.fillText('🔒 https://', urlX + 28, urlY + 38);
    ctx.fillStyle = project.accent;
    ctx.fillText(project.displayUrl, urlX + 175, urlY + 38);

    // Quick Command Shortcut Badge (⌘K)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.beginPath();
    ctx.roundRect(urlX + urlW - 140, urlY + 12, 110, 36, 8);
    ctx.fill();
    ctx.font = '600 16px "JetBrains Mono", monospace';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('⌘K Search', urlX + urlW - 130, urlY + 36);

    // Production Status Beacon at Far Right
    ctx.beginPath();
    ctx.arc(W - 80, 55, 7, 0, Math.PI * 2);
    ctx.fillStyle = '#10b981';
    ctx.fill();
    ctx.font = '800 17px "JetBrains Mono", monospace';
    ctx.fillStyle = '#10b981';
    ctx.fillText('PROD LIVE', W - 200, 61);

    // 3. Sub-Navigation / Breadcrumbs Bar (y: 110 to 180)
    ctx.fillStyle = 'rgba(10, 14, 26, 0.8)';
    ctx.fillRect(0, 110, W, 70);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.beginPath(); ctx.moveTo(0, 180); ctx.lineTo(W, 180); ctx.stroke();

    ctx.font = '600 19px "Outfit", sans-serif';
    ctx.fillStyle = '#64748b';
    ctx.fillText('WORKSPACE / PRODUCTION CLUSTER /', 60, 153);
    ctx.fillStyle = '#ffffff';
    ctx.fillText(project.name.toUpperCase(), 410, 153);

    // Category Badge in Subnav
    ctx.fillStyle = `${project.accent}22`;
    ctx.beginPath();
    ctx.roundRect(W - 320, 126, 260, 38, 19);
    ctx.fill();
    ctx.strokeStyle = project.accent;
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.font = '800 15px "JetBrains Mono", monospace';
    ctx.fillStyle = project.accent;
    ctx.fillText(`● ${project.category.toUpperCase()}`, W - 300, 150);

    // 4. Hero Section Header (y: 200 to 380)
    // Headline
    ctx.font = '900 58px "Space Grotesk", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(project.headline, 60, 270);

    // Tagline / Description
    ctx.font = '500 26px "Outfit", sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText(project.tagline, 60, 325);

    // Tech Stack Pills Array
    let pillOffsetX = 60;
    project.techStack.slice(0, 6).forEach(tech => {
        ctx.font = '700 16px "JetBrains Mono", monospace';
        const tw = ctx.measureText(tech).width;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
        ctx.beginPath();
        ctx.roundRect(pillOffsetX, 345, tw + 28, 34, 17);
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
        ctx.lineWidth = 1.2;
        ctx.stroke();

        ctx.fillStyle = '#cbd5e1';
        ctx.fillText(tech, pillOffsetX + 14, 368);
        pillOffsetX += tw + 40;
    });

    // 5. High-Fidelity Custom Web Application Viewport (y: 410 to 1180)
    const contentY = 410;
    const contentH = 760;

    if (project.id === "metshield-ai") {
        // === MOES / IMD AUTOMATIC WEATHER STATION 3-TIER QC DASHBOARD ===
        const metrics = [
            { label: "WMO-NO. 8 COMPLIANCE", val: "TIER 1-3", sub: "Temp / Pressure / RH Real-Time QC", color: "#34d399" },
            { label: "STORM DISCRIMINATOR", val: "ΔP + ΔRH", sub: "Convective Front vs Sensor Spike", color: "#38bdf8" },
            { label: "ACTIVE AWS TELEMETRY", val: "20 NODES", sub: "2.5s DCP Link • Live Vercel", color: "#a855f7" }
        ];

        metrics.forEach((m, i) => {
            const mx = 60 + i * 645;
            ctx.fillStyle = 'rgba(15, 22, 42, 0.78)';
            ctx.beginPath();
            ctx.roundRect(mx, contentY, 615, 180, 20);
            ctx.fill();
            ctx.strokeStyle = `${m.color}44`;
            ctx.lineWidth = 2;
            ctx.stroke();

            ctx.font = '700 17px "JetBrains Mono", monospace';
            ctx.fillStyle = '#64748b';
            ctx.fillText(m.label, mx + 32, contentY + 48);

            ctx.font = '900 48px "Space Grotesk", sans-serif';
            ctx.fillStyle = '#ffffff';
            ctx.fillText(m.val, mx + 32, contentY + 116);

            ctx.font = '600 17px "Outfit", sans-serif';
            ctx.fillStyle = m.color;
            ctx.fillText(m.sub, mx + 32, contentY + 154);

            ctx.beginPath();
            ctx.moveTo(mx + 420, contentY + 130);
            ctx.bezierCurveTo(mx + 460, contentY + 140, mx + 500, contentY + 80, mx + 570, contentY + 70);
            ctx.strokeStyle = m.color;
            ctx.lineWidth = 3;
            ctx.stroke();
        });

        const tableY = contentY + 215;
        ctx.fillStyle = 'rgba(15, 22, 42, 0.78)';
        ctx.beginPath();
        ctx.roundRect(60, tableY, 1928, 515, 20);
        ctx.fill();
        ctx.strokeStyle = 'rgba(52, 211, 153, 0.2)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
        ctx.fillRect(60, tableY, 1928, 65);
        ctx.font = '800 18px "JetBrains Mono", monospace';
        ctx.fillStyle = '#94a3b8';
        ctx.fillText('QC ENGINE TIER', 100, tableY + 40);
        ctx.fillText('DIAGNOSTIC RULE & PHYSICS CHECK', 560, tableY + 40);
        ctx.fillText('XAI ATTRIBUTION', 1320, tableY + 40);
        ctx.fillText('DECISION', 1680, tableY + 40);

        const qcRows = [
            { tier: "Tier 1 • WMO Physical Limits", rule: "Temp [-10..55°C] • Press [920..1050 hPa] • RH [5..100%]", xai: "Range Guard", status: "● PASS", sc: "#10b981" },
            { tier: "Tier 2 • Persistence & Step", rule: "dX/dt Rate Jump & Probe Float Lock (σ < 0.001)", xai: "Window Variance", status: "● MONITORED", sc: "#38bdf8" },
            { tier: "Tier 3 • Storm Discriminator", rule: "ΔP ≤ -2.5 hPa + ΔRH ≥ +15% Coupled Check", xai: "SHAP Weights", status: "● WEATHER EVENT", sc: "#60a5fa" },
            { tier: "Tier 3 • Thermistor Spike", rule: "Isolated Voltage Spike Without ΔP/ΔRH Coupling", xai: "Temp 92% Weight", status: "● HARDWARE FAULT", sc: "#ef4444" },
            { tier: "SIH26073 • Imputation Engine", rule: "Short-Term Moving Avg + CSV NIC/IMD Audit Log", xai: "Auto-Imputed", status: "● PROD VERCEL", sc: "#34d399" }
        ];

        qcRows.forEach((r, idx) => {
            const ry = tableY + 80 + idx * 85;
            ctx.fillStyle = idx % 2 === 0 ? 'rgba(255, 255, 255, 0.015)' : 'transparent';
            ctx.fillRect(60, ry - 15, 1928, 80);

            ctx.font = '700 21px "Space Grotesk", sans-serif';
            ctx.fillStyle = '#ffffff';
            ctx.fillText(r.tier, 100, ry + 32);

            ctx.font = '500 18px "Outfit", sans-serif';
            ctx.fillStyle = '#94a3b8';
            ctx.fillText(r.rule, 560, ry + 32);
            ctx.fillText(r.xai, 1320, ry + 32);

            ctx.font = '800 17px "JetBrains Mono", monospace';
            ctx.fillStyle = r.sc;
            ctx.fillText(r.status, 1680, ry + 32);
        });

    } else if (project.id === "aerotech") {
        // === BIHAR CYBERCRIME HACKATHON PS-02 DIGITAL FORENSICS CONSOLE ===
        ctx.fillStyle = 'rgba(15, 22, 42, 0.85)';
        ctx.beginPath();
        ctx.roundRect(60, contentY, 1928, 730, 20);
        ctx.fill();
        ctx.strokeStyle = 'rgba(139, 92, 246, 0.45)';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
        ctx.beginPath();
        ctx.roundRect(100, contentY + 50, 890, 630, 16);
        ctx.fill();
        ctx.strokeStyle = 'rgba(139, 92, 246, 0.25)';
        ctx.stroke();

        ctx.font = '800 22px "JetBrains Mono", monospace';
        ctx.fillStyle = '#a78bfa';
        ctx.fillText('🔐 AUTONOMOUS APK TRIAGE PIPELINE', 140, contentY + 105);

        const forensicStats = [
            { l: "EVIDENCE INTEGRITY:", v: "Ed25519 Signed Forensic Bundle (BSA-2023)", c: "#34d399" },
            { l: "THREAT INTEL STANDARD:", v: "Automated STIX 2.1 IOC Export", c: "#38bdf8" },
            { l: "TRIAGE ENGINE:", v: "Permission, Manifest & DEX Behavioral Audit", c: "#fbbf24" },
            { l: "COMPETITION TRACK:", v: "Bihar Cybercrime Hackathon 2026 (PS-02)", c: "#c084fc" }
        ];

        forensicStats.forEach((fs, idx) => {
            const fsy = contentY + 160 + idx * 115;
            ctx.font = '700 16px "JetBrains Mono", monospace';
            ctx.fillStyle = '#94a3b8';
            ctx.fillText(fs.l, 140, fsy + 30);
            ctx.font = '800 23px "Space Grotesk", sans-serif';
            ctx.fillStyle = fs.c;
            ctx.fillText(fs.v, 140, fsy + 70);
        });

        ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
        ctx.beginPath();
        ctx.roundRect(1030, contentY + 50, 918, 630, 16);
        ctx.fill();
        ctx.strokeStyle = 'rgba(139, 92, 246, 0.25)';
        ctx.stroke();

        ctx.font = '800 22px "JetBrains Mono", monospace';
        ctx.fillStyle = '#a78bfa';
        ctx.fillText('🛡️ FORENSIC ARTIFACT VERIFICATION', 1070, contentY + 105);

        const modules = [
            { name: "Static Decompilation & Manifest Audit", badge: "API + PERMS", feat: "Flags SMS/Accessibility abuse & hidden C2 URLs" },
            { name: "Ed25519 Cryptographic Chain of Custody", badge: "TAMPER-PROOF", feat: "Section 63 BSA-2023 hash & signature sealing" },
            { name: "Streamlit Analyst Workbench", badge: "PRIVATE REPO", feat: "Real-time case comparison & STIX 2.1 reporting" }
        ];

        modules.forEach((md, idx) => {
            const my = contentY + 160 + idx * 155;
            ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
            ctx.beginPath();
            ctx.roundRect(1070, my, 838, 125, 12);
            ctx.fill();

            ctx.font = '800 22px "Space Grotesk", sans-serif';
            ctx.fillStyle = '#ffffff';
            ctx.fillText(md.name, 1100, my + 45);

            ctx.font = '700 18px "JetBrains Mono", monospace';
            ctx.fillStyle = '#a78bfa';
            ctx.fillText(md.badge, 1710, my + 45);

            ctx.font = '500 18px "Outfit", sans-serif';
            ctx.fillStyle = '#94a3b8';
            ctx.fillText(md.feat, 1100, my + 90);
        });

    } else if (project.id === "blacktube") {
        // === BLACKTUBE AD-FREE YOUTUBE DESKTOP ENGINE ===
        ctx.fillStyle = 'rgba(5, 5, 12, 0.95)';
        ctx.beginPath();
        ctx.roundRect(60, contentY, 1200, 730, 20);
        ctx.fill();
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.45)';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = 'rgba(239, 68, 68, 0.9)';
        ctx.beginPath();
        ctx.roundRect(100, contentY + 40, 210, 44, 10);
        ctx.fill();
        ctx.font = '900 19px "JetBrains Mono", monospace';
        ctx.fillStyle = '#ffffff';
        ctx.fillText('AD-FREE • PURE', 120, contentY + 69);

        ctx.font = '80px sans-serif';
        ctx.fillStyle = '#ef4444';
        ctx.textAlign = 'center';
        ctx.fillText('▶', 660, contentY + 360);
        ctx.textAlign = 'left';

        ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.fillRect(100, contentY + 650, 1120, 10);
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(100, contentY + 650, 720, 10);
        ctx.beginPath();
        ctx.arc(820, contentY + 655, 10, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();

        ctx.fillStyle = 'rgba(15, 22, 42, 0.78)';
        ctx.beginPath();
        ctx.roundRect(1290, contentY, 698, 730, 20);
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.stroke();

        ctx.font = '800 22px "JetBrains Mono", monospace';
        ctx.fillStyle = '#f87171';
        ctx.fillText('📺 C# .NET 4.8 + WEBVIEW2', 1330, contentY + 55);

        const btSpecs = [
            { t: "ZERO TELEMETRY CORE", v: "No tracking beacons, clean playback", c: "#10b981" },
            { t: "MINIMAL RAM FOOTPRINT", v: "Native WinForms wrapper • No Electron", c: "#38bdf8" },
            { t: "AD-FREE INTERCEPTION", v: "Distraction-free YouTube desktop UX", c: "#f87171" },
            { t: "BLACK ECOSYSTEM", v: "Companion to Black-Firefox Proton", c: "#fbbf24" }
        ];
        btSpecs.forEach((dec, idx) => {
            const dy = contentY + 100 + idx * 140;
            ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
            ctx.beginPath();
            ctx.roundRect(1330, dy, 618, 115, 14);
            ctx.fill();
            ctx.strokeStyle = `${dec.c}44`;
            ctx.stroke();

            ctx.font = '700 16px "JetBrains Mono", monospace';
            ctx.fillStyle = dec.c;
            ctx.fillText(dec.t, 1360, dy + 40);

            ctx.font = '700 22px "Space Grotesk", sans-serif';
            ctx.fillStyle = '#ffffff';
            ctx.fillText(dec.v, 1360, dy + 80);
        });

    } else if (project.id === "black-firefox") {
        // === FIREFOX PROTON MICRO-BROWSER ENGINE ===
        ctx.fillStyle = 'rgba(15, 22, 42, 0.8)';
        ctx.beginPath();
        ctx.roundRect(60, contentY, 1928, 730, 20);
        ctx.fill();
        ctx.strokeStyle = 'rgba(59, 130, 246, 0.4)';
        ctx.lineWidth = 2;
        ctx.stroke();

        // 3 Micro-Gauges
        const protonGauges = [
            { t: "MICRO-BINARY FOOTPRINT", val: "86.4 KB", sub: "99.1% smaller than standard Chromium", c: "#38bdf8" },
            { t: "UBLOCK AD & TRACKER SHIELD", val: "342,891", sub: "3-Layer Network Filtering Active", c: "#34d399" },
            { t: "DEDICATED RAM ALLOCATION", val: "48.2 MB", sub: "Instant Launch • Zero Telemetry Overhead", c: "#fbbf24" }
        ];

        protonGauges.forEach((g, idx) => {
            const gx = 100 + idx * 615;
            ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
            ctx.beginPath();
            ctx.roundRect(gx, contentY + 50, 585, 230, 16);
            ctx.fill();
            ctx.strokeStyle = `${g.c}44`;
            ctx.stroke();

            ctx.font = '800 16px "JetBrains Mono", monospace';
            ctx.fillStyle = g.c;
            ctx.fillText(g.t, gx + 32, contentY + 95);

            ctx.font = '900 54px "Space Grotesk", sans-serif';
            ctx.fillStyle = '#ffffff';
            ctx.fillText(g.val, gx + 32, contentY + 175);

            ctx.font = '600 18px "Outfit", sans-serif';
            ctx.fillStyle = '#94a3b8';
            ctx.fillText(g.sub, gx + 32, contentY + 225);
        });

        // Network Waterfall
        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.beginPath();
        ctx.roundRect(100, contentY + 315, 1848, 365, 16);
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.stroke();

        ctx.font = '800 18px "JetBrains Mono", monospace';
        ctx.fillStyle = '#60a5fa';
        ctx.fillText('🌐 SUB-50MS WEBVIRTUALIZATION WATERFALL (WEBVIEW2)', 140, contentY + 360);

        const netRows = [
            { url: "https://aws2026-nu.vercel.app/api/telemetry", size: "24.2 KB", time: "18 ms", stat: "200 OK (CACHED)" },
            { url: "https://cdn.jsdelivr.net/npm/three.module.js", size: "142 KB", time: "32 ms", stat: "200 OK (EDGE)" },
            { url: "https://telemetry.tracker.ad/pixel.gif", size: "0 B", time: "0 ms", stat: "BLOCKED BY UBLOCK" }
        ];

        netRows.forEach((nr, idx) => {
            const nry = contentY + 410 + idx * 75;
            ctx.font = '600 19px "JetBrains Mono", monospace';
            ctx.fillStyle = idx === 2 ? '#ef4444' : '#ffffff';
            ctx.fillText(nr.url, 140, nry + 30);
            ctx.fillStyle = '#94a3b8';
            ctx.fillText(nr.size, 1050, nry + 30);
            ctx.fillText(nr.time, 1280, nry + 30);
            ctx.fillStyle = idx === 2 ? '#ef4444' : '#10b981';
            ctx.fillText(nr.stat, 1500, nry + 30);
        });

    } else {
        // === SHIVAM KUMAR MEHTA DEVELOPER PROFILE & LINKEDIN HUB ===
        const profileCards = [
            { label: "EDUCATION", val: "ECE @ PCE", sub: "Bihar Engineering University, Patna", color: "#818cf8" },
            { label: "CORE DOMAINS", val: "IoT & Mobile", sub: "Embedded Systems • Android & Flutter", color: "#34d399" },
            { label: "LOCATION", val: "Purnia, IN", sub: "linkedin.com/in/shivam-kumar-mehta", color: "#38bdf8" }
        ];

        profileCards.forEach((m, i) => {
            const mx = 60 + i * 645;
            ctx.fillStyle = 'rgba(15, 22, 42, 0.78)';
            ctx.beginPath();
            ctx.roundRect(mx, contentY, 615, 180, 20);
            ctx.fill();
            ctx.strokeStyle = `${m.color}44`;
            ctx.lineWidth = 2;
            ctx.stroke();

            ctx.font = '700 17px "JetBrains Mono", monospace';
            ctx.fillStyle = '#64748b';
            ctx.fillText(m.label, mx + 32, contentY + 48);

            ctx.font = '900 46px "Space Grotesk", sans-serif';
            ctx.fillStyle = '#ffffff';
            ctx.fillText(m.val, mx + 32, contentY + 116);

            ctx.font = '600 17px "Outfit", sans-serif';
            ctx.fillStyle = m.color;
            ctx.fillText(m.sub, mx + 32, contentY + 154);
        });

        const tableY = contentY + 215;
        ctx.fillStyle = 'rgba(15, 22, 42, 0.78)';
        ctx.beginPath();
        ctx.roundRect(60, tableY, 1928, 515, 20);
        ctx.fill();
        ctx.strokeStyle = 'rgba(99, 102, 241, 0.25)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
        ctx.fillRect(60, tableY, 1928, 65);
        ctx.font = '800 18px "JetBrains Mono", monospace';
        ctx.fillStyle = '#94a3b8';
        ctx.fillText('FLAGSHIP PROJECT', 100, tableY + 40);
        ctx.fillText('ARCHITECTURE & PURPOSE', 600, tableY + 40);
        ctx.fillText('PRIMARY STACK', 1320, tableY + 40);
        ctx.fillText('STATUS', 1680, tableY + 40);

        const summaryRows = [
            { name: "🛡️ MetShield-AI", arch: "MoES / IMD AWS Real-Time QC (SIH 2026)", stack: "TypeScript / Next.js", status: "● LIVE VERCEL", sc: "#10b981" },
            { name: "🦊 Black-Firefox", arch: "Proton WebView2 Native Windows Browser", stack: "C# / .NET 4.8", status: "● ★ 1 STAR (MIT)", sc: "#38bdf8" },
            { name: "🔐 aerotech", arch: "Autonomous APK Security & Forensic Triage", stack: "Python / Streamlit", status: "● BIHAR PS-02", sc: "#a78bfa" },
            { name: "📺 BlackTube", arch: "Ad-Free Minimal-RAM Desktop YouTube Client", stack: "C# / WebView2", status: "● MIT RELEASE", sc: "#f87171" }
        ];

        summaryRows.forEach((r, idx) => {
            const ry = tableY + 85 + idx * 96;
            ctx.fillStyle = idx % 2 === 0 ? 'rgba(255, 255, 255, 0.015)' : 'transparent';
            ctx.fillRect(60, ry - 15, 1928, 86);

            ctx.font = '700 23px "Space Grotesk", sans-serif';
            ctx.fillStyle = '#ffffff';
            ctx.fillText(r.name, 100, ry + 35);

            ctx.font = '500 19px "Outfit", sans-serif';
            ctx.fillStyle = '#94a3b8';
            ctx.fillText(r.arch, 600, ry + 35);
            ctx.fillText(r.stack, 1320, ry + 35);

            ctx.font = '800 17px "JetBrains Mono", monospace';
            ctx.fillStyle = r.sc;
            ctx.fillText(r.status, 1680, ry + 35);
        });
    }

    // 6. Holographic Ambient Scanlines
    ctx.fillStyle = 'rgba(255, 255, 255, 0.015)';
    for (let sl = 0; sl < H; sl += 6) {
        ctx.fillRect(0, sl, W, 2);
    }

    // 7. Bottom High-Tech Status Footer
    ctx.fillStyle = 'rgba(8, 11, 22, 0.98)';
    ctx.fillRect(0, H - 70, W, 70);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(0, H - 70); ctx.lineTo(W, H - 70); ctx.stroke();

    ctx.font = '700 20px "JetBrains Mono", monospace';
    ctx.fillStyle = '#64748b';
    ctx.fillText(`CLUSTER NODE • ${project.defaultLanguage} • ${project.category.toUpperCase()}`, 50, H - 26);
    ctx.fillStyle = project.accent;
    ctx.fillText(`★ ${project.defaultStars} GITHUB STARS • ${project.defaultVersion}`, W - 460, H - 26);

    const texture = new THREE.CanvasTexture(canvas);
    texture.generateMipmaps = true;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.anisotropy = 16;
    texture.needsUpdate = true;
    return texture;
}

// High-DPI Billboard Text Canvas Generator
function createTextLabelSprite(text, category, colorHex) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 140;
    const ctx = canvas.getContext('2d');

    const x = 16, y = 14, w = 480, h = 112, r = 24;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();

    const bgGrad = ctx.createLinearGradient(0, y, 0, y + h);
    bgGrad.addColorStop(0, 'rgba(12, 16, 36, 0.92)');
    bgGrad.addColorStop(1, 'rgba(6, 9, 24, 0.98)');
    ctx.fillStyle = bgGrad;
    ctx.fill();

    ctx.lineWidth = 4;
    ctx.strokeStyle = colorHex || 'rgba(99, 102, 241, 0.7)';
    ctx.shadowColor = colorHex || 'rgba(99, 102, 241, 0.9)';
    ctx.shadowBlur = 12;
    ctx.stroke();
    ctx.restore();

    ctx.font = '700 17px "JetBrains Mono", monospace';
    ctx.fillStyle = colorHex || '#38bdf8';
    ctx.textAlign = 'center';
    ctx.letterSpacing = '1.5px';
    ctx.fillText(category.toUpperCase(), 256, 48);

    ctx.font = '700 30px "Space Grotesk", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
    ctx.shadowBlur = 6;
    ctx.fillText(text, 256, 90);

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;

    const spriteMaterial = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        opacity: 0.95,
        depthTest: false
    });

    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(3.4, 0.93, 1);
    return sprite;
}

// 3D Floating Brand Icon Badge Generator
function createBrand3DIconMesh(project) {
    const iconGroup = new THREE.Group();

    // 1. Outer Hexagonal / Disc Medallion
    const discGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.08, 32);
    discGeo.rotateX(Math.PI / 2);
    const discMat = new THREE.MeshStandardMaterial({
        color: 0x0f172a,
        emissive: project.color,
        emissiveIntensity: 0.5,
        roughness: 0.2,
        metalness: 0.85
    });
    const discMesh = new THREE.Mesh(discGeo, discMat);
    iconGroup.add(discMesh);

    // 2. Glowing Bezel Ring
    const rimGeo = new THREE.TorusGeometry(0.38, 0.025, 16, 48);
    const rimMat = new THREE.MeshBasicMaterial({
        color: project.color,
        transparent: true,
        opacity: 0.9
    });
    const rimMesh = new THREE.Mesh(rimGeo, rimMat);
    iconGroup.add(rimMesh);

    // 3. High-Res Canvas Icon Face
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#060918';
    ctx.fillRect(0, 0, 256, 256);

    ctx.beginPath();
    ctx.arc(128, 128, 115, 0, Math.PI * 2);
    ctx.fillStyle = `${project.accent}33`;
    ctx.fill();
    ctx.strokeStyle = project.accent;
    ctx.lineWidth = 8;
    ctx.stroke();

    ctx.font = '115px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = project.accent;
    ctx.shadowBlur = 20;
    ctx.fillText(project.iconSymbol, 128, 134);

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;

    const faceGeo = new THREE.PlaneGeometry(0.7, 0.7);
    const faceMat = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true
    });
    const faceMesh = new THREE.Mesh(faceGeo, faceMat);
    faceMesh.position.z = 0.045;
    iconGroup.add(faceMesh);

    return iconGroup;
}

// =========================================================================
// 10. 3D WEBSITE ENTITY BUILDER (WINDOWS, SPHERES & MONOLITHS)
// =========================================================================
const projectMeshes = [];
const moonList = [];
let selectedProjectIndex = null;
let hoveredProjectIndex = null;
let activeCategoryFilter = "all";

const orbOrbitRadius = isMobile ? 9.8 : 12.2;
const totalProjects = projects.length;

function build3DWebsiteNodes(displayMode = 'windows') {
    // Clear old meshes
    projectMeshes.forEach(mesh => scene.remove(mesh));
    projectMeshes.length = 0;
    projectRaycastTargets.length = 0;
    moonList.length = 0;

    projects.forEach((project, index) => {
        const angle = (index / totalProjects) * Math.PI * 2;
        const group = new THREE.Group();

        group.position.x = Math.cos(angle) * orbOrbitRadius;
        group.position.z = Math.sin(angle) * orbOrbitRadius;
        group.position.y = 1.4 + Math.sin(index * 0.9) * 1.8;

        // Make website face towards orbit normal / camera direction
        group.lookAt(new THREE.Vector3(group.position.x * 2, group.position.y, group.position.z * 2));

        const webTexture = generateWebsiteTextureCanvas(project);

        let mainMesh = null;
        let chassisMesh = null;
        let glowMesh = null;

        if (displayMode === 'windows') {
            // --- MODE A: 3D FLOATING GLASS BROWSER WINDOW SCREEN ---
            const screenW = 2.6;
            const screenH = 1.62;
            const depth = 0.12;

            // 1. 3D Beveled Monitor / Browser Slate Chassis (Dark Glass Backing)
            const chassisGeo = new THREE.BoxGeometry(screenW + 0.08, screenH + 0.08, depth);
            const chassisMat = new THREE.MeshStandardMaterial({
                color: 0x0a0f1d,
                emissive: project.color,
                emissiveIntensity: 0.15,
                roughness: 0.25,
                metalness: 0.85
            });
            chassisMesh = new THREE.Mesh(chassisGeo, chassisMat);
            chassisMesh.position.z = -depth / 2;
            group.add(chassisMesh);

            // 2. High-Definition Website Screen Face
            const screenGeo = new THREE.PlaneGeometry(screenW, screenH);
            const screenMat = new THREE.MeshBasicMaterial({
                map: webTexture,
                side: THREE.DoubleSide
            });
            mainMesh = new THREE.Mesh(screenGeo, screenMat);
            mainMesh.position.z = 0.005;
            mainMesh.userData = { projectIndex: index, isOrb: true };
            group.add(mainMesh);

            // 3. Clear Protective Glass Overlay with Specular Refraction
            const glassGeo = new THREE.PlaneGeometry(screenW, screenH);
            const glassMat = new THREE.MeshPhysicalMaterial({
                color: 0xffffff,
                transparent: true,
                opacity: 0.18,
                roughness: 0.05,
                transmission: 0.6,
                reflectivity: 0.8
            });
            const glassMesh = new THREE.Mesh(glassGeo, glassMat);
            glassMesh.position.z = 0.015;
            glassMesh.userData = { projectIndex: index, isOrb: true };
            group.add(glassMesh);

            // 4. Glowing Accent Border Rim
            const wireGeo = new THREE.EdgesGeometry(chassisGeo);
            const wireMat = new THREE.LineBasicMaterial({
                color: project.color,
                transparent: true,
                opacity: 0.75,
                linewidth: 2
            });
            const wireMesh = new THREE.LineSegments(wireGeo, wireMat);
            wireMesh.position.z = -depth / 2;
            group.add(wireMesh);

            // 5. Holographic Ambient Backlight Glow
            const glowGeo = new THREE.PlaneGeometry(screenW * 1.35, screenH * 1.35);
            const glowMat = new THREE.MeshBasicMaterial({
                color: project.color,
                transparent: true,
                opacity: 0.25,
                blending: THREE.AdditiveBlending,
                side: THREE.DoubleSide
            });
            glowMesh = new THREE.Mesh(glowGeo, glowMat);
            glowMesh.position.z = -depth - 0.05;
            group.add(glowMesh);

            // 6. Holographic Projection Base Grid Underneath
            const baseRingGeo = new THREE.RingGeometry(0.8, 1.4, 32);
            const baseRingMat = new THREE.MeshBasicMaterial({
                color: project.color,
                transparent: true,
                opacity: 0.35,
                side: THREE.DoubleSide
            });
            const baseRing = new THREE.Mesh(baseRingGeo, baseRingMat);
            baseRing.rotation.x = Math.PI / 2;
            baseRing.position.y = -screenH / 2 - 0.25;
            group.add(baseRing);

            // 7. Floating 3D Brand Icon Levitating in Front
            const brandIcon = createBrand3DIconMesh(project);
            brandIcon.position.set(-screenW / 2 + 0.22, screenH / 2 + 0.22, 0.25);
            brandIcon.userData = { projectIndex: index, isOrb: true };
            group.add(brandIcon);

            projectRaycastTargets.push(mainMesh, glassMesh, chassisMesh, brandIcon);

        } else if (displayMode === 'monoliths') {
            // --- MODE B: 3D CYBER MONOLITH PORTAL ---
            const monoW = 1.8, monoH = 2.7, monoD = 0.25;
            const monoGeo = new THREE.BoxGeometry(monoW, monoH, monoD);
            const monoMat = new THREE.MeshStandardMaterial({
                color: 0x050712,
                emissive: project.color,
                emissiveIntensity: 0.25,
                roughness: 0.2,
                metalness: 0.9
            });
            chassisMesh = new THREE.Mesh(monoGeo, monoMat);
            group.add(chassisMesh);

            const screenGeo = new THREE.PlaneGeometry(monoW * 0.92, monoH * 0.88);
            const screenMat = new THREE.MeshBasicMaterial({ map: webTexture });
            mainMesh = new THREE.Mesh(screenGeo, screenMat);
            mainMesh.position.z = monoD / 2 + 0.01;
            mainMesh.userData = { projectIndex: index, isOrb: true };
            group.add(mainMesh);

            const glowGeo = new THREE.SphereGeometry(1.6, 24, 24);
            const glowMat = new THREE.MeshBasicMaterial({
                color: project.color,
                transparent: true,
                opacity: 0.2,
                blending: THREE.AdditiveBlending
            });
            glowMesh = new THREE.Mesh(glowGeo, glowMat);
            group.add(glowMesh);

            const brandIcon = createBrand3DIconMesh(project);
            brandIcon.position.set(0, monoH / 2 + 0.35, 0.1);
            brandIcon.userData = { projectIndex: index, isOrb: true };
            group.add(brandIcon);

            projectRaycastTargets.push(mainMesh, chassisMesh, brandIcon);

        } else {
            // --- MODE C: CYBER WEB SPHERES ---
            const sphereGeo = new THREE.SphereGeometry(1.0, 36, 36);
            const sphereMat = new THREE.MeshStandardMaterial({
                map: webTexture,
                color: project.color,
                emissive: project.color,
                emissiveIntensity: 0.4,
                roughness: 0.2,
                metalness: 0.6
            });
            mainMesh = new THREE.Mesh(sphereGeo, sphereMat);
            mainMesh.userData = { projectIndex: index, isOrb: true };
            group.add(mainMesh);

            const glowGeo = new THREE.SphereGeometry(1.3, 32, 32);
            const glowMat = new THREE.MeshBasicMaterial({
                color: project.color,
                transparent: true,
                opacity: 0.25,
                blending: THREE.AdditiveBlending
            });
            glowMesh = new THREE.Mesh(glowGeo, glowMat);
            group.add(glowMesh);

            const ringGeo = new THREE.RingGeometry(1.5, 1.7, 48);
            const ringMat = new THREE.MeshBasicMaterial({
                color: project.color,
                transparent: true,
                opacity: 0.45,
                side: THREE.DoubleSide
            });
            const ringMesh = new THREE.Mesh(ringGeo, ringMat);
            ringMesh.rotation.x = Math.PI / 2 + 0.2;
            group.add(ringMesh);

            const brandIcon = createBrand3DIconMesh(project);
            brandIcon.position.set(0, 1.45, 0.4);
            brandIcon.userData = { projectIndex: index, isOrb: true };
            group.add(brandIcon);

            projectRaycastTargets.push(mainMesh, brandIcon);
        }

        // Orbiting Feature Moonlets (Satellites)
        project.moonFeatures.forEach((featureName, moonIdx) => {
            const moonRadius = 2.1 + moonIdx * 0.48;
            const moonSpeed = 1.2 + moonIdx * 0.6;
            const moonTilt = (moonIdx + 1) * 0.4;

            const moonGeo = new THREE.SphereGeometry(0.13, 16, 16);
            const moonMat = new THREE.MeshStandardMaterial({
                color: 0x00f2fe,
                emissive: 0x00f2fe,
                emissiveIntensity: 0.85,
                roughness: 0.2
            });
            const moonMesh = new THREE.Mesh(moonGeo, moonMat);
            group.add(moonMesh);

            const trailGeo = new THREE.RingGeometry(moonRadius, moonRadius + 0.018, 40);
            const trailMat = new THREE.MeshBasicMaterial({
                color: project.color,
                transparent: true,
                opacity: 0.25,
                side: THREE.DoubleSide
            });
            const trailMesh = new THREE.Mesh(trailGeo, trailMat);
            trailMesh.rotation.x = Math.PI / 2 + moonTilt;
            group.add(trailMesh);

            moonList.push({
                mesh: moonMesh,
                parentGroup: group,
                radius: moonRadius,
                speed: moonSpeed,
                tilt: moonTilt,
                offset: moonIdx * (Math.PI * 0.65)
            });
        });

        // Floating Billboard Label Tag
        const labelSprite = createTextLabelSprite(project.name, project.category, project.accent);
        labelSprite.position.set(0, 1.85, 0);
        group.add(labelSprite);

        group.userData = {
            project,
            index,
            originalY: group.position.y,
            originalRotationY: group.rotation.y,
            targetPos: new THREE.Vector3(group.position.x, group.position.y, group.position.z),
            targetRot: new THREE.Euler(0, -angle + Math.PI / 2, 0),
            mainMesh,
            chassisMesh,
            glowMesh,
            labelSprite
        };

        scene.add(group);
        projectMeshes.push(group);
    });

    computeFormationTargets(currentFormation);
    updateOrbHighlights();
}

// 3D Formation Layout Engine
let currentFormation = localStorage.getItem('portfolio_formation') || 'constellation';
const formationSelector = document.getElementById('formation-switcher');
if (formationSelector) formationSelector.value = currentFormation;

function computeFormationTargets(formationName = currentFormation) {
    projects.forEach((project, index) => {
        const group = projectMeshes[index];
        if (!group) return;

        if (formationName === 'bento') {
            // 3D Curved Wall Bento Layout (3 top + centered bottom row)
            const rowSize = 3;
            const row = Math.floor(index / rowSize);
            const col = index % rowSize;
            const itemsInRow = Math.min(rowSize, projects.length - row * rowSize);
            const centerOffset = (itemsInRow - 1) / 2;
            const x = (col - centerOffset) * (isMobile ? 3.2 : 4.2);
            const y = row === 0 ? 3.2 : -0.9;
            const z = 7.5 - Math.abs(col - centerOffset) * 1.1;
            group.userData.targetPos = new THREE.Vector3(x, y, z);
            group.userData.targetRot = new THREE.Euler(0, (centerOffset - col) * 0.14, 0);
        } else if (formationName === 'helix') {
            // Ascending Double-Helix Hyperdrive
            const hAngle = index * 0.82;
            const hRadius = isMobile ? 6.5 : 9.5;
            const x = Math.cos(hAngle) * hRadius;
            const z = Math.sin(hAngle) * hRadius;
            const y = -6.0 + index * 1.8;
            group.userData.targetPos = new THREE.Vector3(x, y, z);
            group.userData.targetRot = new THREE.Euler(0, -hAngle + Math.PI / 2, 0);
        } else {
            // Constellation Galaxy Orbit
            const angle = (index / totalProjects) * Math.PI * 2;
            const x = Math.cos(angle) * orbOrbitRadius;
            const z = Math.sin(angle) * orbOrbitRadius;
            const y = 1.4 + Math.sin(index * 0.9) * 1.8;
            group.userData.targetPos = new THREE.Vector3(x, y, z);
            group.userData.targetRot = new THREE.Euler(0, -angle + Math.PI / 2, 0);
        }
    });
}

function switchFormation(newFormation) {
    currentFormation = newFormation;
    localStorage.setItem('portfolio_formation', newFormation);
    if (formationSelector) formationSelector.value = newFormation;
    computeFormationTargets(newFormation);
    playSound('warp');
    showToast(`3D Formation: ${newFormation.toUpperCase()}`);

    if (newFormation === 'bento') {
        smoothCameraLookAt(new THREE.Vector3(0, 1.3, isMobile ? 22 : 18), new THREE.Vector3(0, 1.2, 0), 1200);
    } else if (newFormation === 'helix') {
        smoothCameraLookAt(new THREE.Vector3(0, 5, isMobile ? 28 : 22), new THREE.Vector3(0, 0, 0), 1200);
    } else {
        smoothCameraLookAt(defaultCameraPos, defaultLookAt, 1200);
    }
}

if (formationSelector) {
    formationSelector.addEventListener('change', (e) => {
        switchFormation(e.target.value);
    });
}

// Holographic Wireframe Toggle
let wireframeMode = false;
const btnWireframe = document.getElementById('btn-wireframe');
const wireframeStatus = document.getElementById('wireframe-status');

function toggleWireframe() {
    wireframeMode = !wireframeMode;
    if (wireframeStatus) wireframeStatus.textContent = wireframeMode ? "Holo: Wireframe" : "Holo: Solid";
    if (btnWireframe) {
        btnWireframe.style.borderColor = wireframeMode ? "var(--accent)" : "";
        btnWireframe.style.background = wireframeMode ? "rgba(0, 242, 254, 0.2)" : "";
    }

    scene.traverse((child) => {
        if (child.isMesh && child.material && !child.userData.isLabel && !child.userData.isParticle) {
            if (Array.isArray(child.material)) {
                child.material.forEach(m => {
                    if (!m.map || wireframeMode) m.wireframe = wireframeMode;
                });
            } else if (child.material.isMaterial) {
                if (child.material.map && !wireframeMode) {
                    child.material.wireframe = false;
                } else {
                    child.material.wireframe = wireframeMode;
                }
            }
        }
    });

    playSound('blip');
    showToast(wireframeMode ? "Wireframe Mesh Activated" : "Solid Shading Restored");
}

if (btnWireframe) {
    btnWireframe.addEventListener('click', () => toggleWireframe());
}

// Interactive 3D Space Shockwaves
const shockwaves = [];
const shockwaveGeo = new THREE.RingGeometry(0.1, 0.35, 32);

function createSpaceShockwave(worldX, worldZ, color = 0x00f2fe) {
    const mat = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.85,
        side: THREE.DoubleSide
    });
    const mesh = new THREE.Mesh(shockwaveGeo, mat);
    mesh.rotation.x = Math.PI / 2;
    mesh.position.set(worldX, -10.8, worldZ);
    scene.add(mesh);
    shockwaves.push({ mesh, radius: 0.2, maxRadius: 22, opacity: 0.85 });
    playSound('blip');
}

function updateShockwaves(delta) {
    for (let i = shockwaves.length - 1; i >= 0; i--) {
        const sw = shockwaves[i];
        sw.radius += delta * 18;
        sw.opacity -= delta * 0.95;
        const scale = sw.radius;
        sw.mesh.scale.set(scale, scale, scale);
        sw.mesh.material.opacity = Math.max(sw.opacity, 0);

        if (sw.opacity <= 0 || sw.radius >= sw.maxRadius) {
            scene.remove(sw.mesh);
            sw.mesh.geometry.dispose();
            sw.mesh.material.dispose();
            shockwaves.splice(i, 1);
        }
    }
}

// Reactive 3D Cursor Stardust Physics
const cursorStardust = [];
const MAX_STARDUST = 70;
const stardustGeo = new THREE.BufferGeometry();
const stardustPositions = new Float32Array(MAX_STARDUST * 3);
stardustGeo.setAttribute('position', new THREE.BufferAttribute(stardustPositions, 3));
const stardustMat = new THREE.PointsMaterial({
    size: 0.35,
    color: 0x00f2fe,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending
});
const stardustParticles = new THREE.Points(stardustGeo, stardustMat);
stardustParticles.userData.isParticle = true;
scene.add(stardustParticles);

const raycasterMouse = new THREE.Raycaster();
const mouseGroundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
const rayIntersectPoint = new THREE.Vector3();

function spawnStardustAtMouse(mouseNormX, mouseNormY) {
    raycasterMouse.setFromCamera(new THREE.Vector2(mouseNormX, mouseNormY), camera);
    if (raycasterMouse.ray.intersectPlane(mouseGroundPlane, rayIntersectPoint)) {
        cursorStardust.push({
            x: rayIntersectPoint.x + (Math.random() - 0.5) * 0.5,
            y: rayIntersectPoint.y + 0.3 + (Math.random() - 0.5) * 0.3,
            z: rayIntersectPoint.z + (Math.random() - 0.5) * 0.5,
            vx: (Math.random() - 0.5) * 0.05,
            vy: 0.02 + Math.random() * 0.04,
            vz: (Math.random() - 0.5) * 0.05,
            life: 1.0
        });
        if (cursorStardust.length > MAX_STARDUST) cursorStardust.shift();
    }
}

function updateStardust(delta) {
    const pos = stardustGeo.attributes.position;
    for (let i = 0; i < MAX_STARDUST; i++) {
        if (i < cursorStardust.length) {
            const p = cursorStardust[i];
            p.x += p.vx;
            p.y += p.vy;
            p.z += p.vz;
            p.life -= delta * 1.6;
            pos.setXYZ(i, p.x, p.y, p.z);
        } else {
            pos.setXYZ(i, 9999, 9999, 9999);
        }
    }
    pos.needsUpdate = true;
    for (let i = cursorStardust.length - 1; i >= 0; i--) {
        if (cursorStardust[i].life <= 0) cursorStardust.splice(i, 1);
    }
}

// Sci-Fi Cyber Terminal Console Engine
const terminalDrawer = document.getElementById('cyber-terminal-drawer');
const terminalInput = document.getElementById('terminal-input');
const terminalOutput = document.getElementById('terminal-output');
const terminalCloseBtn = document.getElementById('terminal-close-btn');
const btnTerminal = document.getElementById('btn-terminal');
const termChips = document.querySelectorAll('.term-chip');
const terminalHistory = [];
let terminalHistoryIdx = -1;

function toggleTerminal(forceState) {
    if (!terminalDrawer) return;
    const isActive = forceState !== undefined ? forceState : !terminalDrawer.classList.contains('active');
    if (isActive) {
        terminalDrawer.classList.add('active');
        playSound('blip');
        setTimeout(() => terminalInput && terminalInput.focus(), 80);
    } else {
        terminalDrawer.classList.remove('active');
    }
}

if (btnTerminal) {
    btnTerminal.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleTerminal();
    });
}
if (terminalCloseBtn) {
    terminalCloseBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleTerminal(false);
    });
}

function printTermLine(text, type = '') {
    if (!terminalOutput) return;
    const line = document.createElement('div');
    line.className = `term-line ${type}`;
    line.innerHTML = text;
    terminalOutput.appendChild(line);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

function executeTerminalCommand(raw) {
    const cmd = raw.trim();
    if (!cmd) return;
    terminalHistory.push(cmd);
    terminalHistoryIdx = terminalHistory.length;

    printTermLine(`<span class="term-prompt">shivam@cyber-space:~$</span> <span class="term-cmd">${escapeHtml(cmd)}</span>`);
    const parts = cmd.toLowerCase().split(/\s+/);
    const action = parts[0];
    const arg = parts[1];

    switch (action) {
        case 'help':
            printTermLine(`<b>AVAILABLE COMMANDS:</b>`);
            printTermLine(`  <span class="term-cmd">domain</span> / <span class="term-cmd">sukuna</span> - Activate Domain Expansion: Malevolent Shrine`);
            printTermLine(`  <span class="term-cmd">adapt</span> / <span class="term-cmd">mahoraga</span> - Trigger Mahoraga wheel adaptation click`);
            printTermLine(`  <span class="term-cmd">list</span> / <span class="term-cmd">ls</span> - List all ${projects.length} flagship star systems`);
            printTermLine(`  <span class="term-cmd">warp &lt;id&gt;</span> - Warp camera to system (e.g. warp metshield-ai)`);
            printTermLine(`  <span class="term-cmd">layout &lt;constellation|bento|helix&gt;</span> - Switch 3D formation`);
            printTermLine(`  <span class="term-cmd">style &lt;windows|spheres|monoliths&gt;</span> - Switch 3D mesh model`);
            printTermLine(`  <span class="term-cmd">theme &lt;cosmic|cyberpunk|sukuna|sepia|contrast&gt;</span> - Change visual theme`);
            printTermLine(`  <span class="term-cmd">audio &lt;on|off&gt;</span> - Control space drone synth`);
            printTermLine(`  <span class="term-cmd">matrix</span> - Open Multi-Tech Comparison Matrix`);
            printTermLine(`  <span class="term-cmd">wireframe</span> - Toggle holographic wireframe mesh`);
            printTermLine(`  <span class="term-cmd">stats</span> - View ecosystem statistics`);
            printTermLine(`  <span class="term-cmd">benchmark</span> - Run real-time WebGL performance test`);
            printTermLine(`  <span class="term-cmd">clear</span> - Clear terminal screen`);
            break;
        case 'list':
        case 'ls':
            printTermLine(`<b>DEPLOYED ECOSYSTEM CATALOG (${projects.length} SYSTEMS):</b>`);
            projects.forEach((p, i) => {
                printTermLine(`[${i+1}] <span class="term-cmd">${p.id}</span> - ${p.name} (${p.category})`);
            });
            break;
        case 'warp':
            if (!arg) {
                printTermLine(`Usage: warp &lt;id&gt; (e.g. warp metshield-ai, warp black-firefox)`, 'term-warn');
                return;
            }
            const target = projects.findIndex(p => p.id.toLowerCase().includes(arg) || p.name.toLowerCase().includes(arg));
            if (target !== -1) {
                printTermLine(`Coordinates locked for [${projects[target].name}]... Jumping!`, 'term-success');
                focusOnProject(target);
                playSound('warp');
            } else {
                printTermLine(`Error: System '${arg}' not found. Type 'list' for valid IDs.`, 'term-error');
            }
            break;
        case 'layout':
            if (['constellation', 'bento', 'helix'].includes(arg)) {
                switchFormation(arg);
                printTermLine(`3D formation set to: ${arg.toUpperCase()}`, 'term-success');
            } else {
                printTermLine(`Invalid layout. Choose: constellation, bento, helix`, 'term-warn');
            }
            break;
        case 'style':
            if (['windows', 'spheres', 'monoliths'].includes(arg)) {
                currentDisplayMode = arg;
                localStorage.setItem('portfolio_display_mode', arg);
                if (displayModeSelector) displayModeSelector.value = arg;
                build3DWebsiteNodes(arg);
                rebuildEnergyBeams();
                printTermLine(`3D mesh style updated to: ${arg}`, 'term-success');
            } else {
                printTermLine(`Invalid style. Choose: windows, spheres, monoliths`, 'term-warn');
            }
            break;
        case 'theme':
            const thKey = arg === 'contrast' ? 'high-contrast' : arg;
            if (themes[thKey]) {
                currentThemeKey = thKey;
                localStorage.setItem('portfolio_theme', thKey);
                document.documentElement.setAttribute('data-theme', thKey);
                if (themeSelector) themeSelector.value = thKey;
                const tData = themes[thKey];
                nebulaUniforms.u_color1.value.copy(tData.c1);
                nebulaUniforms.u_color2.value.copy(tData.c2);
                nebulaUniforms.u_color3.value.copy(tData.c3);
                coreIcoMat.color.setHex(tData.coreColor);
                coreIcoMat.emissive.setHex(tData.coreColor);
                ambientLight.intensity = tData.ambient;
                printTermLine(`Theme changed to: ${thKey}`, 'term-success');
            } else {
                printTermLine(`Invalid theme. Choose: cosmic, cyberpunk, sepia, contrast`, 'term-warn');
            }
            break;
        case 'audio':
            if (arg === 'on' || arg === 'off') {
                soundEnabled = arg === 'on';
                localStorage.setItem('portfolio_sound', soundEnabled ? 'true' : 'false');
                updateSoundUI();
                printTermLine(`Audio drone synth: ${soundEnabled ? 'ONLINE' : 'MUTED'}`, 'term-success');
            } else {
                printTermLine(`Usage: audio on | audio off`, 'term-warn');
            }
            break;
        case 'matrix':
            openMatrixModal();
            printTermLine(`Opened Multi-Tech Architecture Matrix.`, 'term-success');
            break;
        case 'wireframe':
            toggleWireframe();
            printTermLine(`Wireframe mode toggled.`, 'term-success');
            break;
        case 'stats':
            let totalStars = 0, totalForks = 0;
            projects.forEach(p => {
                const ld = liveDataCache[p.id] || {};
                totalStars += ld.stars || p.defaultStars;
                totalForks += ld.forks || p.defaultForks;
            });
            printTermLine(`<b>CONSTELLATION TELEMETRY STATS:</b>`);
            printTermLine(`  Total Projects: ${projects.length}`);
            printTermLine(`  Total Ecosystem Stars: ★ ${totalStars}`);
            printTermLine(`  Total Ecosystem Forks: ⑂ ${totalForks}`);
            printTermLine(`  Core Techs: Next.js, TypeScript, C#/.NET 4.8, WebView2, Python, Embedded IoT`);
            printTermLine(`  Status: 100% HEALTHY / PRODUCTION DEPLOYED`);
            break;
        case 'benchmark':
            printTermLine(`Initiating WebGL performance stress benchmark...`, 'term-warn');
            setTimeout(() => {
                printTermLine(`<b>BENCHMARK METRICS:</b>`, 'term-success');
                printTermLine(`  Target Framerate: 60 FPS (V-Sync)`);
                printTermLine(`  Active Geometries: ${scene.children.length} objects`);
                printTermLine(`  GPU Acceleration: Active (ACES Filmic Tone-mapped)`);
                printTermLine(`  Memory Status: 0 Memory Leaks`);
            }, 1000);
            break;
        case 'domain':
        case 'sukuna':
        case 'shrine':
            activateDomainExpansion();
            printTermLine(`⛩️ <b style="color: #ff0033;">DOMAIN EXPANSION ACTIVATED: MALEVOLENT SHRINE (伏魔御厨子)</b>`, 'term-success');
            printTermLine(`  Cleave & Dismantle slashes engaged.`);
            printTermLine(`  Mahoraga Dharmachakra adaptation wheel operational.`);
            break;
        case 'adapt':
        case 'mahoraga':
            adaptMahoraga(true);
            printTermLine(`⚡ <b style="color: #f59e0b;">MAHORAGA WHEEL ADAPTED (八握剣・応変完了)</b>`, 'term-success');
            break;
        case 'clear':
            if (terminalOutput) terminalOutput.innerHTML = '';
            break;
        default:
            printTermLine(`Command not recognized: '${cmd}'. Type <span class="term-cmd">help</span> for directory.`, 'term-error');
    }
}

if (terminalInput) {
    terminalInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            executeTerminalCommand(terminalInput.value);
            terminalInput.value = '';
        } else if (e.key === 'ArrowUp') {
            if (terminalHistory.length > 0 && terminalHistoryIdx > 0) {
                terminalHistoryIdx--;
                terminalInput.value = terminalHistory[terminalHistoryIdx];
            }
        } else if (e.key === 'ArrowDown') {
            if (terminalHistoryIdx < terminalHistory.length - 1) {
                terminalHistoryIdx++;
                terminalInput.value = terminalHistory[terminalHistoryIdx];
            } else {
                terminalHistoryIdx = terminalHistory.length;
                terminalInput.value = '';
            }
        } else if (e.key === 'Escape' || e.key === '`' || e.key === '~') {
            e.preventDefault();
            toggleTerminal(false);
        }
    });
}

termChips.forEach(chip => {
    chip.addEventListener('click', () => {
        const cmd = chip.getAttribute('data-cmd');
        if (cmd) {
            executeTerminalCommand(cmd);
        }
    });
});

// Multi-Tech Architecture Comparison Matrix
const matrixModal = document.getElementById('matrix-modal-backdrop');
const matrixTableBody = document.getElementById('matrix-table-body');
const matrixCloseBtn = document.getElementById('matrix-close-btn');
const btnMatrix = document.getElementById('btn-matrix');
const matrixFilters = document.querySelectorAll('.matrix-filter');

const ARCH_PROFILES = {
    "metshield-ai": { runtime: "Next.js / TypeScript", size: "Live Vercel Edge", arch: "WMO-No. 8 3-Tier QC + XAI SHAP", badge: "SIH 2026" },
    "black-firefox": { runtime: "C# / .NET 4.8", size: "~86 KB Micro-Binary", arch: "WebView2 + 3-Layer AdBlock", badge: "LIGHT" },
    "aerotech": { runtime: "Python / Streamlit", size: "Forensic Triage", arch: "ed25519 Custody + STIX 2.1", badge: "CYBER" },
    "blacktube": { runtime: "C# / .NET 4.8", size: "Minimal RAM", arch: "Ad-Free WebView2 YouTube Client", badge: "MEDIA" },
    "shivam-profile": { runtime: "LinkedIn & GitHub", size: "ECE @ PCE", arch: "Embedded IoT • Android • Flutter", badge: "PROFILE" }
};

function populateArchitectureMatrix(filter = 'all') {
    if (!matrixTableBody) return;
    matrixTableBody.innerHTML = '';

    projects.forEach(p => {
        const profile = ARCH_PROFILES[p.id] || { runtime: p.defaultLanguage, size: "N/A", arch: p.category, badge: "APP" };
        if (filter === 'web' && p.filterCategory !== 'web') return;
        if (filter === 'native' && (p.filterCategory !== 'desktop' && p.filterCategory !== 'media')) return;
        if (filter === 'hardware' && p.filterCategory !== 'quantum') return;

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>
                <div class="matrix-sys-name">
                    <span style="font-size:18px;">${p.iconSymbol}</span>
                    <div>
                        <div>${p.name}</div>
                        <span style="font-size:10px; color:${p.accent};">${p.category}</span>
                    </div>
                </div>
            </td>
            <td><span class="matrix-badge-mono">${profile.runtime}</span></td>
            <td><span style="color:#34d399; font-weight:600; font-family:'JetBrains Mono',monospace;">${profile.size}</span></td>
            <td>
                <div style="display:flex; gap:4px; flex-wrap:wrap; max-width:260px;">
                    ${p.techStack.slice(0, 3).map(t => `<span class="matrix-badge-mono" style="font-size:9.5px;">${t}</span>`).join('')}
                </div>
            </td>
            <td style="font-size:11.5px; color:#cbd5e1;">${profile.arch}</td>
            <td>
                <div style="display:flex; gap:6px;">
                    <a href="${p.github}" target="_blank" rel="noopener noreferrer" class="tour-btn" title="GitHub Repo" style="width:28px; height:28px; font-size:12px;">
                        <i class="fa-brands fa-github"></i>
                    </a>
                    ${p.website ? `
                        <a href="${p.website}" target="_blank" rel="noopener noreferrer" class="tour-btn" title="Launch Live Web" style="width:28px; height:28px; font-size:12px; color:var(--accent);">
                            <i class="fa-solid fa-arrow-up-right-from-square"></i>
                        </a>
                    ` : ''}
                </div>
            </td>
        `;
        matrixTableBody.appendChild(tr);
    });
}

function openMatrixModal() {
    if (!matrixModal) return;
    populateArchitectureMatrix('all');
    matrixModal.classList.add('active');
    playSound('select');
}

function closeMatrixModal() {
    if (matrixModal) matrixModal.classList.remove('active');
}

if (btnMatrix) {
    btnMatrix.addEventListener('click', (e) => {
        e.stopPropagation();
        openMatrixModal();
    });
}
if (matrixCloseBtn) {
    matrixCloseBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeMatrixModal();
    });
}
if (matrixModal) {
    matrixModal.addEventListener('click', (e) => {
        if (e.target === matrixModal) closeMatrixModal();
    });
}

matrixFilters.forEach(fBtn => {
    fBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        matrixFilters.forEach(b => b.classList.remove('active'));
        fBtn.classList.add('active');
        populateArchitectureMatrix(fBtn.getAttribute('data-filter'));
        playSound('blip');
    });
});

// Spatial Telemetry Updater
const telemCam = document.getElementById('telem-cam');
const telemSector = document.getElementById('telem-sector');

function updateTelemetry() {
    if (telemCam) {
        telemCam.textContent = `X:${camera.position.x.toFixed(1)} Y:${camera.position.y.toFixed(1)} Z:${camera.position.z.toFixed(1)}`;
    }
    if (telemSector) {
        if (selectedProjectIndex !== null) {
            telemSector.textContent = projects[selectedProjectIndex].name.toUpperCase().slice(0, 14);
        } else if (hoveredProjectIndex !== null) {
            telemSector.textContent = projects[hoveredProjectIndex].name.toUpperCase().slice(0, 14);
        } else {
            telemSector.textContent = currentFormation === 'constellation' ? "GALAXY_CORE" : (currentFormation === 'bento' ? "3D_WALL_SECTOR" : "HELIX_VORTEX");
        }
    }
}

build3DWebsiteNodes(currentDisplayMode);

if (displayModeSelector) {
    displayModeSelector.addEventListener('change', (e) => {
        const newMode = e.target.value;
        currentDisplayMode = newMode;
        localStorage.setItem('portfolio_display_mode', newMode);
        build3DWebsiteNodes(newMode);
        rebuildEnergyBeams();
        playSound('select');
        showToast(`Switched 3D View: ${e.target.options[e.target.selectedIndex].text}`);
    });
}

// =========================================================================
// 11. ANIMATED PARTICLE CONSTELLATION ENERGY BEAMS
// =========================================================================
let connectionCurves = [];
let curveLinesGroup = new THREE.Group();
scene.add(curveLinesGroup);

let streamPositions = null;
let streamColors = null;
let streamParticleData = [];
let streamGeo = null;
let streamMat = null;
let streamPoints = null;
const totalStreamParticles = 480;

function rebuildEnergyBeams() {
    while (curveLinesGroup.children.length > 0) {
        curveLinesGroup.remove(curveLinesGroup.children[0]);
    }
    if (streamPoints) {
        scene.remove(streamPoints);
    }

    connectionCurves = [];
    streamParticleData = [];
    streamPositions = new Float32Array(totalStreamParticles * 3);
    streamColors = new Float32Array(totalStreamParticles * 3);

    for (let i = 0; i < totalProjects; i++) {
        const nextIdx = (i + 1) % totalProjects;
        const pCurrent = projectMeshes[i].position;
        const pNext = projectMeshes[nextIdx].position;
        const pCenter = coreGroup.position;

        // Ring segment curve
        const midPoint = new THREE.Vector3().addVectors(pCurrent, pNext).multiplyScalar(0.5);
        midPoint.y += Math.sin(i) * 0.5;
        midPoint.multiplyScalar(0.88);

        const ringCurve = new THREE.QuadraticBezierCurve3(pCurrent, midPoint, pNext);
        connectionCurves.push(ringCurve);

        // Center radial curve
        const radialMid = new THREE.Vector3().addVectors(pCenter, pCurrent).multiplyScalar(0.5);
        radialMid.y += 0.8;
        const radialCurve = new THREE.QuadraticBezierCurve3(pCenter, radialMid, pCurrent);
        connectionCurves.push(radialCurve);

        const curvePoints = ringCurve.getPoints(30);
        const lineGeo = new THREE.BufferGeometry().setFromPoints(curvePoints);
        const lineMat = new THREE.LineBasicMaterial({
            color: 0x6366f1,
            transparent: true,
            opacity: 0.22,
            blending: THREE.AdditiveBlending
        });
        const line = new THREE.Line(lineGeo, lineMat);
        curveLinesGroup.add(line);
    }

    for (let i = 0; i < totalStreamParticles; i++) {
        const curveIndex = i % connectionCurves.length;
        const progress = (i / totalStreamParticles + Math.random() * 0.1) % 1.0;
        const speed = 0.09 + Math.random() * 0.07;
        
        streamParticleData.push({ curveIndex, progress, speed });

        const color = (i % 2 === 0) ? new THREE.Color(0x00f2fe) : new THREE.Color(0xff2a7a);
        streamColors[i * 3] = color.r;
        streamColors[i * 3 + 1] = color.g;
        streamColors[i * 3 + 2] = color.b;
    }

    streamGeo = new THREE.BufferGeometry();
    streamGeo.setAttribute('position', new THREE.BufferAttribute(streamPositions, 3));
    streamGeo.setAttribute('color', new THREE.BufferAttribute(streamColors, 3));

    streamMat = new THREE.PointsMaterial({
        size: 0.48,
        vertexColors: true,
        transparent: true,
        opacity: 0.92,
        blending: THREE.AdditiveBlending
    });

    streamPoints = new THREE.Points(streamGeo, streamMat);
    scene.add(streamPoints);
}

rebuildEnergyBeams();

// =========================================================================
// 12. SMOOTH CAMERA INTERPOLATION ENGINE
// =========================================================================
const cameraTransition = {
    active: false,
    startTime: 0,
    duration: 1100,
    startPos: new THREE.Vector3(),
    endPos: new THREE.Vector3(),
    startLookAt: new THREE.Vector3(),
    endLookAt: new THREE.Vector3()
};

function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function focusOnProject(index, updateHash = true) {
    const group = projectMeshes[index];
    if (!group) return;

    selectedProjectIndex = index;
    const project = group.userData.project;

    const orbPos = group.position.clone();
    const dir = orbPos.clone().sub(coreGroup.position).normalize();
    const targetCamPos = orbPos.clone().add(dir.multiplyScalar(4.4)).add(new THREE.Vector3(0, 0.6, 0));
    const targetLookAt = orbPos.clone().add(new THREE.Vector3(0, 0.2, 0));

    cameraTransition.active = true;
    cameraTransition.startTime = performance.now();
    cameraTransition.startPos.copy(camera.position);
    cameraTransition.endPos.copy(targetCamPos);
    cameraTransition.startLookAt.copy(controls.target);
    cameraTransition.endLookAt.copy(targetLookAt);

    playSound('warp');
    triggerHaptic(20);
    showProjectCard(project);
    updateQuickNavSelection(index);
    updateOrbHighlights();

    if (updateHash && project.id) {
        history.replaceState(null, null, '#' + project.id);
    }
}

function resetCameraView(clearHash = true) {
    selectedProjectIndex = null;

    cameraTransition.active = true;
    cameraTransition.startTime = performance.now();
    cameraTransition.startPos.copy(camera.position);
    cameraTransition.endPos.copy(defaultCameraPos);
    cameraTransition.startLookAt.copy(controls.target);
    cameraTransition.endLookAt.copy(defaultLookAt);

    playSound('blip');
    hideProjectCard();
    updateQuickNavSelection(null);
    updateOrbHighlights();

    if (clearHash) {
        history.replaceState(null, null, window.location.pathname);
    }
}

// =========================================================================
// 13. GLASSMORPHISM PROJECT CARD & LIVE METRICS
// =========================================================================
const cardModal = document.getElementById('project-card');
const cardTitle = document.getElementById('card-title');
const cardCategory = document.getElementById('card-category');
const cardVersion = document.getElementById('card-version');
const cardDesc = document.getElementById('card-desc');
const cardTechStack = document.getElementById('card-tech-stack');
const cardActions = document.getElementById('card-actions');
const statStars = document.getElementById('stat-stars');
const statForks = document.getElementById('stat-forks');
const statLang = document.getElementById('stat-lang');
const quickNavContainer = document.getElementById('quick-nav');

function showToast(message, iconClass = 'fa-solid fa-circle-check') {
    const toast = document.getElementById('toast-msg');
    const toastText = document.getElementById('toast-text');
    if (!toast || !toastText) return;
    toastText.textContent = message;
    toast.querySelector('i').className = iconClass;
    toast.classList.add('active');
    setTimeout(() => {
        toast.classList.remove('active');
    }, 2800);
}

function animateCounter(element, targetValue) {
    if (!element || isNaN(targetValue)) return;
    const duration = 600;
    const startTime = performance.now();
    
    function updateCounter(time) {
        const progress = Math.min((time - startTime) / duration, 1);
        const current = Math.floor(progress * targetValue);
        element.textContent = current;
        if (progress < 1) requestAnimationFrame(updateCounter);
    }
    requestAnimationFrame(updateCounter);
}

async function showProjectCard(project) {
    cardCategory.textContent = project.category;
    cardCategory.style.color = project.accent;
    cardTitle.textContent = project.name;
    cardDesc.textContent = project.desc;

    const liveData = liveDataCache[project.id] || await fetchProjectLiveData(project);

    cardVersion.textContent = liveData.version || "v1.0.0";
    animateCounter(statStars, liveData.stars || 0);
    animateCounter(statForks, liveData.forks || 0);
    statLang.textContent = liveData.language || "Code";

    // Build Tech Stack Pills
    cardTechStack.innerHTML = project.techStack.map(tech => `
        <span class="tech-pill" data-tech="${escapeHtml(tech)}" title="Filter by ${escapeHtml(tech)}">
            <i class="fa-solid fa-circle-nodes" style="color: ${escapeHtml(project.accent)}; font-size: 10px;"></i>
            ${escapeHtml(tech)}
        </span>
    `).join('');

    cardTechStack.querySelectorAll('.tech-pill').forEach(pill => {
        pill.addEventListener('click', (e) => {
            e.stopPropagation();
            const techName = pill.getAttribute('data-tech');
            openSearchModal(techName);
        });
    });

    let actionsHtml = '';
    const safeDownloadUrl = sanitizeUrl(liveData.downloadUrl);
    const safeWebsiteUrl = sanitizeUrl(project.website);
    const safeGithubUrl = sanitizeUrl(project.github);
    const safeVersion = escapeHtml(liveData.version || 'v1.0.0');

    if (safeDownloadUrl) {
        actionsHtml += `
            <a href="${safeDownloadUrl}" target="_blank" rel="noopener noreferrer" class="card-btn btn-download">
                <i class="fa-solid fa-cloud-arrow-down"></i>
                <span>Download Latest Release (${safeVersion})</span>
            </a>
        `;
    }

    actionsHtml += `<div class="action-row">`;
    if (safeWebsiteUrl) {
        if (project.allowIframe !== false) {
            actionsHtml += `
                <button id="card-btn-preview" class="card-btn btn-preview" title="Test in embedded sandbox">
                    <i class="fa-solid fa-display"></i>
                    <span>Live Preview</span>
                </button>
            `;
        }
        actionsHtml += `
            <a href="${safeWebsiteUrl}" target="_blank" rel="noopener noreferrer" class="card-btn btn-primary">
                <i class="fa-solid fa-arrow-up-right-from-square"></i>
                <span>${escapeHtml(project.launchLabel || 'Launch')}</span>
            </a>
        `;
    }
    if (safeGithubUrl) {
        actionsHtml += `
            <a href="${safeGithubUrl}" target="_blank" rel="noopener noreferrer" class="card-btn ${safeWebsiteUrl ? 'btn-secondary' : 'btn-primary'}">
                <i class="fa-brands fa-github"></i>
                <span>GitHub</span>
            </a>
        `;
    }
    actionsHtml += `
        <button id="card-btn-share" class="card-btn btn-secondary" title="Copy direct link to this star system">
            <i class="fa-solid fa-share-nodes"></i>
            <span>Share</span>
        </button>
    </div>`;

    cardActions.innerHTML = actionsHtml;

    // Attach Action Listeners
    const previewBtn = document.getElementById('card-btn-preview');
    if (previewBtn && safeWebsiteUrl) {
        previewBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            openWebPreview(safeWebsiteUrl, project.name);
        });
    }

    const shareBtn = document.getElementById('card-btn-share');
    if (shareBtn) {
        shareBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const shareUrl = `${window.location.origin}${window.location.pathname}#${project.id}`;
            navigator.clipboard.writeText(shareUrl).then(() => {
                playSound('success');
                showToast(`Copied direct link for "${project.name}"!`);
            }).catch(() => {
                showToast(`Share URL: ${shareUrl}`);
            });
        });
    }

    cardModal.classList.add('active');
}

function hideProjectCard() {
    cardModal.classList.remove('active');
}

function updateOrbHighlights() {
    projectMeshes.forEach((m, idx) => {
        const isSelected = idx === selectedProjectIndex;
        const isHovered = idx === hoveredProjectIndex;
        const p = m.userData.project;
        const matchesCategory = activeCategoryFilter === "all" || p.filterCategory === activeCategoryFilter;

        const main = m.userData.mainMesh;
        const glow = m.userData.glowMesh;
        const label = m.userData.labelSprite;

        if (!matchesCategory) {
            if (glow) {
                glow.material.opacity = 0.04;
                glow.scale.set(0.85, 0.85, 0.85);
            }
            if (label) label.material.opacity = 0.2;
            m.scale.set(0.8, 0.8, 0.8);
            return;
        }

        if (label) label.material.opacity = 0.95;

        if (isSelected) {
            if (glow) {
                glow.material.opacity = 0.55;
                glow.scale.set(1.35, 1.35, 1.35);
            }
            if (label) label.scale.set(3.8, 1.04, 1);
            m.scale.set(1.15, 1.15, 1.15);
        } else if (isHovered) {
            if (glow) {
                glow.material.opacity = 0.42;
                glow.scale.set(1.2, 1.2, 1.2);
            }
            if (label) label.scale.set(3.6, 0.98, 1);
            m.scale.set(1.08, 1.08, 1.08);
        } else {
            if (glow) {
                glow.material.opacity = 0.25;
                glow.scale.set(1.0, 1.0, 1.0);
            }
            if (label) label.scale.set(3.4, 0.93, 1);
            m.scale.set(1.0, 1.0, 1.0);
        }
    });
}

// Generate Quick Nav Pills
function initQuickNav() {
    quickNavContainer.innerHTML = '';
    projects.forEach((proj, idx) => {
        if (activeCategoryFilter !== "all" && proj.filterCategory !== activeCategoryFilter) return;

        const btn = document.createElement('button');
        btn.className = 'nav-pill';
        btn.innerHTML = `<i class="fa-solid fa-circle-dot" style="color: ${proj.accent}; font-size: 10px;"></i><span>${proj.name}</span>`;
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (tourState.active) stopTour();
            playSound('select');
            focusOnProject(idx);
        });
        quickNavContainer.appendChild(btn);
    });
}
initQuickNav();

function updateQuickNavSelection(index) {
    const pills = quickNavContainer.querySelectorAll('.nav-pill');
    pills.forEach((p) => {
        p.classList.remove('active');
    });
    if (index !== null) {
        const proj = projects[index];
        const matchingPills = Array.from(pills).filter(p => p.textContent.includes(proj.name));
        if (matchingPills.length > 0) {
            matchingPills[0].classList.add('active');
            matchingPills[0].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        }
    }
}

// Category Filter Tabs Handling
const categoryButtons = document.querySelectorAll('.cat-tab');
categoryButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (tourState.active) stopTour();
        categoryButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeCategoryFilter = btn.getAttribute('data-category');
        playSound('blip');
        initQuickNav();
        updateOrbHighlights();
    });
});

// =========================================================================
// 14. CINEMATIC GUIDED TOUR / AUTOPILOT ENGINE
// =========================================================================
const tourState = {
    active: false,
    paused: false,
    currentIndex: 0,
    dwellTime: 6500,
    startTime: 0,
    rafId: null
};

const tourHud = document.getElementById('tour-hud-bar');
const tourProgressFill = document.getElementById('tour-progress-fill');
const tourActiveLabel = document.getElementById('tour-active-label');
const tourToggleIcon = document.getElementById('tour-toggle-icon');
const btnTour = document.getElementById('btn-tour');
const tourIcon = document.getElementById('tour-icon');

function startTour(startIndex = 0) {
    tourState.active = true;
    tourState.paused = false;
    tourState.currentIndex = startIndex % projects.length;
    tourState.startTime = performance.now();

    tourHud.classList.add('active');
    if (btnTour) {
        btnTour.style.borderColor = 'var(--accent)';
        btnTour.style.background = 'rgba(99, 102, 241, 0.35)';
        tourIcon.className = "fa-solid fa-circle-pause";
    }
    if (tourToggleIcon) tourToggleIcon.className = "fa-solid fa-pause";

    jumpToTourStep(tourState.currentIndex);
    playSound('success');
    showToast("Launching Celestial Tour Mode...", "fa-solid fa-shuttle-space");
}

function stopTour() {
    tourState.active = false;
    tourState.paused = false;
    tourHud.classList.remove('active');
    if (btnTour) {
        btnTour.style.borderColor = '';
        btnTour.style.background = '';
        tourIcon.className = "fa-solid fa-play";
    }
    showToast("Exited Tour Mode", "fa-solid fa-info-circle");
}

function toggleTourPause() {
    if (!tourState.active) return;
    tourState.paused = !tourState.paused;
    if (tourToggleIcon) {
        tourToggleIcon.className = tourState.paused ? "fa-solid fa-play" : "fa-solid fa-pause";
    }
    if (!tourState.paused) {
        tourState.startTime = performance.now();
    }
    playSound('blip');
}

function jumpToTourStep(index) {
    tourState.currentIndex = (index + projects.length) % projects.length;
    tourState.startTime = performance.now();
    const p = projects[tourState.currentIndex];

    if (tourActiveLabel) {
        tourActiveLabel.textContent = `${p.name} (${tourState.currentIndex + 1}/${projects.length})`;
    }
    if (tourProgressFill) {
        tourProgressFill.style.width = '0%';
    }

    focusOnProject(tourState.currentIndex);
}

function updateTourProgress(time) {
    if (!tourState.active || tourState.paused || cameraTransition.active) return;

    const elapsed = time - tourState.startTime;
    const progress = Math.min(elapsed / tourState.dwellTime, 1.0);

    if (tourProgressFill) {
        tourProgressFill.style.width = `${progress * 100}%`;
    }

    if (progress >= 1.0) {
        jumpToTourStep(tourState.currentIndex + 1);
    }
}

if (btnTour) {
    btnTour.addEventListener('click', (e) => {
        e.stopPropagation();
        if (tourState.active) {
            stopTour();
        } else {
            startTour(selectedProjectIndex !== null ? selectedProjectIndex : 0);
        }
    });
}

document.getElementById('tour-toggle-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    toggleTourPause();
});

document.getElementById('tour-next-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    jumpToTourStep(tourState.currentIndex + 1);
});

document.getElementById('tour-prev-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    jumpToTourStep(tourState.currentIndex - 1);
});

document.getElementById('tour-exit-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    stopTour();
});

// =========================================================================
// 15. INSTANT SEARCH & COMMAND PALETTE (CTRL+K / ⌘K)
// =========================================================================
const searchModal = document.getElementById('search-modal-backdrop');
const searchInput = document.getElementById('search-input');
const searchResultsList = document.getElementById('search-results-list');
const btnSearch = document.getElementById('btn-search');
let searchSelectedIndex = 0;
let filteredSearchResults = [];

function openSearchModal(initialQuery = '') {
    if (tourState.active) toggleTourPause();
    searchModal.classList.add('active');
    searchInput.value = initialQuery;
    searchInput.focus();
    renderSearchResults(initialQuery);
    playSound('blip');
}

function closeSearchModal() {
    searchModal.classList.remove('active');
    searchInput.value = '';
    searchInput.blur();
}

function renderSearchResults(query = '') {
    const q = query.trim().toLowerCase();
    filteredSearchResults = projects.filter(p => {
        if (!q) return true;
        const inName = p.name.toLowerCase().includes(q);
        const inDesc = p.desc.toLowerCase().includes(q);
        const inCat = p.category.toLowerCase().includes(q);
        const inLang = (p.defaultLanguage || '').toLowerCase().includes(q);
        const inTech = p.techStack.some(t => t.toLowerCase().includes(q));
        const inMoon = p.moonFeatures.some(m => m.toLowerCase().includes(q));
        return inName || inDesc || inCat || inLang || inTech || inMoon;
    });

    searchSelectedIndex = 0;
    searchResultsList.innerHTML = '';

    if (filteredSearchResults.length === 0) {
        searchResultsList.innerHTML = `
            <div style="padding: 24px; text-align: center; color: var(--text-muted); font-size: 13px;">
                <i class="fa-solid fa-satellite-dish" style="font-size: 24px; margin-bottom: 8px; color: var(--accent);"></i>
                <p>No systems found matching "<b>${escapeHtml(query)}</b>"</p>
            </div>
        `;
        return;
    }

    filteredSearchResults.forEach((p, idx) => {
        const item = document.createElement('div');
        item.className = `search-item ${idx === 0 ? 'selected' : ''}`;
        item.innerHTML = `
            <div class="search-item-info">
                <span class="search-item-title">${escapeHtml(p.name)}</span>
                <span class="search-item-desc">${escapeHtml(p.desc)}</span>
            </div>
            <span class="search-item-badge">${escapeHtml(p.defaultLanguage)}</span>
        `;

        item.addEventListener('click', () => {
            selectSearchItem(p);
        });

        item.addEventListener('mouseenter', () => {
            searchSelectedIndex = idx;
            updateSearchSelectionVisuals();
        });

        searchResultsList.appendChild(item);
    });
}

function updateSearchSelectionVisuals() {
    const items = searchResultsList.querySelectorAll('.search-item');
    items.forEach((it, idx) => {
        it.classList.toggle('selected', idx === searchSelectedIndex);
    });
}

function selectSearchItem(project) {
    const pIndex = projects.findIndex(x => x.id === project.id);
    closeSearchModal();
    if (pIndex !== -1) {
        focusOnProject(pIndex);
        playSound('select');
    }
}

if (btnSearch) {
    btnSearch.addEventListener('click', (e) => {
        e.stopPropagation();
        openSearchModal();
    });
}

searchInput.addEventListener('input', (e) => {
    renderSearchResults(e.target.value);
});

searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (filteredSearchResults.length > 0) {
            searchSelectedIndex = (searchSelectedIndex + 1) % filteredSearchResults.length;
            updateSearchSelectionVisuals();
        }
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (filteredSearchResults.length > 0) {
            searchSelectedIndex = (searchSelectedIndex - 1 + filteredSearchResults.length) % filteredSearchResults.length;
            updateSearchSelectionVisuals();
        }
    } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredSearchResults[searchSelectedIndex]) {
            selectSearchItem(filteredSearchResults[searchSelectedIndex]);
        }
    } else if (e.key === 'Escape') {
        closeSearchModal();
    }
});

searchModal.addEventListener('click', (e) => {
    if (e.target === searchModal) {
        closeSearchModal();
    }
});

// Global Keyboard Hotkeys
window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (searchModal.classList.contains('active')) {
            closeSearchModal();
        } else {
            openSearchModal();
        }
    } else if (e.key === '/' && !searchModal.classList.contains('active') && document.activeElement.tagName !== 'INPUT') {
        e.preventDefault();
        openSearchModal();
    } else if (e.key === 'Escape') {
        if (previewModal.classList.contains('active')) {
            closeWebPreview();
        } else if (searchModal.classList.contains('active')) {
            closeSearchModal();
        } else if (tourState.active) {
            stopTour();
        } else if (selectedProjectIndex !== null) {
            resetCameraView();
        }
    }
});

// =========================================================================
// 16. IN-APP LIVE WEB PREVIEW SANDBOX
// =========================================================================
const previewModal = document.getElementById('preview-modal-backdrop');
const previewIframe = document.getElementById('preview-iframe');
const previewUrlText = document.getElementById('preview-url-text');
const previewLoader = document.getElementById('preview-loader');
const previewRefreshBtn = document.getElementById('preview-refresh-btn');
const previewExternalBtn = document.getElementById('preview-external-btn');
const previewCloseBtn = document.getElementById('preview-close-btn');
const previewCloseDot = document.getElementById('preview-close-dot');

let currentPreviewUrl = '';

function openWebPreview(url, title) {
    if (!url) return;
    currentPreviewUrl = url;
    previewUrlText.textContent = url;
    previewExternalBtn.href = url;

    previewLoader.style.opacity = '1';
    previewLoader.style.pointerEvents = 'auto';

    previewIframe.src = url;
    previewIframe.onload = () => {
        setTimeout(() => {
            previewLoader.style.opacity = '0';
            previewLoader.style.pointerEvents = 'none';
        }, 400);
    };

    previewModal.classList.add('active');
    playSound('warp');
}

function closeWebPreview() {
    previewModal.classList.remove('active');
    previewIframe.src = '';
}

previewRefreshBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (currentPreviewUrl) {
        previewLoader.style.opacity = '1';
        previewLoader.style.pointerEvents = 'auto';
        previewIframe.src = currentPreviewUrl;
        playSound('blip');
    }
});

previewCloseBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    closeWebPreview();
});

previewCloseDot.addEventListener('click', (e) => {
    e.stopPropagation();
    closeWebPreview();
});

previewModal.addEventListener('click', (e) => {
    if (e.target === previewModal) {
        closeWebPreview();
    }
});

// UI Buttons & Theme Switcher
document.getElementById('card-close-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    if (tourState.active) stopTour();
    resetCameraView();
});

document.getElementById('btn-reset').addEventListener('click', (e) => {
    e.stopPropagation();
    if (tourState.active) stopTour();
    resetCameraView();
});

function applyTheme(newTheme) {
    if (!themes[newTheme]) return;
    currentThemeKey = newTheme;
    localStorage.setItem('portfolio_theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    if (themeSelector) themeSelector.value = newTheme;

    const tData = themes[newTheme];
    nebulaUniforms.u_color1.value.copy(tData.c1);
    nebulaUniforms.u_color2.value.copy(tData.c2);
    nebulaUniforms.u_color3.value.copy(tData.c3);
    coreIcoMat.color.setHex(tData.coreColor);
    coreIcoMat.emissive.setHex(tData.coreColor);
    ambientLight.intensity = tData.ambient;

    // Sukuna domain specific visuals
    if (newTheme === 'sukuna') {
        bloodAshMat.opacity = 0.85;
        gridHelper.material.color.setHex(0xff0033);
        if (cyberDisc) cyberDisc.material.color.setHex(0xff0033);
        wheelGoldMat.emissive.setHex(0x7f1d1d);
        wheelGoldMat.emissiveIntensity = 0.65;
    } else {
        bloodAshMat.opacity = 0;
        gridHelper.material.color.setHex(0x6366f1);
        if (cyberDisc) cyberDisc.material.color.setHex(0x00f2fe);
        wheelGoldMat.emissive.setHex(0x92400e);
        wheelGoldMat.emissiveIntensity = 0.45;
    }
}

if (themeSelector) {
    themeSelector.addEventListener('change', (e) => {
        applyTheme(e.target.value);
        playSound('blip');
    });
}

// Sukuna Domain Expansion HUD Button
const btnDomain = document.getElementById('btn-domain');
if (btnDomain) {
    btnDomain.addEventListener('click', (e) => {
        e.stopPropagation();
        activateDomainExpansion();
    });
}

// Initial theme check
if (currentThemeKey === 'sukuna') {
    applyTheme('sukuna');
}

// Motion & Accessibility Mode Toggle
let isMotionReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const motionBtn = document.getElementById('btn-motion');
const motionStatus = document.getElementById('motion-status');

if (isMotionReduced && motionStatus) {
    motionStatus.textContent = "Motion: Reduced";
}

if (motionBtn) {
    motionBtn.addEventListener('click', () => {
        isMotionReduced = !isMotionReduced;
        if (motionStatus) motionStatus.textContent = isMotionReduced ? "Motion: Reduced" : "Motion: 60fps";
        motionBtn.style.opacity = isMotionReduced ? "0.7" : "1";
        playSound('blip');
    });
}

// =========================================================================
// 17. CURSOR PARALLAX, RAYCASTING & TOUCH INTERACTION
// =========================================================================
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const targetMouseOffset = new THREE.Vector2();
const currentMouseOffset = new THREE.Vector2();

function getPointerIntersects(clientX, clientY) {
    mouse.x = (clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    return raycaster.intersectObjects(projectRaycastTargets, true);
}

// Hover & Parallax Handling
window.addEventListener('mousemove', (e) => {
    targetMouseOffset.x = (e.clientX / window.innerWidth - 0.5) * 1.8;
    targetMouseOffset.y = (e.clientY / window.innerHeight - 0.5) * 1.2;

    const normX = (e.clientX / window.innerWidth) * 2 - 1;
    const normY = -(e.clientY / window.innerHeight) * 2 + 1;
    spawnStardustAtMouse(normX, normY);

    if (cameraTransition.active) return;
    const intersects = getPointerIntersects(e.clientX, e.clientY);
    if (intersects.length > 0) {
        document.body.style.cursor = 'pointer';
        let hitObject = intersects[0].object;
        while (hitObject && hitObject.userData.projectIndex === undefined && hitObject.parent) {
            hitObject = hitObject.parent;
        }
        const hitIndex = hitObject ? hitObject.userData.projectIndex : undefined;
        if (hitIndex !== undefined && hoveredProjectIndex !== hitIndex) {
            hoveredProjectIndex = hitIndex;
            playSound('hover');
            updateOrbHighlights();
        }
    } else {
        document.body.style.cursor = 'default';
        if (hoveredProjectIndex !== null) {
            hoveredProjectIndex = null;
            updateOrbHighlights();
        }
    }
});

// Click Interaction (Desktop)
window.addEventListener('click', (e) => {
    if (e.target.closest('#header-hud') ||
        e.target.closest('#top-controls') ||
        e.target.closest('#telemetry-bar') ||
        e.target.closest('#category-bar') ||
        e.target.closest('#project-card') ||
        e.target.closest('#quick-nav') ||
        e.target.closest('#tour-hud-bar') ||
        e.target.closest('#cockpit-dock') ||
        e.target.closest('#cyber-terminal-drawer') ||
        e.target.closest('#matrix-modal-backdrop') ||
        e.target.closest('#search-modal-backdrop') ||
        e.target.closest('#preview-modal-backdrop')) {
        return;
    }

    const intersects = getPointerIntersects(e.clientX, e.clientY);
    if (intersects.length > 0) {
        let hitObject = intersects[0].object;
        if (hitObject.userData.isMahoraga) {
            adaptMahoraga(true);
            return;
        }
        while (hitObject && hitObject.userData.projectIndex === undefined && hitObject.parent) {
            hitObject = hitObject.parent;
            if (hitObject && hitObject.userData.isMahoraga) {
                adaptMahoraga(true);
                return;
            }
        }
        const hitIndex = hitObject ? hitObject.userData.projectIndex : undefined;
        if (hitIndex !== undefined) {
            if (tourState.active) stopTour();
            playSound('select');
            focusOnProject(hitIndex);
        }
    } else {
        // Empty space click: spawn cyber shockwave ripple on floor
        const normX = (e.clientX / window.innerWidth) * 2 - 1;
        const normY = -(e.clientY / window.innerHeight) * 2 + 1;
        raycasterMouse.setFromCamera(new THREE.Vector2(normX, normY), camera);
        if (raycasterMouse.ray.intersectPlane(mouseGroundPlane, rayIntersectPoint)) {
            createSpaceShockwave(rayIntersectPoint.x, rayIntersectPoint.z);
        }

        if (selectedProjectIndex !== null) {
            if (tourState.active) stopTour();
            resetCameraView();
        }
    }
});

// Global Keyboard Shortcuts
window.addEventListener('keydown', (e) => {
    if (e.key === '`' || e.key === '~') {
        if (document.activeElement !== terminalInput && document.activeElement !== searchInput) {
            e.preventDefault();
            toggleTerminal();
        }
    }
});

// Mobile Touch Handling (Tap vs Drag)
let touchStartX = 0;
let touchStartY = 0;
let touchStartTime = 0;

window.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        touchStartTime = performance.now();
    }
}, { passive: true });

window.addEventListener('touchend', (e) => {
    if (e.changedTouches.length === 1) {
        const deltaX = Math.abs(e.changedTouches[0].clientX - touchStartX);
        const deltaY = Math.abs(e.changedTouches[0].clientY - touchStartY);
        const duration = performance.now() - touchStartTime;

        if (deltaX < 10 && deltaY < 10 && duration < 300) {
            const target = e.target;
            if (target.closest('#header-hud') ||
                target.closest('#top-controls') ||
                target.closest('#category-bar') ||
                target.closest('#project-card') ||
                target.closest('#quick-nav') ||
                target.closest('#tour-hud-bar') ||
                target.closest('#search-modal-backdrop') ||
                target.closest('#preview-modal-backdrop')) {
                return;
            }

            const clientX = e.changedTouches[0].clientX;
            const clientY = e.changedTouches[0].clientY;
            const intersects = getPointerIntersects(clientX, clientY);

            if (intersects.length > 0) {
                let hitObject = intersects[0].object;
                if (hitObject.userData.isMahoraga) {
                    adaptMahoraga(true);
                    return;
                }
                while (hitObject && hitObject.userData.projectIndex === undefined && hitObject.parent) {
                    hitObject = hitObject.parent;
                    if (hitObject && hitObject.userData.isMahoraga) {
                        adaptMahoraga(true);
                        return;
                    }
                }
                const hitIndex = hitObject ? hitObject.userData.projectIndex : undefined;
                if (hitIndex !== undefined) {
                    if (tourState.active) stopTour();
                    playSound('select');
                    focusOnProject(hitIndex);
                }
            } else {
                if (selectedProjectIndex !== null) {
                    if (tourState.active) stopTour();
                    resetCameraView();
                }
            }
        }
    }
}, { passive: true });

// =========================================================================
// 18. URL HASH ROUTING & DEEP LINKING
// =========================================================================
function handleUrlHash() {
    const hash = window.location.hash.replace('#', '').trim();
    if (hash) {
        const matchIndex = projects.findIndex(p => p.id === hash || p.repo.toLowerCase() === hash.toLowerCase());
        if (matchIndex !== -1) {
            setTimeout(() => {
                focusOnProject(matchIndex, false);
            }, 600);
        }
    }
}

window.addEventListener('hashchange', () => {
    handleUrlHash();
});

// Run initial hash check
handleUrlHash();

// =========================================================================
// 19. HOLOGRAPHIC CONSTELLATION RADAR & MAGNETIC CURSOR
// =========================================================================
const radarCanvas = document.getElementById('radar-canvas');
const radarCtx = radarCanvas ? radarCanvas.getContext('2d') : null;
let radarAngle = 0;

function drawConstellationRadar() {
    if (!radarCtx || isMobile) return;
    const W = radarCanvas.width;
    const H = radarCanvas.height;
    const cx = W / 2;
    const cy = H / 2;
    const R = cx - 4;

    radarCtx.clearRect(0, 0, W, H);

    // Radar Base Rings
    radarCtx.strokeStyle = 'rgba(0, 242, 254, 0.3)';
    radarCtx.lineWidth = 1.2;
    radarCtx.beginPath();
    radarCtx.arc(cx, cy, R, 0, Math.PI * 2);
    radarCtx.stroke();

    radarCtx.beginPath();
    radarCtx.arc(cx, cy, R * 0.55, 0, Math.PI * 2);
    radarCtx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    radarCtx.stroke();

    // Crosshairs
    radarCtx.strokeStyle = 'rgba(0, 242, 254, 0.18)';
    radarCtx.beginPath();
    radarCtx.moveTo(cx - R, cy); radarCtx.lineTo(cx + R, cy);
    radarCtx.moveTo(cx, cy - R); radarCtx.lineTo(cx, cy + R);
    radarCtx.stroke();

    // Rotating Radar Sweep Cone
    radarAngle += 0.038;
    const sweepGrad = radarCtx.createRadialGradient(cx, cy, 0, cx, cy, R);
    sweepGrad.addColorStop(0, 'rgba(0, 242, 254, 0.35)');
    sweepGrad.addColorStop(1, 'transparent');

    radarCtx.save();
    radarCtx.beginPath();
    radarCtx.moveTo(cx, cy);
    radarCtx.arc(cx, cy, R, radarAngle, radarAngle + 0.45);
    radarCtx.closePath();
    radarCtx.fillStyle = sweepGrad;
    radarCtx.fill();
    radarCtx.restore();

    // Center Core Blip
    radarCtx.fillStyle = '#6366f1';
    radarCtx.beginPath();
    radarCtx.arc(cx, cy, 3, 0, Math.PI * 2);
    radarCtx.fill();

    // System Blips
    const maxDist = 20;
    projectMeshes.forEach((mesh, idx) => {
        const px = cx + (mesh.position.x / maxDist) * (R * 0.82);
        const py = cy + (mesh.position.z / maxDist) * (R * 0.82);

        const isSelected = (selectedProjectIndex === idx);
        const isHovered = (hoveredProjectIndex === idx);

        radarCtx.fillStyle = isSelected ? '#ffffff' : (isHovered ? '#00f2fe' : '#' + projects[idx].color.toString(16).padStart(6, '0'));
        radarCtx.beginPath();
        radarCtx.arc(px, py, isSelected ? 4 : (isHovered ? 3.5 : 2.5), 0, Math.PI * 2);
        radarCtx.fill();

        if (isSelected || isHovered) {
            radarCtx.strokeStyle = isSelected ? '#ffffff' : '#00f2fe';
            radarCtx.lineWidth = 1.5;
            radarCtx.beginPath();
            radarCtx.arc(px, py, isSelected ? 7 : 6, 0, Math.PI * 2);
            radarCtx.stroke();
        }
    });
}

// Radar Canvas Click -> Warp to Star System
if (radarCanvas) {
    radarCanvas.addEventListener('click', (e) => {
        const rect = radarCanvas.getBoundingClientRect();
        const clickX = e.clientX - rect.left - radarCanvas.width / 2;
        const clickY = e.clientY - rect.top - radarCanvas.height / 2;
        const R = radarCanvas.width / 2 - 4;
        const maxDist = 20;

        let closestIdx = -1;
        let minDist = Infinity;

        projectMeshes.forEach((mesh, idx) => {
            const px = (mesh.position.x / maxDist) * (R * 0.82);
            const py = (mesh.position.z / maxDist) * (R * 0.82);
            const dist = Math.hypot(clickX - px, clickY - py);
            if (dist < minDist) {
                minDist = dist;
                closestIdx = idx;
            }
        });

        if (closestIdx !== -1 && minDist < 24) {
            if (tourState.active) stopTour();
            playSound('select');
            focusOnProject(closestIdx);
        }
    });
}

// Magnetic Custom Cyber Cursor
const cursorDot = document.getElementById('cursor-dot');
const cursorRing = document.getElementById('cursor-ring');
let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
let ringX = mouseX, ringY = mouseY;

window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (cursorDot) {
        cursorDot.style.left = `${mouseX}px`;
        cursorDot.style.top = `${mouseY}px`;
    }

    const target = e.target;
    if (cursorRing) {
        if (target.closest('.hud-btn, .nav-pill, .cat-tab, .tour-btn, a, button, select, #radar-canvas') || hoveredProjectIndex !== null) {
            cursorRing.classList.add('active');
        } else {
            cursorRing.classList.remove('active');
        }
    }
});

// Live FPS Calculation
const fpsValElem = document.getElementById('fps-val');
let frameCount = 0;
let lastFpsTime = performance.now();

function updateFpsCounter(now) {
    frameCount++;
    if (now - lastFpsTime >= 500) {
        const fps = Math.round((frameCount * 1000) / (now - lastFpsTime));
        frameCount = 0;
        lastFpsTime = now;
        if (fpsValElem) {
            fpsValElem.textContent = `${fps} FPS`;
            fpsValElem.parentElement.style.borderColor = fps >= 45 ? 'rgba(16, 185, 129, 0.4)' : 'rgba(245, 158, 11, 0.4)';
            fpsValElem.style.color = fps >= 45 ? '#10b981' : '#f59e0b';
        }
    }
}

// =========================================================================
// 20. ANIMATION & RENDER LOOP
// =========================================================================
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();
    const t = clock.getElapsedTime();
    const now = performance.now();

    const motionFactor = isMotionReduced ? 0.15 : 1.0;

    // 1. Nebula Shader & Starfield
    nebulaUniforms.u_time.value = t * motionFactor;
    starField.rotation.y = t * 0.015 * motionFactor;

    // 2. Cyber Disc & Floating Stardust Embers
    if (cyberDisc) cyberDisc.rotation.z = t * 0.02 * motionFactor;
    if (embers) {
        const pos = embers.geometry.attributes.position;
        for (let i = 0; i < emberCount; i++) {
            const d = emberData[i];
            let py = pos.getY(i) + d.speed * motionFactor;
            if (py > 15) py = -10;
            pos.setY(i, py);
            pos.setX(i, pos.getX(i) + Math.sin(t * 0.8 + d.phase) * 0.006 * motionFactor);
        }
        pos.needsUpdate = true;
    }

    // 3. Dynamic Interactive Spotlight Tracking
    const activeMesh = selectedProjectIndex !== null ? projectMeshes[selectedProjectIndex] : (hoveredProjectIndex !== null ? projectMeshes[hoveredProjectIndex] : null);
    if (activeMesh && hoverSpotLight) {
        hoverSpotLight.target.position.lerp(activeMesh.position, 0.1);
        hoverSpotLight.position.set(activeMesh.position.x * 0.75, activeMesh.position.y + 14, activeMesh.position.z + 10);
        hoverSpotLight.intensity = THREE.MathUtils.lerp(hoverSpotLight.intensity, 6.0, 0.1);
    } else if (hoverSpotLight) {
        hoverSpotLight.intensity = THREE.MathUtils.lerp(hoverSpotLight.intensity, 1.2, 0.05);
    }

    // 4. Shooting Comets
    updateComets(delta * motionFactor);

    // 5. Central Stellar Core
    coreMesh.rotation.x = t * 0.35 * motionFactor;
    coreMesh.rotation.y = t * 0.45 * motionFactor;
    innerCrystal.rotation.x = -t * 0.5 * motionFactor;
    
    coreRings.forEach((ring, i) => {
        ring.rotation.z = t * (0.15 + i * 0.08) * (i % 2 === 0 ? 1 : -1) * motionFactor;
    });

    // 5B. Mahoraga Adaptation Wheel (八握剣異戒神将魔虚羅の法輪)
    if (mahoragaWheel) {
        mahoragaWheel.rotation.z += (mahoragaTargetRotZ - mahoragaWheel.rotation.z) * 0.12;
        mahoragaGroup.rotation.y += 0.003 * motionFactor;
        mahoragaGroup.position.y = 3.7 + Math.sin(t * 1.5 * motionFactor) * 0.12;

        // Periodic auto adaptation
        mahoragaAutoTimer += delta;
        if (mahoragaAutoTimer >= 16.0) {
            mahoragaAutoTimer = 0;
            adaptMahoraga();
        }
    }

    // 5C. Sukuna's Malevolent Shrine (伏魔御厨子) Cleave Slashes & Blood Ash
    updateCleaveSlashes(delta * motionFactor, motionFactor);
    if (currentThemeKey === 'sukuna' && bloodAsh) {
        const bPos = bloodAsh.geometry.attributes.position;
        for (let i = 0; i < bloodAshCount; i++) {
            let by = bPos.getY(i) + bloodAshData[i].speed * motionFactor;
            if (by > 15) by = -11;
            bPos.setY(i, by);
            bPos.setX(i, bPos.getX(i) + Math.sin(t * 1.1 + i) * 0.008 * motionFactor);
        }
        bPos.needsUpdate = true;
    }

    // 5D. Domain Expansion Tremor
    if (domainShakeFrames > 0) {
        domainShakeFrames--;
        const shakeAmt = (domainShakeFrames / 42) * 0.25;
        camera.position.x += (Math.random() - 0.5) * shakeAmt;
        camera.position.y += (Math.random() - 0.5) * shakeAmt;
    }

    // 6. 3D Website Portals & Levitating Icons
    projectMeshes.forEach((group, i) => {
        const userData = group.userData;
        
        // Smoothly interpolate towards active 3D formation position and orientation
        if (userData.targetPos) {
            group.position.lerp(userData.targetPos, 0.08);
        }
        if (userData.targetRot) {
            const targetQuat = new THREE.Quaternion().setFromEuler(userData.targetRot);
            group.quaternion.slerp(targetQuat, 0.08);
        }

        // Floating hover sway
        group.position.y += Math.sin(t * 1.3 * motionFactor + i * 0.9) * 0.012;

        // Micro-floating rotation
        if (currentDisplayMode === 'spheres') {
            if (group.children[0]) group.children[0].rotation.y += 0.012 * motionFactor;
            if (group.children[2]) group.children[2].rotation.z += 0.008 * motionFactor;
        } else {
            // Gentle gyroscopic tilt for 3D windows & monoliths
            const tilt = Math.sin(t * 0.8 * motionFactor + i) * 0.03;
            group.rotation.z = tilt;
        }

        // Animate floating brand icon badge if present
        const brandIconGroup = group.children.find(c => c.type === 'Group');
        if (brandIconGroup) {
            brandIconGroup.position.y = (currentDisplayMode === 'windows' ? 0.92 : 1.45) + Math.sin(t * 2.5 * motionFactor + i) * 0.04;
            brandIconGroup.rotation.y = Math.sin(t * 1.8 * motionFactor + i) * 0.18;
        }
    });

    // Orbiting Satellite Moons
    moonList.forEach(moon => {
        const angle = t * moon.speed * motionFactor + moon.offset;
        moon.mesh.position.x = Math.cos(angle) * moon.radius;
        moon.mesh.position.z = Math.sin(angle) * moon.radius;
        moon.mesh.position.y = Math.sin(angle * 1.5 + moon.tilt) * 0.35;
    });

    // 7. Flowing Particle Constellation Streams
    if (streamGeo && streamParticleData.length > 0) {
        const posAttr = streamGeo.attributes.position;
        for (let i = 0; i < totalStreamParticles; i++) {
            const pData = streamParticleData[i];
            pData.progress = (pData.progress + pData.speed * delta * motionFactor) % 1.0;

            const curve = connectionCurves[pData.curveIndex];
            if (curve) {
                const point = curve.getPoint(pData.progress);
                posAttr.setXYZ(i, point.x, point.y, point.z);
            }
        }
        posAttr.needsUpdate = true;
    }

    // 8. Smooth Camera Transition
    if (cameraTransition.active) {
        const elapsed = performance.now() - cameraTransition.startTime;
        const progress = Math.min(elapsed / cameraTransition.duration, 1.0);
        const ease = easeInOutCubic(progress);

        camera.position.lerpVectors(cameraTransition.startPos, cameraTransition.endPos, ease);
        controls.target.lerpVectors(cameraTransition.startLookAt, cameraTransition.endLookAt, ease);

        if (progress >= 1.0) {
            cameraTransition.active = false;
        }
    } else if (!isMobile) {
        // Parallax mouse sway
        currentMouseOffset.lerp(targetMouseOffset, 0.05);
        camera.position.x += (currentMouseOffset.x - camera.position.x * 0.02) * 0.02;
    }

    // 9. Modulate Ambient Audio Drone with Camera distance/angles
    if (audioCtx && soundEnabled) {
        const dist = camera.position.distanceTo(controls.target);
        const normDist = 1.0 - Math.min(Math.max((dist - 4) / 30, 0), 1);
        modulateAmbientDrone(normDist);
    }

    // 10. Tour Progress Update
    updateTourProgress(now);

    // 11. Holographic Radar & Magnetic Cursor & FPS updates
    drawConstellationRadar();
    updateFpsCounter(now);

    // 12. Real-Time Web Audio Spectrum & Waveform Visualizer
    drawAudioVisualizer();

    // 13. Dynamic Space Shockwaves & Kinetic Cursor Stardust
    updateShockwaves(delta * motionFactor);
    updateStardust(delta * motionFactor);

    // 14. Spatial Telemetry Coordinates Readout
    updateTelemetry();

    if (cursorRing && !isMobile) {
        ringX += (mouseX - ringX) * 0.22;
        ringY += (mouseY - ringY) * 0.22;
        cursorRing.style.left = `${ringX}px`;
        cursorRing.style.top = `${ringY}px`;
    }

    controls.update();
    renderer.render(scene, camera);
}

animate();

// =========================================================================
// 20. RESPONSIVE RESIZE HANDLING
// =========================================================================
window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const isNowMobile = width < 768;

    camera.aspect = width / height;
    camera.fov = isNowMobile ? 65 : 55;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
