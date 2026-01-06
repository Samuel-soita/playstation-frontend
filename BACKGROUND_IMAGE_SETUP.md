# Background Image Setup Guide

## How to Add Your Background Image

### Step 1: Place Your Image

1. Copy your background image file to:
   ```
   public/assets/images/login-background.jpg
   ```

2. **Supported formats:**
   - `.jpg` / `.jpeg`
   - `.png`
   - `.webp`

3. **Recommended specifications:**
   - **Size:** 1920x1080 (Full HD) or higher
   - **Aspect Ratio:** 16:9 or similar
   - **File Size:** Under 2MB for optimal loading
   - **Format:** JPG for photos, PNG for graphics with transparency

### Step 2: Update Image Path (if needed)

If your image has a different name or format, update the path in:
```
src/components/Login/Login.tsx
```

Change this line:
```typescript
const BACKGROUND_IMAGE_PATH = '/assets/images/login-background.jpg';
```

To match your image filename:
```typescript
const BACKGROUND_IMAGE_PATH = '/assets/images/your-image-name.png';
```

### Step 3: Customize Overlay (Optional)

The background image has a purple gradient overlay for better text readability. To adjust the overlay, edit:
```
src/components/Login/Login.styles.ts
```

In the `container` function, you can modify:
- **Overlay opacity:** Change `rgba(102, 126, 234, 0.85)` values (0.85 = 85% opacity)
- **Overlay colors:** Adjust the gradient colors
- **Blur effect:** Modify `backdropFilter` in the `paper` style

### Step 4: Test

1. Start the dev server:
   ```bash
   npm run dev
   ```

2. Navigate to the login page
3. Your background image should appear with the overlay

### Fallback Behavior

If the image doesn't exist or fails to load, the login page will automatically fall back to the beautiful purple gradient background. No errors will occur!

## Styling Features

The background image implementation includes:

✅ **Gradient Overlay** - Purple gradient overlay for text readability  
✅ **Glass Morphism** - Frosted glass effect on the login card  
✅ **Fixed Attachment** - Background stays fixed during scroll  
✅ **Responsive** - Works on all screen sizes  
✅ **Smooth Loading** - Graceful fallback if image doesn't load  
✅ **Performance** - Optimized background rendering  

## Example Image Paths

```
✅ Correct: /assets/images/login-background.jpg
✅ Correct: /assets/images/gaming-bg.png
✅ Correct: /assets/images/background.webp

❌ Wrong: /images/login-background.jpg (missing /assets/)
❌ Wrong: assets/images/login-background.jpg (missing leading /)
```

## Troubleshooting

**Image not showing?**
1. Check the file path is correct
2. Ensure the image is in `public/assets/images/`
3. Check browser console for 404 errors
4. Verify the image filename matches exactly (case-sensitive)

**Image too dark/bright?**
- Adjust the overlay opacity in `Login.styles.ts`
- Change the gradient colors to match your image

**Performance issues?**
- Compress your image (use tools like TinyPNG)
- Use WebP format for better compression
- Reduce image dimensions if too large
