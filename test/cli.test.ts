import test from 'node:test';
import assert from 'node:assert';
import { spawnSync } from 'child_process';
import path from 'path';
import fs from 'fs';

test('CLI runs with no arguments (default photo)', () => {
  const cliPath = path.join(__dirname, '..', 'dist', 'index.js');
  
  if (!fs.existsSync(cliPath)) {
    console.log('Skipping CLI test because dist/index.js is not built');
    return;
  }

  const result = spawnSync(process.execPath, [cliPath, '--width', '20'], { encoding: 'utf-8' });
  assert.strictEqual(result.status, 0);
  assert.ok(result.stdout.length > 0);
});
