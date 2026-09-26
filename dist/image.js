"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processImage = processImage;
const sharp_1 = __importDefault(require("sharp"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const utils_1 = require("./utils");
async function processImage(source, options) {
    let buffer;
    if (source.startsWith('http://') || source.startsWith('https://')) {
        buffer = await (0, utils_1.fetchImageBuffer)(source);
    }
    else {
        const absPath = path_1.default.resolve(source);
        if (fs_1.default.existsSync(absPath)) {
            buffer = await fs_1.default.promises.readFile(absPath);
        }
        else {
            throw new Error(`File not found: ${source}`);
        }
    }
    let image = (0, sharp_1.default)(buffer).rotate();
    const metadata = await image.metadata();
    if (!metadata.width || !metadata.height) {
        throw new Error('Unable to determine image dimensions.');
    }
    let targetWidth = options.width;
    let targetHeight = options.height;
    // Let the caller decide the aspect ratio correction, but by default it's 0.5
    // Wait, we can let ascii.ts handle the half-block logic if needed.
    if (!targetHeight) {
        const CHAR_ASPECT_RATIO = options.color && options.style === 'blocks' ? 1.0 : 0.5;
        const originalAspect = metadata.height / metadata.width;
        targetHeight = Math.round(targetWidth * originalAspect * CHAR_ASPECT_RATIO);
    }
    targetWidth = Math.max(1, targetWidth);
    targetHeight = Math.max(1, targetHeight);
    let linearA = 1;
    let linearB = 0;
    if (options.contrast !== undefined) {
        linearA = options.contrast;
        linearB = 128 * (1 - linearA);
    }
    if (options.brightness !== undefined) {
        linearA *= options.brightness;
    }
    if (linearA !== 1 || linearB !== 0) {
        image = image.linear(linearA, linearB);
    }
    // We want to return RGB, so we remove .grayscale() and use .removeAlpha() to guarantee 3 channels.
    const { data, info } = await image
        .resize(targetWidth, targetHeight, { fit: 'fill' })
        .removeAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });
    return { data, width: info.width, height: info.height, channels: info.channels };
}
