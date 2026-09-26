import { Command } from 'commander';
import { getTerminalInfo } from './terminal';
import { getPreset } from './presets';
import { processImage } from './image';
import { renderAscii } from './ascii';
import path from 'path';
import fs from 'fs';

import readline from 'readline';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

function askQuestion(query: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  return new Promise(resolve => {
    rl.question(query, answer => {
      rl.close();
      resolve(answer);
    });
  });
}

async function runKavanaSequence(ascii: string) {
  const delay = 600;

  console.clear();
  console.log('\x1b[36m> Initializing visual system...\x1b[0m');
  await sleep(delay);
  console.log('\x1b[36m> Loading assets...\x1b[0m');
  await sleep(delay);
  console.log('\x1b[36m> Calibrating pixels...\x1b[0m');
  await sleep(delay);
  console.log('\x1b[36m> Mapping subject...\x1b[0m');
  await sleep(delay * 2);
  
  console.log();
  process.stdout.write('Loading secret file... ░░░░░░░░░░░░░░░░░░░░ 0%\r');
  await sleep(500);
  process.stdout.write('Loading secret file... ████████░░░░░░░░░░░░ 40%\r');
  await sleep(800);
  process.stdout.write('Loading secret file... ███████████████░░░░░ 78%\r');
  await sleep(1200);
  process.stdout.write('Loading secret file... ████████████████████ 100%\n');
  await sleep(1000);

  console.log();
  console.log('\x1b[33mWARNING 🚨\x1b[0m');
  console.log('Highly recognizable human detected.');
  console.log();
  console.log('Would you like to continue?');
  console.log('[Y] Yes');
  console.log('[N] Obviously yes');
  console.log();

  await askQuestion('> ');

  console.log();
  console.log('Proceeding anyway... 😂');
  await sleep(1500);

  console.clear();
  console.log('\x1b[35mANALYSIS COMPLETE\x1b[0m');
  console.log();
  await sleep(800);
  console.log('POETRY ADDICTION : DETECTED');
  await sleep(800);
  console.log('BUSY STATUS      : ALWAYS');
  await sleep(800);
  console.log('INITIATION       : Apparently not supported for Naseer ');
  await sleep(1500);
  console.log('ATTITUDE         : ███████████ 99%');
  await sleep(3000);

  console.log();
  console.log('Preparing visual output...');
  console.log();
  await sleep(1000);
  console.log('3...');
  await sleep(1000);
  console.log('2...');
  await sleep(1000);
  console.log('1...');
  await sleep(1000);

  console.clear();
  
  console.log('\x1b[32mRendering subject...\x1b[0m');
  await sleep(500);
  console.log('░░░░░░░░░░░');
  await sleep(300);
  console.log('▒▒▒▒▒▒▒▒▒▒▒');
  await sleep(300);
  console.log('▓▓▓▓▓▓▓▓▓▓▓');
  await sleep(300);
  console.log('████████████');
  await sleep(600);
  console.clear();

  const lines = ascii.split('\n');
  for (const line of lines) {
    console.log(line);
    await sleep(20);
  }

  console.log();
  console.log('\x1b[1m\x1b[36mSUBJECT IDENTIFIED:\x1b[0m');
  console.log('\x1b[1m\x1b[32mKAVANA 🍃\x1b[0m');
  
  await sleep(1500);

  console.log();
  console.log('\x1b[31mPOETRY RECOMMENDATION LEVEL: DANGEROUS 🎧\x1b[0m');

  await sleep(2000);
  console.log();
  console.log("> That's it 😂");
  await sleep(1500);
  console.log("> You can stop staring at yourself now.");
  await sleep(1500);
  console.log();
  console.log('Process exited successfully.');
}

