# Contributing to OmniTools

Thanks for helping make OmniTools better! 🎉

## Adding a New Tool

### Step 1 — Add tool metadata (`js/tools-data.js`)

```js
{ 
  id: 'my-tool',           // unique kebab-case ID
  icon: '🔧',              // emoji icon
  name: 'My Tool',         // display name
  desc: 'Does something',  // short description (1 line)
  cat: 'Utility Tools',    // category name (must match existing)
  catSlug: 'utility',      // category slug
  badge: null              // null | 'new' | 'hot' | 'ai'
}
```

### Step 2 — Add tool HTML (`js/app.js` → `renderTool()`)

Add a case to the `tools` object:

```js
'my-tool': `
  <div class="tool-section">
    <label class="tool-label">Input</label>
    <input type="text" class="tool-input" id="myInput" placeholder="Enter value...">
  </div>
  <button class="btn btn-primary" onclick="runMyTool()">🔧 Run</button>
  <div class="tool-section">
    <label class="tool-label">Output</label>
    <div class="output-box" id="myOutput">Result here...</div>
    <div class="output-actions">
      <button class="btn btn-secondary" onclick="copyText(document.getElementById('myOutput').textContent)">📋 Copy</button>
    </div>
  </div>`,
```

### Step 3 — Add tool logic

```js
function runMyTool() {
  const input = document.getElementById('myInput').value;
  const result = /* your logic */;
  document.getElementById('myOutput').textContent = result;
  toast('Done!');
}
```

### Step 4 — Init if needed (`initTool()` switch)

```js
case 'my-tool': runMyTool(); break;
```

## Available UI Classes

| Class | Purpose |
|---|---|
| `tool-section` | Wrapper with margin |
| `tool-label` | Small uppercase label |
| `tool-input` | Single-line input |
| `tool-textarea` | Multi-line textarea |
| `tool-select` | Dropdown select |
| `tool-row` | Flex row for inline inputs |
| `output-box` | Styled output display |
| `output-actions` | Button row after output |
| `btn btn-primary` | Purple gradient button |
| `btn btn-secondary` | Ghost button |
| `btn btn-green` | Green ghost button |

## Helper Functions

- `toast(message, type)` — Show notification (`'success'` or `'error'`)
- `copyText(text)` — Copy to clipboard with toast

## PR Guidelines

- Keep tool logic self-contained (no dependencies)
- Test on mobile (responsive)
- No external API calls unless clearly noted
- Follow existing code style
