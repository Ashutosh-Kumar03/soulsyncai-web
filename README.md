# SoulSyncAI — Premium Website

## 🗂 File Structure

```
soulsyncai/
├── index.html     ← All markup / page structure
├── style.css      ← All styling, animations, responsive design
├── script.js      ← Canvas starfield, cursor, interactions, counters
└── README.md      ← This file
```

---

## 🚀 How to Run

### Option 1 — Open directly in browser
Just double-click `index.html`. Everything is self-contained.
No build step. No npm. No server required.

> ⚠️ Google Fonts requires an internet connection for the first load.

### Option 2 — Local dev server (recommended)
```bash
# Python 3
python3 -m http.server 3000

# Node.js (npx)
npx serve .

# VS Code → install "Live Server" extension → right-click index.html → Open with Live Server
```
Then open `http://localhost:3000` in your browser.

---

## 📦 What's Included

| File | What it does |
|------|-------------|
| `index.html` | Full page structure — nav, hero, features, how-it-works, testimonials, pricing, CTA, footer |
| `style.css` | 800+ lines of premium CSS — cosmos color system, 3D orb rings, glass cards, all animations, responsive breakpoints |
| `script.js` | Canvas starfield (220+ stars, nebulae, shooting stars) · Custom 2-part cursor · Wave bars · Scroll reveal · Counter animation · 3D card tilt · Waitlist form logic · Smooth scroll |

---

## 🎨 Design System

### Colors
```css
--soul:   #8b5cf6   /* Primary violet */
--soul2:  #a78bfa   /* Mid violet */
--soul3:  #c4b5fd   /* Light violet / accent */
--nova:   #06b6d4   /* Cyan accent */
--rose:   #f472b6   /* Pink accent */
--amber:  #fbbf24   /* Gold / stars */
--void:   #04020f   /* Deep background */
```

### Fonts
- **Cormorant Garamond** — All headings (luxury serif)
- **Inter** — Body text (ultra-light weight)
- **Space Grotesk** — UI labels, buttons, tags

---

## ✏️ Customization Guide

### Change brand name
Search & replace `SoulSync` and `SoulSyncAI` in `index.html`

### Change hero tagline
Edit lines inside `.hero-content` in `index.html`

### Change colors
Edit the `:root` variables at the top of `style.css`

### Change pricing
Find the `.pricing-grid` section in `index.html`

### Connect waitlist form
In `script.js`, find `initWaitlist()` and add your API call:
```js
// Replace the success state block with:
await fetch('https://your-api.com/waitlist', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email })
});
```

### Add your logo
Replace the text logo in `<div class="logo">` with an `<img>` tag

---

## 📱 Responsive Breakpoints

| Breakpoint | Layout change |
|-----------|--------------|
| < 1024px | Features → 2 col, pricing → 1 col stacked, deep section → 1 col |
| < 768px  | Nav links hidden, features → 1 col, timeline → 2 col, orb shrinks |

---

## 🌐 Deployment

### Vercel (recommended — free)
```bash
npx vercel
```

### Netlify
Drag the `soulsyncai/` folder to [app.netlify.com/drop](https://app.netlify.com/drop)

### GitHub Pages
Push to GitHub → Settings → Pages → Deploy from main branch

---

Built with ❤️ for SoulSyncAI