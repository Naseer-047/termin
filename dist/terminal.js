"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTerminalInfo = getTerminalInfo;
function getTerminalInfo() {
    const isTTY = process.stdout.isTTY || false;
    // Fallback to 80x24 if size cannot be determined
    const width = process.stdout.columns || 80;
    const height = process.stdout.rows || 24;
    return { width, height, isTTY };
}
