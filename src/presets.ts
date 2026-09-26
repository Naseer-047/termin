export type PresetName = 'standard' | 'dense' | 'blocks' | 'minimal' | 'dots';

export const PRESETS: Record<PresetName, string> = {
  standard: ' .:-=+*#%@',
  dense: ' .,:;irsXA253hMHGS#9B&@',
  blocks: ' ░▒▓█',
  minimal: ' .oO@',
  dots: ' ·•●'
};

export function getPreset(name: string): string {
  if (name in PRESETS) {
    return PRESETS[name as PresetName];
  }
  return PRESETS.standard;
}
