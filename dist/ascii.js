"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderAscii = renderAscii;
function renderAscii(data, width, height, options) {
    let charArray = Array.from(options.chars);
    if (charArray.length < 2) {
        throw new Error('Character palette must contain at least 2 characters.');
    }
    if (options.invert) {
        charArray = charArray.reverse();
    }
    const c = options.channels;
    const useBlocks = options.style === 'blocks' && options.color;
    let output = '';
    if (useBlocks) {
        // For blocks, every character is 2 vertical pixels: Top=Foreground, Bottom=Background
        // We expect the image height to be exactly the number of vertical pixels.
        // The width is the number of characters per line.
        for (let y = 0; y < height; y += 2) {
            for (let x = 0; x < width; x++) {
                const topIdx = (y * width + x) * c;
                const bottomIdx = ((y + 1) * width + x) * c;
                const topR = data[topIdx];
                const topG = data[topIdx + 1];
                const topB = data[topIdx + 2];
                let bottomR = 0, bottomG = 0, bottomB = 0;
                if (y + 1 < height) {
                    bottomR = data[bottomIdx];
                    bottomG = data[bottomIdx + 1];
                    bottomB = data[bottomIdx + 2];
                }
                else {
                    bottomR = topR;
                    bottomG = topG;
                    bottomB = topB;
                }
                output += `\x1b[38;2;${topR};${topG};${topB}m\x1b[48;2;${bottomR};${bottomG};${bottomB}m▀\x1b[0m`;
            }
            output += '\n';
        }
    }
    else {
        // Standard ASCII (colored or monochrome)
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const idx = (y * width + x) * c;
                const r = data[idx];
                const g = data[idx + 1];
                const b = data[idx + 2];
                // Luminance calculation (standard perceptual weights)
                const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
                const normalized = luminance / 255;
                let charIdx = Math.floor((1 - normalized) * charArray.length);
                if (charIdx >= charArray.length)
                    charIdx = charArray.length - 1;
                if (charIdx < 0)
                    charIdx = 0;
                const char = charArray[charIdx];
                if (options.color) {
                    output += `\x1b[38;2;${r};${g};${b}m${char}\x1b[0m`;
                }
                else {
                    output += char;
                }
            }
            output += '\n';
        }
    }
    return output;
}
