# Portal Selection Page Setup

## Overview

The portal page is the entry point that allows users to choose between:
1. **Games E-Web** - The gaming services frontend (React app)
2. **Cyber S-Web** - The cyber services frontend (coming soon)

## Features

✅ **Animated Background** - Gaming pad image with pan/zoom animation  
✅ **Glassmorphism Design** - Frosted glass effect for modern look  
✅ **Two Portal Options** - Games (Purple) and Cyber (Cyan)  
✅ **Responsive Design** - Works on all screen sizes  
✅ **Smooth Animations** - Hover effects and transitions  

## Routing

- **`/`** - Portal selection page (default entry point)
- **`/login`** - Games E-Web login page
- **`/dashboard`** - Games E-Web dashboard (protected)

## Customization

### Background Image

The portal uses the same background image as the login page:
- Path: `public/assets/images/login-background.jpg`
- Falls back to gradient if image doesn't exist
- Animated with pan/zoom effect

### Cyber Frontend Integration

When the Cyber S-Web frontend is ready, update `Portal.tsx`:

```typescript
const handleCyberClick = () => {
  // Option 1: Navigate to different port/URL
  window.location.href = 'http://localhost:3001'; // Cyber frontend URL
  
  // Option 2: Use React Router if both are in same app
  // navigate('/cyber/login');
};
```

### Colors

- **Games Portal**: Purple (#bd00ff)
- **Cyber Portal**: Cyan (#00fff2)

Edit `Portal.styles.ts` to change colors.

## Font

Uses **Rajdhani** font (loaded from Google Fonts) for a tech/gaming aesthetic.

## Testing

1. Start dev server: `npm run dev`
2. Navigate to `http://localhost:3000`
3. You should see the portal selection page
4. Click "Games E-WEB" to go to login
5. Click "Cyber S-WEB" to see placeholder (update when ready)

## Next Steps

1. **Add Cyber Frontend** - Create the cyber services frontend
2. **Update Cyber Link** - Point to actual cyber frontend URL
3. **Customize Background** - Add your gaming pad image
4. **Add Icons** - Custom icons for each portal option
