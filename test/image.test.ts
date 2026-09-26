import test from 'node:test';
import assert from 'node:assert';
import { processImage } from '../src/image';
import path from 'path';
import fs from 'fs';

// To avoid network requests in unit tests, we'll create a dummy image using Sharp if we can,
// or just skip tests that require real files if none exist.
// Since we have the downloaded asset, we can use it!

const assetPath = path.join(__dirname, '..', 'assets', 'default-photo.jpg');

test('processImage parses a local file and resizes correctly', async () => {
  if (!fs.existsSync(assetPath)) {
    console.log('Skipping test because asset does not exist');
    return;
  }

  const { data, width, height, channels } = await processImage(assetPath, { width: 40 });
  
  assert.strictEqual(width, 40);
  assert.ok(height > 0);
  assert.strictEqual(channels, 3);
  assert.ok(data.length === width * height * channels);
});

test('processImage invalid file throws', async () => {
  await assert.rejects(
    () => processImage('nonexistent.jpg', { width: 40 }),
    /File not found: nonexistent.jpg/
  );
});
