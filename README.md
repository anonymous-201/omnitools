# ⚡ OmniTools

> 100+ free, open-source online tools — no signup, no watermarks, no limits.

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![GitHub Stars](https://img.shields.io/github/stars/omnitools/omnitools)](https://github.com/omnitools/omnitools)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

**Live demo:** https://anonymous-201.github.io/omnitools

---

## ✨ Features

- 🛠️ **41+ working tools** across 7 categories
- 🤖 **AI-powered tools** (summarizer, email writer, hashtag generator)
- 🎨 **Stunning dark UI** with glassmorphism & animations
- 📱 **PWA-ready** — installable on mobile
- 🔍 **Instant search** across all tools
- 💾 **Local storage** for notes & todos (no server needed)
- 🌐 **100% static** — host anywhere for free

## 🗂️ Tool Categories

| Category | Tools |
|---|---|
| 📄 PDF Tools | Merge, Split, Compress, Image→PDF, Lock, Unlock |
| 🖼️ Image Tools | QR Code, Color Picker, Gradient Generator, Meme, Compressor |
| 🤖 AI Tools | Text Summarizer, Email Writer, Hashtag Generator, Caption |
| 💻 Developer | JSON Formatter, Base64, UUID, Regex Tester, HTML Preview, Markdown |
| 🎓 Student | Notes App, Typing Test, GPA Calc, Unit Converter, Scientific Calc |
| 💰 Finance | EMI Calculator, Currency Converter, Tip Calculator, Profit Calc |
| 🛠️ Utility | Password Generator, Pomodoro, To-Do, Word Counter, Stopwatch, Countdown |

## 🚀 Deploy to GitHub Pages (Free Static Hosting)

1. **Fork this repo** on GitHub
2. Go to **Settings → Pages**
3. Set source to **"Deploy from a branch"** → `main` → `/ (root)`
4. Your site is live at `https://anonymous-201.github.io/omnitools`

### One-liner deploy with gh-pages

```bash
# Install gh-pages (optional, for manual deploy)
npm install -g gh-pages

# Deploy
gh-pages -d . --nojekyll
```

## 🛠️ Local Development

No build step required! Just open the files:

```bash
git clone https://github.com/omnitools/omnitools.git
cd omnitools

# Option 1: Python
python -m http.server 8080

# Option 2: Node.js
npx serve .

# Option 3: VS Code Live Server extension
# Right-click index.html → Open with Live Server
```

Visit `http://localhost:8080`

## 📁 Project Structure

```
omnitools/
├── index.html          # Main single-page app
├── 404.html            # GitHub Pages 404 redirect
├── manifest.json       # PWA manifest
├── robots.txt          # SEO robots
├── sitemap.xml         # SEO sitemap
├── css/
│   └── style.css       # All styles (dark futuristic theme)
├── js/
│   ├── tools-data.js   # Tool definitions & metadata
│   └── app.js          # All tool logic & UI
└── assets/             # Icons, images
```

## 🤝 Contributing

We welcome PRs! To add a new tool:

1. Add tool metadata to `js/tools-data.js`
2. Add tool HTML template in `renderTool()` in `js/app.js`  
3. Add tool logic function(s) in `js/app.js`
4. Call `initTool()` if needed for setup

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guide.

## 🔑 AI Tools Setup (Optional)

AI tools use the Anthropic Claude API. To enable them:

1. Get an API key from [console.anthropic.com](https://console.anthropic.com)
2. The tools call the API directly from the browser

> **Note:** For production, proxy API calls through a backend to protect your key.

## 📋 Roadmap

- [ ] More PDF tools (via PDF.js + pdf-lib)
- [ ] Image compression (via browser Canvas API)  
- [ ] Background removal (via AI model)
- [ ] More currency pairs with live rates
- [ ] Dark/light mode toggle
- [ ] Keyboard shortcuts
- [ ] Tool favorites (localStorage)
- [ ] Export data from tools

## 📄 License

MIT License — free to use, modify, and distribute.

---

⭐ **Star this repo** if you find it useful!