export async function run() {
  const packageJsonPath = path.join(__dirname, '..', 'package.json');
  let version = '1.0.0';
  if (fs.existsSync(packageJsonPath)) {
    const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    version = pkg.version;
  }

  const program = new Command();

  program
    .name('bro-photo')
    .description('Turn photos into ASCII art directly in your terminal.')
    .version(version)
    .argument('[source]', 'local image path or image URL')
    .option('--width <number>', 'output width')
    .option('--height <number>', 'output height')
    .option('--style <style>', 'ASCII style (standard, dense, blocks, minimal, dots, edges, auto)')
    .option('--chars <characters>', 'custom character palette')
    .option('--brightness <number>', 'brightness adjustment (multiplier, e.g. 1.2)')
    .option('--contrast <number>', 'contrast adjustment (multiplier, e.g. 1.5)')
    .option('--invert', 'invert grayscale')
    .option('--no-color', 'disable color output')
    .option('--no-animate', 'disable drawing animation')
    .option('--mode <mode>', 'special execution modes')
    .option('--debug', 'show diagnostic information');

  program.parse();

  const options = program.opts();
  
  let source: string | undefined = program.args[0];
  let isKavanaMode = false;
  
  if (source === 'kavana') {
    isKavanaMode = true;
    source = undefined;
  } else if (options.mode === 'personal') {
    isKavanaMode = true;
  }
  
  const isDefault = !source;
  
  if (isDefault) {
    source = path.join(__dirname, '..', 'assets', 'kav.png');
  }

  try {
    const termInfo = getTerminalInfo();
    
    let width = 80;
    if (options.width) {
      width = parseInt(options.width, 10);
      if (isNaN(width) || width <= 0) throw new Error('Invalid width');
    } else if (isDefault && !isKavanaMode) {
      width = 80;
    } else if (termInfo.width) {
      width = Math.max(10, termInfo.width - 2); 
    }
    
    let height: number | undefined = undefined;
    if (options.height) {
      height = parseInt(options.height, 10);
      if (isNaN(height) || height <= 0) throw new Error('Invalid height');
    }
    
    const brightness = options.brightness ? parseFloat(options.brightness) : undefined;
    const contrast = options.contrast ? parseFloat(options.contrast) : undefined;
    
    const color = options.color !== false;
    const style = options.style || (isKavanaMode ? 'blocks' : 'auto');
    
    if (options.debug) {
      console.log('[DEBUG] Terminal Info:', termInfo);
      console.log('[DEBUG] Source:', source);
      console.log('[DEBUG] Target Width:', width);
      console.log('[DEBUG] Target Height:', height);
      console.log('[DEBUG] Color:', color);
      console.log('[DEBUG] Options:', options);
    }
    
    const maxTerminalLines = termInfo.height ? Math.max(10, termInfo.height - 4) : 40;

    const { data, width: actualWidth, height: actualHeight, channels } = await processImage(source!, {
      width,
      height,
      brightness,
      contrast,
      color,
      style,
      maxTerminalLines
    });

    if (options.debug) {
      console.log(`[DEBUG] Processed Image: ${actualWidth}x${actualHeight} (Channels: ${channels})`);
    }

    let chars = getPreset('standard');
    
    if (options.chars) {
      chars = options.chars;
    } else if (style) {
      if (style === 'auto' || style === 'edges') {
        chars = getPreset('standard');
      } else {
        chars = getPreset(style);
      }
    }

    // Default to true for standard default, but false for Kavana mode to make it look realistic
    const invert = options.invert !== undefined ? options.invert : (isKavanaMode ? false : isDefault);

    const ascii = renderAscii(data, actualWidth, actualHeight, {
      chars,
      invert,
      color,
      style,
      channels
    });

    if (isKavanaMode) {
      await runKavanaSequence(ascii);
      return;
    }

    const animate = options.animate !== false;

    console.log();
    if (animate) {
      const lines = ascii.split('\n');
      for (const line of lines) {
        console.log(line);
        await sleep(20);
      }
    } else {
      console.log(ascii);
    }
    console.log();
    
  } catch (err: any) {
    if (options.debug) {
      console.error(err);
    } else {
      console.error(`✖ ${err.message}`);
    }
    process.exit(1);
  }
}
