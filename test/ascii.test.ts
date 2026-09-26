import test from 'node:test';
import assert from 'node:assert';
import { renderAscii } from '../src/ascii';
import { getPreset } from '../src/presets';

test('renderAscii maps 255 to lightest and 0 to darkest (grayscale calculation)', () => {
  // RGB format: 3 pixels
  const data = Buffer.from([
    255, 255, 255, // white -> luminance 255
    128, 128, 128, // gray  -> luminance ~128
    0, 0, 0,       // black -> luminance 0
    0, 0, 0,       // black
    255, 255, 255, // white
    128, 128, 128  // gray
  ]);
  
  const ascii = renderAscii(data, 3, 2, { chars: 'LMD', invert: false, color: false, channels: 3 });
  
  const lines = ascii.trim().split('\n');
  assert.strictEqual(lines.length, 2);
  
  assert.strictEqual(lines[0], 'LMD');
  assert.strictEqual(lines[1], 'DLM');
});

test('renderAscii invert works correctly', () => {
  const data = Buffer.from([
    255, 255, 255,
    0, 0, 0
  ]);
  
  const ascii = renderAscii(data, 2, 1, { chars: 'LMD', invert: true, color: false, channels: 3 });
  const lines = ascii.trim().split('\n');
  
  assert.strictEqual(lines[0], 'DL');
});

test('Presets are correctly formatted', () => {
  assert.ok(getPreset('standard').length >= 2);
  assert.ok(getPreset('dense').length >= 2);
  assert.strictEqual(getPreset('invalid'), getPreset('standard'));
});
