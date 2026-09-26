"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PRESETS = void 0;
exports.getPreset = getPreset;
exports.PRESETS = {
    standard: ' .:-=+*#%@',
    dense: ' .,:;irsXA253hMHGS#9B&@',
    blocks: ' ░▒▓█',
    minimal: ' .oO@',
    dots: ' ·•●'
};
function getPreset(name) {
    if (name in exports.PRESETS) {
        return exports.PRESETS[name];
    }
    return exports.PRESETS.standard;
}
