# Icon Generation Instructions

## Option 1: Use the HTML Generator
Open `generate-icons.html` in a browser to automatically generate all icon sizes and the OG image.

## Option 2: Use Online Tools
Visit https://realfavicongenerator.net/ and upload the `favicon.svg` file to generate all formats.

## Option 3: Manual with ImageMagick
If you have ImageMagick installed:

```bash
# Generate PNG icons from SVG
magick favicon.svg -resize 16x16 favicon-16.png
magick favicon.svg -resize 32x32 favicon-32.png
magick favicon.svg -resize 72x72 icon-72.png
magick favicon.svg -resize 96x96 icon-96.png
magick favicon.svg -resize 128x128 icon-128.png
magick favicon.svg -resize 144x144 icon-144.png
magick favicon.svg -resize 152x152 icon-152.png
magick favicon.svg -resize 180x180 apple-touch-icon.png
magick favicon.svg -resize 192x192 icon-192.png
magick favicon.svg -resize 384x384 icon-384.png
magick favicon.svg -resize 512x512 icon-512.png

# Generate ICO file
magick favicon-16.png favicon-32.png favicon.ico
```

## Design Elements
- Background: #1a2928 (dark teal)
- Star/Text: #D4A850 (gold)
- Features: 8-point star at top, "25" text at bottom
- Clean, minimal design
