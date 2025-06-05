#!/bin/bash

# This script converts SVG files to PNG format for better browser compatibility
# Requires Inkscape to be installed (brew install inkscape)

# Convert favicon.svg to png at different sizes
inkscape -w 16 -h 16 favicon.svg -o favicon-16x16.png
inkscape -w 32 -h 32 favicon.svg -o favicon-32x32.png
inkscape -w 48 -h 48 favicon.svg -o favicon-48x48.png
inkscape -w 64 -h 64 favicon.svg -o favicon.png
inkscape -w 192 -h 192 favicon.svg -o android-chrome-192x192.png

# Convert logo.svg to png at different sizes
inkscape -w 200 -h 200 logo.svg -o logo-200x200.png
inkscape -w 512 -h 512 logo.svg -o logo-512x512.png

# Create Apple touch icon (requires resizing and adding padding)
inkscape -w 180 -h 180 logo.svg -o apple-touch-icon.png

echo "PNG versions of SVG files have been generated" 
 
 
 
 
 
 
 
 
 