# BRO PHOTO

A terminal CLI that transforms photographs into ASCII art.

## Basic Usage

```bash
npx bro-photo
```

This will run the CLI and process the bundled default image.

## Custom Image

Process a local image file:

```bash
bro-photo ./photo.jpg
```

Process a remote image URL:

```bash
bro-photo https://example.com/photo.jpg
```

## Options & Styles

**Styles:** Choose from several predefined character palettes.

```bash
bro-photo --style dense
bro-photo --style blocks
bro-photo --style dots
```

**Custom characters:** Provide your own palette from lightest to darkest.

```bash
bro-photo --chars " .:-=+*#@"
```

**Dimensions:** Control the output width (height is automatically calculated to preserve aspect ratio).

```bash
bro-photo --width 100
```

**Adjustments:** Modify brightness, contrast, or invert the image.

```bash
bro-photo --invert
bro-photo --brightness 1.2
bro-photo --contrast 1.5
```

## Development

```bash
npm install
npm run build
npm test
```

## Testing & Publishing

To publish this package to npm:

1. `npm run typecheck`
2. `npm run build`
3. `npm test`
4. `npm pack` (verify package contents)
5. `npm login`
6. `npm publish`

## Terminal Limitations
- The output looks best on modern terminals with standard fonts.
- Very small widths may lose recognizable shapes.
- Very large widths might wrap in some terminal emulators. The tool attempts to auto-detect width and add margins.
