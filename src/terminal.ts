export interface TerminalInfo {
  width: number;
  height: number;
  isTTY: boolean;
}

export function getTerminalInfo(): TerminalInfo {
  const isTTY = process.stdout.isTTY || false;
  // Fallback to 80x24 if size cannot be determined
  const width = process.stdout.columns || 80;
  const height = process.stdout.rows || 24;

  return { width, height, isTTY };
}
