import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fetchImageBuffer } from './utils';

export interface ImageProcessOptions {
  width: number;
  height?: number;
  brightness?: number;
  contrast?: number;
  color?: boolean;
  style?: string;
}

export async function processImage(source: string, options: ImageProcessOptions): Promise<{ data: Buffer; width: number; height: number; channels: number }> {
  let buffer: Buffer;

  if (source.startsWith('http://') || source.startsWith('https://')) {
    buffer = await fetchImageBuffer(source);
  } else {
    const absPath = path.resolve(source);
    if (fs.existsSync(absPath)) {
      buffer = await fs.promises.readFile(absPath);
    } else {
      throw new Error(`File not found: ${source}`);
    }
  }

  let image = sharp(buffer).rotate();
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
