const http = require('http');
const fs = require('fs');
const path = require('path');

let PORT = parseInt(process.env.PORT || '8080', 10);
const PUBLIC_DIR = path.resolve(__dirname);

const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.mjs': 'application/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.webp': 'image/webp',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.txt': 'text/plain; charset=utf-8'
};

const server = http.createServer((req, res) => {
    // Standard Security Headers
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    if (req.method !== 'GET' && req.method !== 'HEAD') {
        res.writeHead(405, { 'Content-Type': 'text/plain' });
        res.end('405 Method Not Allowed');
        return;
    }

    // Sanitize and resolve file path to prevent Directory / Path Traversal
    let safeUrl = req.url.split('?')[0];
    if (safeUrl === '/' || safeUrl === '') {
        safeUrl = '/index.html';
    }

    // Decode URL component safely
    let decodedPath;
    try {
        decodedPath = decodeURIComponent(safeUrl);
    } catch (e) {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('400 Bad Request');
        return;
    }

    const filePath = path.resolve(PUBLIC_DIR, '.' + decodedPath);

    // Enforce root boundary check
    if (!filePath.startsWith(PUBLIC_DIR)) {
        res.writeHead(403, { 'Content-Type': 'text/plain' });
        res.end('403 Forbidden: Access Denied');
        return;
    }

    fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 Not Found');
            return;
        }

        const ext = path.extname(filePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';

        res.writeHead(200, {
            'Content-Type': contentType,
            'Content-Length': stats.size,
            'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=86400'
        });

        if (req.method === 'HEAD') {
            res.end();
            return;
        }

        const readStream = fs.createReadStream(filePath);
        readStream.pipe(res);
    });
});

function startServer(port) {
    server.listen(port, '0.0.0.0', () => {
        console.log(`Constellation Hub Server running at http://localhost:${port}/`);
    });
}

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.log(`Port ${PORT} is in use, trying ${PORT + 1}...`);
        PORT += 1;
        startServer(PORT);
    } else {
        console.error('Server error:', err);
    }
});

startServer(PORT);
