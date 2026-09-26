"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchImageBuffer = fetchImageBuffer;
const https_1 = __importDefault(require("https"));
const http_1 = __importDefault(require("http"));
function fetchImageBuffer(url) {
    return new Promise((resolve, reject) => {
        const client = url.startsWith('https') ? https_1.default : http_1.default;
        const req = client.get(url, (res) => {
            if (res.statusCode === 301 || res.statusCode === 302) {
                if (res.headers.location) {
                    return resolve(fetchImageBuffer(res.headers.location));
                }
            }
            if (res.statusCode !== 200) {
                return reject(new Error(`Failed to fetch image: ${res.statusCode} ${res.statusMessage}`));
            }
            const chunks = [];
            let totalLength = 0;
            const MAX_SIZE = 20 * 1024 * 1024; // 20 MB limit
            res.on('data', (chunk) => {
                totalLength += chunk.length;
                if (totalLength > MAX_SIZE) {
                    res.destroy();
                    return reject(new Error('Image exceeds 20MB limit.'));
                }
                chunks.push(chunk);
            });
            res.on('end', () => resolve(Buffer.concat(chunks)));
        });
        req.on('error', (err) => reject(new Error(`Network error: ${err.message}`)));
        req.setTimeout(10000, () => {
            req.destroy();
            reject(new Error('Request timed out after 10s'));
        });
    });
}
