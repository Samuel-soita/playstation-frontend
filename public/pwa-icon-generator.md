# PWA Icon Generator Guide

## Required Icons

For the PWA to work properly, you need to create the following icons:

### 1. PWA Icons (Required)
- `pwa-192x192.png` - 192x192 pixels
- `pwa-512x512.png` - 512x512 pixels

### 2. Apple Touch Icon (iOS)
- `apple-touch-icon.png` - 180x180 pixels

### 3. Favicon
- `favicon.ico` - 32x32 or 16x16 pixels
- `masked-icon.svg` - SVG icon for maskable icons

## Quick Generation

You can use online tools to generate these icons:

1. **PWA Asset Generator**: https://www.pwabuilder.com/imageGenerator
2. **RealFaviconGenerator**: https://realfavicongenerator.net/
3. **Favicon.io**: https://favicon.io/

## Design Guidelines

- Use your gaming pads or PlayStation theme
- Ensure icons are clear and recognizable at small sizes
- Use solid backgrounds or gradients matching your theme (#667eea to #764ba2)
- For maskable icons, ensure important content is within the safe zone (80% of the icon)

## Icon Placement

Place all generated icons in the `public/` folder:
```
public/
├── pwa-192x192.png
├── pwa-512x512.png
├── apple-touch-icon.png
├── favicon.ico
└── masked-icon.svg
```

## Testing

After adding icons:
1. Build the app: `npm run build`
2. Preview: `npm run preview`
3. Test installation on mobile device
4. Check icons appear correctly in browser tabs and home screen
