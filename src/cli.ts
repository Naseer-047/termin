import { Command } from 'commander';
import { getTerminalInfo } from './terminal';
import { getPreset } from './presets';
import { processImage } from './image';
import { renderAscii } from './ascii';
import path from 'path';
import fs from 'fs';

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
    .option('--debug', 'show diagnostic information');

  program.parse();

  const options = program.opts();
  
  let source = program.args[0];
  const isDefault = !source;
  
  if (isDefault) {
    source = path.join(__dirname, '..', 'assets', 'default-photo.jpg');
  }

  try {
    const termInfo = getTerminalInfo();
    
    let width = 80;
    if (options.width) {
      width = parseInt(options.width, 10);
      if (isNaN(width) || width <= 0) throw new Error('Invalid width');
    } else if (isDefault) {
      // User specifically requested default to be width 80
      width = 80;
    } else if (termInfo.width) {
      // Use the full width of the terminal (minus 2 for a safe margin to avoid line wrapping)
      width = Math.max(10, termInfo.width - 2); 
    }
    
    let height: number | undefined = undefined;
    if (options.height) {
      height = parseInt(options.height, 10);
      if (isNaN(height) || height <= 0) throw new Error('Invalid height');
    }
    
    const brightness = options.brightness ? parseFloat(options.brightness) : undefined;
    const contrast = options.contrast ? parseFloat(options.contrast) : undefined;
    
    // We default to color=true unless --no-color is specified
    const color = options.color !== false;
    // For style resolving
    const style = options.style || 'auto';
    
    if (options.debug) {
      console.log('[DEBUG] Terminal Info:', termInfo);
      console.log('[DEBUG] Source:', source);
      console.log('[DEBUG] Target Width:', width);
      console.log('[DEBUG] Target Height:', height);
      console.log('[DEBUG] Color:', color);
      console.log('[DEBUG] Options:', options);
    }
    
    const maxTerminalLines = termInfo.height ? Math.max(10, termInfo.height - 4) : 40;

    const { data, width: actualWidth, height: actualHeight, channels } = await processImage(source, {
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

    const invert = options.invert !== undefined ? options.invert : isDefault;

    const ascii = renderAscii(data, actualWidth, actualHeight, {
      chars,
      invert,
      color,
      style,
      channels
    });

    const animate = options.animate !== false;

    console.log();
    if (animate) {
      const lines = ascii.split('\n');
      for (const line of lines) {
        console.log(line);
        await new Promise(resolve => setTimeout(resolve, 20)); // 20ms delay per line
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
