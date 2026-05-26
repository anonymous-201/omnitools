// ── Toast ──────────────────────────────────────────────────────────────────
function toast(msg, type = 'success') {
  const c = document.getElementById('toastContainer');
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.textContent = msg;
  c.appendChild(t);
  setTimeout(() => t.remove(), 3000);
}

// ── Copy to clipboard ──────────────────────────────────────────────────────
function copyText(text) {
  navigator.clipboard.writeText(text).then(() => toast('Copied to clipboard!'));
}

// ── Modal system ───────────────────────────────────────────────────────────
let currentTool = null;

function openTool(toolId) {
  const tool = TOOLS.find(t => t.id === toolId);
  if (!tool) return;
  currentTool = tool;

  document.getElementById('modalIcon').textContent = tool.icon;
  document.getElementById('modalTitle').textContent = tool.name;
  document.getElementById('modalSubtitle').textContent = tool.desc;

  const body = document.getElementById('modalBody');
  body.innerHTML = renderTool(toolId);

  document.getElementById('modalOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';

  // Init tool logic
  setTimeout(() => initTool(toolId), 50);
}

function closeTool() {
  document.getElementById('modalOverlay').classList.remove('open');
  document.body.style.overflow = '';
  currentTool = null;
}

// ── Render tool HTML ──────────────────────────────────────────────────────
function renderTool(id) {
  const tools = {
    'password-gen': `
      <div class="tool-section">
        <label class="tool-label">Password Length</label>
        <input type="range" id="pwLen" min="8" max="64" value="16" oninput="document.getElementById('pwLenVal').textContent=this.value">
        <div style="color:var(--text2);font-size:0.8rem;margin-top:4px">Length: <span id="pwLenVal">16</span> chars</div>
      </div>
      <div class="tool-section">
        <label class="tool-label">Options</label>
        <div style="display:flex;gap:16px;flex-wrap:wrap">
          <label style="display:flex;align-items:center;gap:6px;font-size:0.875rem;cursor:pointer"><input type="checkbox" id="pwUpper" checked> Uppercase (A-Z)</label>
          <label style="display:flex;align-items:center;gap:6px;font-size:0.875rem;cursor:pointer"><input type="checkbox" id="pwLower" checked> Lowercase (a-z)</label>
          <label style="display:flex;align-items:center;gap:6px;font-size:0.875rem;cursor:pointer"><input type="checkbox" id="pwNum" checked> Numbers (0-9)</label>
          <label style="display:flex;align-items:center;gap:6px;font-size:0.875rem;cursor:pointer"><input type="checkbox" id="pwSym" checked> Symbols (!@#$)</label>
        </div>
      </div>
      <button class="btn btn-primary" onclick="generatePassword()">🔐 Generate Password</button>
      <div class="tool-section" style="margin-top:16px">
        <label class="tool-label">Generated Password</label>
        <div class="output-box" id="pwOutput" style="font-size:1.1rem;letter-spacing:0.05em">Click generate...</div>
        <div class="output-actions">
          <button class="btn btn-secondary" onclick="copyText(document.getElementById('pwOutput').textContent)">📋 Copy</button>
          <button class="btn btn-secondary" onclick="generatePassword()">🔄 Regenerate</button>
        </div>
      </div>`,

    'json-format': `
      <div class="tool-section">
        <label class="tool-label">Input JSON</label>
        <textarea class="tool-textarea" id="jsonInput" style="min-height:160px" placeholder='{"name":"OmniTools","version":"1.0"}'></textarea>
      </div>
      <div class="tool-row" style="margin-bottom:16px">
        <button class="btn btn-primary" onclick="formatJSON()">✨ Format JSON</button>
        <button class="btn btn-secondary" onclick="minifyJSON()">🗜️ Minify</button>
        <button class="btn btn-secondary" onclick="validateJSON()">✅ Validate</button>
      </div>
      <div class="tool-section">
        <label class="tool-label">Output</label>
        <textarea class="tool-textarea" id="jsonOutput" style="min-height:160px" readonly></textarea>
        <div class="output-actions">
          <button class="btn btn-secondary" onclick="copyText(document.getElementById('jsonOutput').value)">📋 Copy</button>
          <button class="btn btn-secondary" onclick="document.getElementById('jsonInput').value='';document.getElementById('jsonOutput').value=''">🗑️ Clear</button>
        </div>
      </div>`,

    'base64': `
      <div class="tool-section">
        <label class="tool-label">Text Input</label>
        <textarea class="tool-textarea" id="b64Input" placeholder="Enter text to encode or Base64 to decode..."></textarea>
      </div>
      <div class="tool-row" style="margin-bottom:16px">
        <button class="btn btn-primary" onclick="encodeBase64()">🔒 Encode</button>
        <button class="btn btn-secondary" onclick="decodeBase64()">🔓 Decode</button>
      </div>
      <div class="tool-section">
        <label class="tool-label">Output</label>
        <div class="output-box" id="b64Output">Output will appear here...</div>
        <div class="output-actions">
          <button class="btn btn-secondary" onclick="copyText(document.getElementById('b64Output').textContent)">📋 Copy</button>
        </div>
      </div>`,

    'qr-gen': `
      <div class="tool-section">
        <label class="tool-label">Content</label>
        <input type="text" class="tool-input" id="qrInput" placeholder="https://omnitools.dev or any text..." value="https://omnitools.dev">
      </div>
      <div class="tool-row" style="margin-bottom:16px">
        <div>
          <label class="tool-label">Foreground</label>
          <input type="color" id="qrFg" value="#7c6cfc">
        </div>
        <div>
          <label class="tool-label">Background</label>
          <input type="color" id="qrBg" value="#050508">
        </div>
        <div>
          <label class="tool-label">Size</label>
          <select class="tool-select" id="qrSize">
            <option value="200">200×200</option>
            <option value="300" selected>300×300</option>
            <option value="400">400×400</option>
          </select>
        </div>
      </div>
      <button class="btn btn-primary" onclick="generateQR()" style="margin-bottom:16px">📱 Generate QR</button>
      <div style="text-align:center" id="qrOutput"></div>`,

    'color-picker': `
      <div class="tool-section">
        <div class="color-preview" id="colorPreview" style="background:#7c6cfc"></div>
        <div class="tool-row">
          <div>
            <label class="tool-label">Pick Color</label>
            <input type="color" id="colorInput" value="#7c6cfc" style="width:100%;height:44px" oninput="updateColor(this.value)">
          </div>
          <div style="flex:3">
            <label class="tool-label">Hex Code</label>
            <input type="text" class="tool-input" id="colorHex" value="#7c6cfc" oninput="updateColor(this.value)" placeholder="#ff0000">
          </div>
        </div>
      </div>
      <div class="tool-section">
        <label class="tool-label">Color Values</label>
        <div class="output-box" id="colorOutput">HEX: #7c6cfc<br>RGB: rgb(124, 108, 252)<br>HSL: hsl(244, 96%, 71%)</div>
        <div class="output-actions">
          <button class="btn btn-secondary" onclick="copyText(document.getElementById('colorHex').value)">📋 Copy HEX</button>
          <button class="btn btn-secondary" onclick="copyText(document.getElementById('colorOutput').textContent)">📋 Copy All</button>
        </div>
      </div>
      <div class="tool-section">
        <label class="tool-label">Color Shades</label>
        <div id="colorShades" style="display:flex;gap:6px;border-radius:8px;overflow:hidden"></div>
      </div>`,

    'gradient-gen': `
      <div class="tool-section">
        <div id="gradientPreview" style="width:100%;height:80px;border-radius:var(--radius-sm);border:1px solid var(--border);background:linear-gradient(135deg,#7c6cfc,#a855f7);margin-bottom:12px;transition:background 0.3s"></div>
        <div class="tool-row">
          <div><label class="tool-label">Color 1</label><input type="color" id="gColor1" value="#7c6cfc" style="width:100%;height:44px" oninput="updateGradient()"></div>
          <div><label class="tool-label">Color 2</label><input type="color" id="gColor2" value="#a855f7" style="width:100%;height:44px" oninput="updateGradient()"></div>
          <div>
            <label class="tool-label">Direction</label>
            <select class="tool-select" id="gDir" onchange="updateGradient()">
              <option value="135deg">↘ Diagonal</option>
              <option value="to right">→ Right</option>
              <option value="to bottom">↓ Down</option>
              <option value="to top">↑ Up</option>
              <option value="to left">← Left</option>
              <option value="45deg">↗ Anti-diag</option>
            </select>
          </div>
          <div>
            <label class="tool-label">Type</label>
            <select class="tool-select" id="gType" onchange="updateGradient()">
              <option value="linear">Linear</option>
              <option value="radial">Radial</option>
            </select>
          </div>
        </div>
      </div>
      <div class="tool-section">
        <label class="tool-label">CSS Output</label>
        <div class="output-box" id="gradientOutput"></div>
        <div class="output-actions">
          <button class="btn btn-secondary" onclick="copyText(document.getElementById('gradientOutput').textContent)">📋 Copy CSS</button>
        </div>
      </div>`,

    'word-count': `
      <div class="tool-section">
        <label class="tool-label">Your Text</label>
        <textarea class="tool-textarea" id="wcInput" style="min-height:180px" placeholder="Paste or type your text here..." oninput="countWords()"></textarea>
      </div>
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:16px" id="wcStats">
        <div style="background:var(--bg3);border:1px solid var(--border);border-radius:var(--radius-sm);padding:14px;text-align:center">
          <div style="font-size:1.5rem;font-weight:700;color:var(--accent)" id="wcWords">0</div>
          <div style="font-size:0.75rem;color:var(--text2)">Words</div>
        </div>
        <div style="background:var(--bg3);border:1px solid var(--border);border-radius:var(--radius-sm);padding:14px;text-align:center">
          <div style="font-size:1.5rem;font-weight:700;color:var(--accent2)" id="wcChars">0</div>
          <div style="font-size:0.75rem;color:var(--text2)">Chars</div>
        </div>
        <div style="background:var(--bg3);border:1px solid var(--border);border-radius:var(--radius-sm);padding:14px;text-align:center">
          <div style="font-size:1.5rem;font-weight:700;color:var(--accent3)" id="wcSent">0</div>
          <div style="font-size:0.75rem;color:var(--text2)">Sentences</div>
        </div>
        <div style="background:var(--bg3);border:1px solid var(--border);border-radius:var(--radius-sm);padding:14px;text-align:center">
          <div style="font-size:1.5rem;font-weight:700;color:var(--green)" id="wcRead">0</div>
          <div style="font-size:0.75rem;color:var(--text2)">Read (min)</div>
        </div>
      </div>`,

    'lorem-gen': `
      <div class="tool-section">
        <div class="tool-row">
          <div>
            <label class="tool-label">Type</label>
            <select class="tool-select" id="loremType">
              <option value="paragraphs">Paragraphs</option>
              <option value="sentences">Sentences</option>
              <option value="words">Words</option>
            </select>
          </div>
          <div>
            <label class="tool-label">Count</label>
            <input type="number" class="tool-input" id="loremCount" value="3" min="1" max="20">
          </div>
        </div>
      </div>
      <button class="btn btn-primary" onclick="generateLorem()" style="margin-bottom:16px">📄 Generate</button>
      <div class="tool-section">
        <label class="tool-label">Output</label>
        <textarea class="tool-textarea" id="loremOutput" readonly style="min-height:180px"></textarea>
        <div class="output-actions">
          <button class="btn btn-secondary" onclick="copyText(document.getElementById('loremOutput').value)">📋 Copy</button>
        </div>
      </div>`,

    'uuid-gen': `
      <div class="tool-section">
        <label class="tool-label">Generated UUIDs</label>
        <div class="tool-row" style="margin-bottom:12px">
          <select class="tool-select" id="uuidVersion"><option value="v4" selected>UUID v4 (Random)</option></select>
          <select class="tool-select" id="uuidCount"><option>1</option><option>5</option><option>10</option><option>20</option></select>
        </div>
        <button class="btn btn-primary" onclick="generateUUID()" style="margin-bottom:16px">🆔 Generate UUIDs</button>
        <div class="output-box" id="uuidOutput" style="min-height:100px">Click to generate...</div>
        <div class="output-actions">
          <button class="btn btn-secondary" onclick="copyText(document.getElementById('uuidOutput').textContent)">📋 Copy All</button>
        </div>
      </div>`,

    'notes': `
      <div class="tool-section">
        <div style="display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap" id="notesTabs"></div>
        <input type="text" class="tool-input" id="noteTitle" placeholder="Note title..." style="margin-bottom:8px">
        <textarea class="tool-textarea" id="noteContent" style="min-height:200px" placeholder="Start writing..."></textarea>
      </div>
      <div class="tool-row">
        <button class="btn btn-primary" onclick="saveNote()">💾 Save Note</button>
        <button class="btn btn-secondary" onclick="newNote()">+ New Note</button>
        <button class="btn btn-secondary" onclick="deleteNote()">🗑️ Delete</button>
      </div>`,

    'todo': `
      <div class="tool-section">
        <div style="display:flex;gap:8px;margin-bottom:16px">
          <input type="text" class="tool-input" id="todoInput" placeholder="Add a new task..." style="flex:1" onkeydown="if(event.key==='Enter')addTodo()">
          <button class="btn btn-primary" onclick="addTodo()" style="width:auto;white-space:nowrap">+ Add</button>
        </div>
        <div id="todoList" style="display:flex;flex-direction:column;gap:8px"></div>
        <div style="margin-top:12px;font-size:0.8rem;color:var(--text2)" id="todoStats"></div>
      </div>`,

    'pomodoro': `
      <div style="text-align:center;padding:20px 0">
        <div style="font-size:5rem;font-weight:800;letter-spacing:-0.04em;font-family:'DM Mono',monospace;margin-bottom:8px" id="pomTimer">25:00</div>
        <div style="font-size:0.875rem;color:var(--text2);margin-bottom:28px" id="pomStatus">Focus Session</div>
        <div class="tool-row" style="justify-content:center;margin-bottom:20px">
          <button class="btn btn-primary" id="pomBtn" onclick="togglePomodoro()" style="width:auto">▶ Start</button>
          <button class="btn btn-secondary" onclick="resetPomodoro()">⟳ Reset</button>
        </div>
        <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
          <button class="btn btn-secondary" onclick="setPomMode('focus',25)">🎯 Focus 25m</button>
          <button class="btn btn-secondary" onclick="setPomMode('short',5)">☕ Short 5m</button>
          <button class="btn btn-secondary" onclick="setPomMode('long',15)">🌿 Long 15m</button>
        </div>
        <div style="margin-top:20px;font-size:0.875rem;color:var(--text2)">Sessions today: <span id="pomSessions" style="color:var(--accent);font-weight:700">0</span></div>
      </div>`,

    'stopwatch': `
      <div style="text-align:center;padding:20px 0">
        <div style="font-size:4rem;font-weight:800;letter-spacing:-0.04em;font-family:'DM Mono',monospace;margin-bottom:8px" id="swDisplay">00:00.00</div>
        <div class="tool-row" style="justify-content:center;margin-bottom:20px">
          <button class="btn btn-primary" id="swBtn" onclick="toggleStopwatch()" style="width:auto">▶ Start</button>
          <button class="btn btn-secondary" onclick="lapStopwatch()">🏁 Lap</button>
          <button class="btn btn-secondary" onclick="resetStopwatch()">⟳ Reset</button>
        </div>
        <div id="swLaps" style="max-height:200px;overflow-y:auto"></div>
      </div>`,

    'countdown': `
      <div class="tool-section">
        <label class="tool-label">Set Duration</label>
        <div class="tool-row" style="margin-bottom:16px">
          <div><input type="number" class="tool-input" id="cdHours" value="0" min="0" max="99" placeholder="HH"><div style="font-size:0.75rem;color:var(--text2);text-align:center;margin-top:4px">Hours</div></div>
          <div><input type="number" class="tool-input" id="cdMinutes" value="5" min="0" max="59" placeholder="MM"><div style="font-size:0.75rem;color:var(--text2);text-align:center;margin-top:4px">Minutes</div></div>
          <div><input type="number" class="tool-input" id="cdSeconds" value="0" min="0" max="59" placeholder="SS"><div style="font-size:0.75rem;color:var(--text2);text-align:center;margin-top:4px">Seconds</div></div>
        </div>
      </div>
      <div style="text-align:center;padding:16px 0">
        <div style="font-size:4rem;font-weight:800;font-family:'DM Mono',monospace;margin-bottom:20px" id="cdDisplay">05:00</div>
        <div class="tool-row" style="justify-content:center">
          <button class="btn btn-primary" id="cdBtn" onclick="toggleCountdown()" style="width:auto">▶ Start</button>
          <button class="btn btn-secondary" onclick="resetCountdown()">⟳ Reset</button>
        </div>
      </div>`,

    'unit-conv': `
      <div class="tool-section">
        <label class="tool-label">Category</label>
        <select class="tool-select" id="unitCat" onchange="updateUnitOptions()">
          <option value="length">Length</option>
          <option value="weight">Weight</option>
          <option value="temp">Temperature</option>
          <option value="area">Area</option>
          <option value="volume">Volume</option>
          <option value="speed">Speed</option>
          <option value="data">Data Storage</option>
        </select>
      </div>
      <div class="tool-row" style="margin-bottom:16px">
        <div>
          <label class="tool-label">From</label>
          <select class="tool-select" id="unitFrom"></select>
        </div>
        <div>
          <label class="tool-label">To</label>
          <select class="tool-select" id="unitTo"></select>
        </div>
      </div>
      <div class="tool-section">
        <label class="tool-label">Value</label>
        <input type="number" class="tool-input" id="unitInput" value="1" oninput="convertUnit()">
      </div>
      <div class="tool-section">
        <label class="tool-label">Result</label>
        <div class="output-box" id="unitOutput" style="font-size:1.25rem;font-weight:600">—</div>
      </div>`,

    'emi-calc': `
      <div class="tool-section">
        <div class="tool-row">
          <div><label class="tool-label">Loan Amount (₹)</label><input type="number" class="tool-input" id="emiAmount" value="500000" oninput="calcEMI()"></div>
          <div><label class="tool-label">Interest Rate (%/yr)</label><input type="number" class="tool-input" id="emiRate" value="8.5" step="0.1" oninput="calcEMI()"></div>
          <div><label class="tool-label">Tenure (months)</label><input type="number" class="tool-input" id="emiTenure" value="60" oninput="calcEMI()"></div>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:8px">
        <div style="background:var(--bg3);border:1px solid var(--border);border-radius:var(--radius-sm);padding:16px;text-align:center">
          <div style="font-size:0.75rem;color:var(--text2);margin-bottom:4px">Monthly EMI</div>
          <div style="font-size:1.25rem;font-weight:700;color:var(--accent)" id="emiResult">—</div>
        </div>
        <div style="background:var(--bg3);border:1px solid var(--border);border-radius:var(--radius-sm);padding:16px;text-align:center">
          <div style="font-size:0.75rem;color:var(--text2);margin-bottom:4px">Total Interest</div>
          <div style="font-size:1.25rem;font-weight:700;color:var(--orange)" id="emiInterest">—</div>
        </div>
        <div style="background:var(--bg3);border:1px solid var(--border);border-radius:var(--radius-sm);padding:16px;text-align:center">
          <div style="font-size:0.75rem;color:var(--text2);margin-bottom:4px">Total Amount</div>
          <div style="font-size:1.25rem;font-weight:700;color:var(--green)" id="emiTotal">—</div>
        </div>
      </div>`,

    'typing-test': `
      <div id="typingTestArea">
        <div class="typing-stats" style="margin-bottom:16px">
          <div class="typing-stat"><div class="num" id="typingWpm">0</div><div class="lbl">WPM</div></div>
          <div class="typing-stat"><div class="num" id="typingAcc">100</div><div class="lbl">Accuracy %</div></div>
          <div class="typing-stat"><div class="num" id="typingTime">60</div><div class="lbl">Seconds</div></div>
          <div class="typing-stat"><div class="num" id="typingErrors">0</div><div class="lbl">Errors</div></div>
        </div>
        <div class="typing-text" id="typingDisplay"></div>
        <textarea class="tool-textarea" id="typingInput" placeholder="Start typing to begin the test..." style="margin-top:12px;min-height:60px" oninput="handleTyping()"></textarea>
        <div class="tool-row" style="margin-top:12px">
          <button class="btn btn-primary" onclick="resetTyping()">🔄 New Test</button>
          <select class="tool-select" id="typingDuration" onchange="resetTyping()"><option value="30">30 sec</option><option value="60" selected>60 sec</option><option value="120">2 min</option></select>
        </div>
      </div>`,

    'regex-test': `
      <div class="tool-section">
        <label class="tool-label">Regular Expression</label>
        <div style="display:flex;gap:0">
          <span style="background:var(--bg3);border:1px solid var(--border);border-right:none;border-radius:var(--radius-sm) 0 0 var(--radius-sm);padding:12px 14px;color:var(--text2);font-family:'DM Mono',monospace;">/</span>
          <input type="text" class="tool-input" id="regexPattern" style="border-radius:0;border-left:none;border-right:none" placeholder="[a-z]+" oninput="testRegex()">
          <input type="text" class="tool-input" id="regexFlags" style="border-radius:0 var(--radius-sm) var(--radius-sm) 0;border-left:none;width:80px" placeholder="gi" oninput="testRegex()" value="gi">
        </div>
      </div>
      <div class="tool-section">
        <label class="tool-label">Test String</label>
        <textarea class="tool-textarea" id="regexTest" placeholder="Enter text to test against..." oninput="testRegex()">Hello World 123 foo bar</textarea>
      </div>
      <div class="tool-section">
        <label class="tool-label">Matches</label>
        <div class="output-box" id="regexOutput">Enter a pattern above...</div>
      </div>`,

    'html-preview': `
      <div class="tool-section">
        <label class="tool-label">HTML Code</label>
        <textarea class="tool-textarea" id="htmlInput" style="min-height:160px;font-family:'DM Mono',monospace" placeholder="<h1>Hello World</h1>" oninput="previewHTML()"><h1 style="color:#7c6cfc">Hello from OmniTools!</h1><p>Edit this HTML to see live preview ✨</p></textarea>
      </div>
      <div class="tool-section">
        <label class="tool-label">Live Preview</label>
        <iframe id="htmlPreviewFrame" style="width:100%;height:200px;border:1px solid var(--border);border-radius:var(--radius-sm);background:white"></iframe>
      </div>`,

    'markdown-prev': `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
        <div>
          <label class="tool-label">Markdown</label>
          <textarea class="tool-textarea" id="mdInput" style="min-height:260px;font-family:'DM Mono',monospace" oninput="previewMarkdown()">## Hello OmniTools!\n\nThis is **bold** and *italic*.\n\n- Item one\n- Item two\n- Item three\n\n\`\`\`js\nconsole.log('Hello!')\n\`\`\`</textarea>
        </div>
        <div>
          <label class="tool-label">Preview</label>
          <div id="mdOutput" style="background:var(--bg3);border:1px solid var(--border);border-radius:var(--radius-sm);padding:16px;min-height:260px;overflow-y:auto;line-height:1.7;font-size:0.9rem"></div>
        </div>
      </div>`,

    'gpa-calc': `
      <div class="tool-section">
        <label class="tool-label">Courses</label>
        <div id="gpaRows" style="display:flex;flex-direction:column;gap:8px"></div>
        <button class="btn btn-secondary" onclick="addGPARow()" style="margin-top:8px">+ Add Course</button>
      </div>
      <button class="btn btn-primary" onclick="calcGPA()" style="margin-bottom:16px">🎓 Calculate GPA</button>
      <div class="tool-section">
        <label class="tool-label">Result</label>
        <div class="output-box" id="gpaOutput">Add courses and click Calculate.</div>
      </div>`,

    'currency-conv': `
      <div class="tool-section">
        <label class="tool-label">Amount</label>
        <input type="number" class="tool-input" id="currAmount" value="100" oninput="convertCurrency()">
      </div>
      <div class="tool-row" style="margin-bottom:16px">
        <div><label class="tool-label">From</label>
          <select class="tool-select" id="currFrom" onchange="convertCurrency()">
            <option value="USD">🇺🇸 USD</option><option value="EUR">🇪🇺 EUR</option><option value="GBP">🇬🇧 GBP</option>
            <option value="INR">🇮🇳 INR</option><option value="JPY">🇯🇵 JPY</option><option value="CAD">🇨🇦 CAD</option>
            <option value="AUD">🇦🇺 AUD</option><option value="CHF">🇨🇭 CHF</option><option value="CNY">🇨🇳 CNY</option>
          </select>
        </div>
        <div><label class="tool-label">To</label>
          <select class="tool-select" id="currTo" onchange="convertCurrency()">
            <option value="EUR">🇪🇺 EUR</option><option value="USD">🇺🇸 USD</option><option value="GBP">🇬🇧 GBP</option>
            <option value="INR" selected>🇮🇳 INR</option><option value="JPY">🇯🇵 JPY</option><option value="CAD">🇨🇦 CAD</option>
            <option value="AUD">🇦🇺 AUD</option><option value="CHF">🇨🇭 CHF</option><option value="CNY">🇨🇳 CNY</option>
          </select>
        </div>
      </div>
      <div class="output-box" id="currOutput" style="font-size:1.5rem;font-weight:700;text-align:center">—</div>
      <p style="font-size:0.75rem;color:var(--text2);margin-top:8px;text-align:center">⚠️ Rates are approximate. Use live rates for financial decisions.</p>`,

    'tip-calc': `
      <div class="tool-section">
        <div class="tool-row">
          <div><label class="tool-label">Bill Amount ($)</label><input type="number" class="tool-input" id="tipBill" value="50" oninput="calcTip()"></div>
          <div><label class="tool-label">Tip %</label><input type="number" class="tool-input" id="tipPct" value="15" oninput="calcTip()"></div>
          <div><label class="tool-label">Split Between</label><input type="number" class="tool-input" id="tipSplit" value="1" min="1" oninput="calcTip()"></div>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:8px">
        <div style="background:var(--bg3);border:1px solid var(--border);border-radius:var(--radius-sm);padding:16px;text-align:center">
          <div style="font-size:0.75rem;color:var(--text2)">Tip Amount</div><div style="font-size:1.25rem;font-weight:700;color:var(--accent)" id="tipAmount">—</div>
        </div>
        <div style="background:var(--bg3);border:1px solid var(--border);border-radius:var(--radius-sm);padding:16px;text-align:center">
          <div style="font-size:0.75rem;color:var(--text2)">Total Bill</div><div style="font-size:1.25rem;font-weight:700;color:var(--green)" id="tipTotal">—</div>
        </div>
        <div style="background:var(--bg3);border:1px solid var(--border);border-radius:var(--radius-sm);padding:16px;text-align:center">
          <div style="font-size:0.75rem;color:var(--text2)">Per Person</div><div style="font-size:1.25rem;font-weight:700;color:var(--orange)" id="tipPer">—</div>
        </div>
      </div>`,

    'profit-calc': `
      <div class="tool-section">
        <div class="tool-row">
          <div><label class="tool-label">Cost Price</label><input type="number" class="tool-input" id="profitCost" value="100" oninput="calcProfit()"></div>
          <div><label class="tool-label">Selling Price</label><input type="number" class="tool-input" id="profitSell" value="150" oninput="calcProfit()"></div>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:8px">
        <div style="background:var(--bg3);border:1px solid var(--border);border-radius:var(--radius-sm);padding:16px;text-align:center">
          <div style="font-size:0.75rem;color:var(--text2)">Profit</div><div style="font-size:1.25rem;font-weight:700;color:var(--green)" id="profitAmt">—</div>
        </div>
        <div style="background:var(--bg3);border:1px solid var(--border);border-radius:var(--radius-sm);padding:16px;text-align:center">
          <div style="font-size:0.75rem;color:var(--text2)">Margin %</div><div style="font-size:1.25rem;font-weight:700;color:var(--accent)" id="profitMargin">—</div>
        </div>
        <div style="background:var(--bg3);border:1px solid var(--border);border-radius:var(--radius-sm);padding:16px;text-align:center">
          <div style="font-size:0.75rem;color:var(--text2)">Markup %</div><div style="font-size:1.25rem;font-weight:700;color:var(--orange)" id="profitMarkup">—</div>
        </div>
      </div>`,
  };

  // AI tools common template
  const aiTools = { 'ai-summarizer': {prompt:'Summarize the following text concisely in 3-5 bullet points:\n\n', placeholder:'Paste your text here to summarize...', label:'Text to Summarize'},
    'ai-email': {prompt:'Write a professional email based on these notes:\n\n', placeholder:'Describe the email purpose and key points...', label:'Email Brief'},
    'ai-hashtags': {prompt:'Generate 15 relevant trending hashtags for social media based on:\n\n', placeholder:'Describe your post or topic...', label:'Post Topic'},
    'ai-caption': {prompt:'Write 3 engaging social media captions for:\n\n', placeholder:'Describe your photo or post...', label:'Post Description'},
  };
  if (aiTools[id]) {
    const t = aiTools[id];
    return `
      <div class="tool-section">
        <label class="tool-label">${t.label}</label>
        <textarea class="tool-textarea" id="aiInput" style="min-height:140px" placeholder="${t.placeholder}"></textarea>
      </div>
      <button class="btn btn-primary" onclick="runAI('${id}', \`${t.prompt}\`)" style="margin-bottom:16px">🤖 Generate with AI</button>
      <div class="tool-section">
        <label class="tool-label">AI Output</label>
        <div class="output-box" id="aiOutput" style="min-height:120px">Output will appear here...</div>
        <div class="output-actions">
          <button class="btn btn-secondary" onclick="copyText(document.getElementById('aiOutput').textContent)">📋 Copy</button>
        </div>
      </div>`;
  }

  // Stub for file tools
  const fileStubs = ['pdf-merge','pdf-split','pdf-compress','img-to-pdf','pdf-lock','pdf-unlock','img-compress','img-resize','img-crop','bg-remove','meme-gen','flashcards'];
  if (fileStubs.includes(id)) {
    return `
      <div style="text-align:center;padding:40px 20px">
        <div style="font-size:3rem;margin-bottom:16px">🚧</div>
        <h3 style="font-weight:700;margin-bottom:8px">Coming Soon</h3>
        <p style="color:var(--text2);font-size:0.9rem">This tool requires backend processing.<br>Star the repo on GitHub to get notified when it launches!</p>
        <a href="https://github.com/anonymous-201/omnitools" target="_blank" class="btn btn-primary" style="display:inline-flex;margin-top:20px;width:auto">⭐ Star on GitHub</a>
      </div>`;
  }

  return tools[id] || `<div class="output-box">Tool UI coming soon...</div>`;
}

// ── Tool Logic Functions ──────────────────────────────────────────────────

function generatePassword() {
  const len = +document.getElementById('pwLen').value;
  const up = document.getElementById('pwUpper').checked;
  const lo = document.getElementById('pwLower').checked;
  const nu = document.getElementById('pwNum').checked;
  const sy = document.getElementById('pwSym').checked;
  let chars = '';
  if (up) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (lo) chars += 'abcdefghijklmnopqrstuvwxyz';
  if (nu) chars += '0123456789';
  if (sy) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';
  if (!chars) { toast('Select at least one option', 'error'); return; }
  let pw = '';
  for (let i = 0; i < len; i++) pw += chars[Math.floor(Math.random() * chars.length)];
  document.getElementById('pwOutput').textContent = pw;
}

function formatJSON() {
  try {
    const parsed = JSON.parse(document.getElementById('jsonInput').value);
    document.getElementById('jsonOutput').value = JSON.stringify(parsed, null, 2);
    toast('JSON formatted!');
  } catch(e) { toast('Invalid JSON: ' + e.message, 'error'); }
}
function minifyJSON() {
  try {
    const parsed = JSON.parse(document.getElementById('jsonInput').value);
    document.getElementById('jsonOutput').value = JSON.stringify(parsed);
    toast('JSON minified!');
  } catch(e) { toast('Invalid JSON', 'error'); }
}
function validateJSON() {
  try { JSON.parse(document.getElementById('jsonInput').value); toast('✓ Valid JSON!'); }
  catch(e) { toast('Invalid JSON: ' + e.message, 'error'); }
}

function encodeBase64() {
  const v = document.getElementById('b64Input').value;
  document.getElementById('b64Output').textContent = btoa(unescape(encodeURIComponent(v)));
}
function decodeBase64() {
  try { document.getElementById('b64Output').textContent = decodeURIComponent(escape(atob(document.getElementById('b64Input').value))); }
  catch(e) { toast('Invalid Base64', 'error'); }
}

function generateQR() {
  const input = document.getElementById('qrInput').value || 'https://omnitools.dev';
  const size = +document.getElementById('qrSize').value;
  const fg = document.getElementById('qrFg').value;
  const bg = document.getElementById('qrBg').value;
  const url = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(input)}&color=${fg.slice(1)}&bgcolor=${bg.slice(1)}`;
  document.getElementById('qrOutput').innerHTML = `<img src="${url}" style="border-radius:var(--radius-sm);max-width:100%"><div style="margin-top:12px"><a href="${url}" download="qr.png" class="btn btn-secondary">⬇ Download QR</a></div>`;
}

function updateColor(hex) {
  document.getElementById('colorInput').value = hex;
  document.getElementById('colorHex').value = hex;
  document.getElementById('colorPreview').style.background = hex;
  const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
  const max = Math.max(r,g,b)/255, min = Math.min(r,g,b)/255;
  const l = (max+min)/2;
  const s = max===min ? 0 : l<0.5 ? (max-min)/(max+min) : (max-min)/(2-max-min);
  let h = 0;
  if (max !== min) { const d = max-min; if (max===r/255) h=(g/255-b/255)/d+(g<b?6:0); else if(max===g/255) h=(b/255-r/255)/d+2; else h=(r/255-g/255)/d+4; h/=6; }
  document.getElementById('colorOutput').innerHTML = `HEX: ${hex}\nRGB: rgb(${r}, ${g}, ${b})\nHSL: hsl(${Math.round(h*360)}, ${Math.round(s*100)}%, ${Math.round(l*100)}%)`;
  const shades = document.getElementById('colorShades');
  if (!shades) return;
  shades.innerHTML = '';
  for (let i = 1; i <= 9; i++) {
    const factor = i/10;
    const sr = Math.round(r + (255-r)*(1-factor));
    const sg = Math.round(g + (255-g)*(1-factor));
    const sb = Math.round(b + (255-b)*(1-factor));
    const shade = document.createElement('div');
    shade.style.cssText = `flex:1;height:40px;background:rgb(${sr},${sg},${sb});cursor:pointer;transition:transform 0.1s`;
    shade.title = `#${sr.toString(16).padStart(2,'0')}${sg.toString(16).padStart(2,'0')}${sb.toString(16).padStart(2,'0')}`;
    shade.onclick = () => copyText(shade.title);
    shade.onmouseenter = () => shade.style.transform = 'scaleY(1.2)';
    shade.onmouseleave = () => shade.style.transform = '';
    shades.appendChild(shade);
  }
}

function updateGradient() {
  const c1 = document.getElementById('gColor1').value;
  const c2 = document.getElementById('gColor2').value;
  const dir = document.getElementById('gDir').value;
  const type = document.getElementById('gType').value;
  const css = type === 'radial' ? `radial-gradient(circle, ${c1}, ${c2})` : `linear-gradient(${dir}, ${c1}, ${c2})`;
  document.getElementById('gradientPreview').style.background = css;
  document.getElementById('gradientOutput').textContent = `background: ${css};\nbackground: -webkit-${css};`;
}

function countWords() {
  const txt = document.getElementById('wcInput').value;
  const words = txt.trim() ? txt.trim().split(/\s+/).length : 0;
  const chars = txt.length;
  const sents = txt.split(/[.!?]+/).filter(s=>s.trim()).length;
  const read = Math.ceil(words/200);
  document.getElementById('wcWords').textContent = words;
  document.getElementById('wcChars').textContent = chars;
  document.getElementById('wcSent').textContent = sents;
  document.getElementById('wcRead').textContent = read;
}

const LOREM = "Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua Ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur Excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum".split(' ');

function generateLorem() {
  const type = document.getElementById('loremType').value;
  const count = +document.getElementById('loremCount').value;
  let out = '';
  if (type === 'words') {
    out = Array.from({length:count}, () => LOREM[Math.floor(Math.random()*LOREM.length)]).join(' ');
  } else if (type === 'sentences') {
    out = Array.from({length:count}, () => {
      const len = 8 + Math.floor(Math.random()*12);
      return Array.from({length:len}, () => LOREM[Math.floor(Math.random()*LOREM.length)]).join(' ') + '.';
    }).join(' ');
  } else {
    out = Array.from({length:count}, () => {
      return Array.from({length: 4 + Math.floor(Math.random()*4)}, () => {
        const len = 8 + Math.floor(Math.random()*12);
        return Array.from({length:len}, () => LOREM[Math.floor(Math.random()*LOREM.length)]).join(' ') + '.';
      }).join(' ');
    }).join('\n\n');
  }
  document.getElementById('loremOutput').value = out;
}

function generateUUID() {
  const count = +document.getElementById('uuidCount').value || 1;
  const uuids = Array.from({length:count}, () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random()*16|0;
    return (c==='x' ? r : (r&0x3|0x8)).toString(16);
  }));
  document.getElementById('uuidOutput').textContent = uuids.join('\n');
}

// Notes App
let notes = JSON.parse(localStorage.getItem('omnitools_notes') || '[]');
let currentNote = 0;

function renderNoteTabs() {
  const tabs = document.getElementById('notesTabs');
  if (!tabs) return;
  tabs.innerHTML = '';
  notes.forEach((n, i) => {
    const b = document.createElement('button');
    b.className = `btn ${i===currentNote ? 'btn-primary' : 'btn-secondary'}`;
    b.style.cssText = 'width:auto;font-size:0.75rem;padding:6px 12px';
    b.textContent = n.title || 'Untitled';
    b.onclick = () => { currentNote = i; loadNote(); renderNoteTabs(); };
    tabs.appendChild(b);
  });
}
function loadNote() {
  if (!notes[currentNote]) return;
  document.getElementById('noteTitle').value = notes[currentNote].title || '';
  document.getElementById('noteContent').value = notes[currentNote].content || '';
}
function saveNote() {
  if (!notes[currentNote]) notes.push({title:'',content:''});
  notes[currentNote] = { title: document.getElementById('noteTitle').value, content: document.getElementById('noteContent').value };
  localStorage.setItem('omnitools_notes', JSON.stringify(notes));
  renderNoteTabs();
  toast('Note saved!');
}
function newNote() { notes.push({title:'',content:''}); currentNote = notes.length-1; loadNote(); renderNoteTabs(); }
function deleteNote() {
  notes.splice(currentNote, 1);
  currentNote = Math.max(0, currentNote-1);
  if (notes.length === 0) notes = [{title:'',content:''}];
  loadNote(); renderNoteTabs();
  localStorage.setItem('omnitools_notes', JSON.stringify(notes));
}

// To-Do List
let todos = JSON.parse(localStorage.getItem('omnitools_todos') || '[]');
function renderTodos() {
  const list = document.getElementById('todoList');
  if (!list) return;
  list.innerHTML = '';
  todos.forEach((t, i) => {
    const div = document.createElement('div');
    div.style.cssText = 'display:flex;align-items:center;gap:10px;background:var(--bg3);border:1px solid var(--border);border-radius:var(--radius-sm);padding:10px 14px';
    div.innerHTML = `<input type="checkbox" ${t.done?'checked':''} onchange="toggleTodo(${i})" style="width:16px;height:16px;accent-color:var(--accent)">
      <span style="flex:1;font-size:0.9rem;${t.done?'text-decoration:line-through;color:var(--text2)':''}">${t.text}</span>
      <button onclick="deleteTodo(${i})" style="background:none;border:none;color:var(--text2);cursor:pointer;font-size:0.9rem">🗑️</button>`;
    list.appendChild(div);
  });
  const done = todos.filter(t=>t.done).length;
  const stats = document.getElementById('todoStats');
  if (stats) stats.textContent = `${done}/${todos.length} completed`;
}
function addTodo() {
  const inp = document.getElementById('todoInput');
  if (!inp.value.trim()) return;
  todos.push({text:inp.value.trim(), done:false});
  inp.value = '';
  localStorage.setItem('omnitools_todos', JSON.stringify(todos));
  renderTodos();
}
function toggleTodo(i) { todos[i].done = !todos[i].done; localStorage.setItem('omnitools_todos', JSON.stringify(todos)); renderTodos(); }
function deleteTodo(i) { todos.splice(i,1); localStorage.setItem('omnitools_todos', JSON.stringify(todos)); renderTodos(); }

// Pomodoro
let pomInterval = null, pomRunning = false, pomSeconds = 25*60, pomMode = 'focus', pomSessionCount = 0;
function togglePomodoro() {
  pomRunning = !pomRunning;
  document.getElementById('pomBtn').textContent = pomRunning ? '⏸ Pause' : '▶ Start';
  if (pomRunning) {
    pomInterval = setInterval(() => {
      pomSeconds--;
      updatePomDisplay();
      if (pomSeconds <= 0) { clearInterval(pomInterval); pomRunning = false; pomSessionCount++; document.getElementById('pomSessions').textContent = pomSessionCount; toast('Session complete! 🎉'); document.getElementById('pomBtn').textContent = '▶ Start'; }
    }, 1000);
  } else clearInterval(pomInterval);
}
function resetPomodoro() { clearInterval(pomInterval); pomRunning = false; document.getElementById('pomBtn').textContent = '▶ Start'; pomSeconds = (pomMode==='focus'?25:pomMode==='short'?5:15)*60; updatePomDisplay(); }
function setPomMode(mode, mins) { pomMode = mode; clearInterval(pomInterval); pomRunning = false; document.getElementById('pomBtn').textContent = '▶ Start'; pomSeconds = mins*60; updatePomDisplay(); document.getElementById('pomStatus').textContent = mode==='focus'?'Focus Session':mode==='short'?'Short Break':'Long Break'; }
function updatePomDisplay() { const m = Math.floor(pomSeconds/60), s = pomSeconds%60; document.getElementById('pomTimer').textContent = `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`; }

// Stopwatch
let swInterval = null, swRunning = false, swMs = 0, swLapCount = 0;
function toggleStopwatch() {
  swRunning = !swRunning;
  document.getElementById('swBtn').textContent = swRunning ? '⏸ Pause' : '▶ Start';
  if (swRunning) swInterval = setInterval(() => { swMs += 10; updateSwDisplay(); }, 10);
  else clearInterval(swInterval);
}
function resetStopwatch() { clearInterval(swInterval); swRunning = false; swMs = 0; swLapCount = 0; document.getElementById('swBtn').textContent = '▶ Start'; document.getElementById('swDisplay').textContent = '00:00.00'; document.getElementById('swLaps').innerHTML = ''; }
function lapStopwatch() {
  swLapCount++;
  const laps = document.getElementById('swLaps');
  const m = Math.floor(swMs/60000), s = Math.floor(swMs%60000/1000), ms = Math.floor(swMs%1000/10);
  const div = document.createElement('div');
  div.style.cssText = 'display:flex;justify-content:space-between;padding:6px 8px;background:var(--bg3);border-radius:6px;font-family:"DM Mono",monospace;font-size:0.8rem;margin-bottom:4px';
  div.innerHTML = `<span style="color:var(--text2)">Lap ${swLapCount}</span><span>${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}.${String(ms).padStart(2,'0')}</span>`;
  laps.insertBefore(div, laps.firstChild);
}
function updateSwDisplay() {
  const m = Math.floor(swMs/60000), s = Math.floor(swMs%60000/1000), ms = Math.floor(swMs%1000/10);
  document.getElementById('swDisplay').textContent = `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}.${String(ms).padStart(2,'0')}`;
}

// Countdown
let cdInterval = null, cdRunning = false, cdTotal = 0;
function toggleCountdown() {
  if (!cdRunning && cdTotal <= 0) {
    const h = +document.getElementById('cdHours').value||0;
    const m = +document.getElementById('cdMinutes').value||0;
    const s = +document.getElementById('cdSeconds').value||0;
    cdTotal = h*3600 + m*60 + s;
    if (cdTotal <= 0) { toast('Set a duration first!','error'); return; }
  }
  cdRunning = !cdRunning;
  document.getElementById('cdBtn').textContent = cdRunning ? '⏸ Pause' : '▶ Start';
  if (cdRunning) {
    cdInterval = setInterval(() => {
      cdTotal--;
      updateCdDisplay();
      if (cdTotal <= 0) { clearInterval(cdInterval); cdRunning = false; document.getElementById('cdBtn').textContent = '▶ Start'; toast('⏰ Timer done!'); }
    }, 1000);
  } else clearInterval(cdInterval);
}
function resetCountdown() { clearInterval(cdInterval); cdRunning = false; cdTotal = 0; document.getElementById('cdBtn').textContent = '▶ Start'; document.getElementById('cdDisplay').textContent = '00:00'; }
function updateCdDisplay() {
  const m = Math.floor(cdTotal/60), s = cdTotal%60;
  const h = Math.floor(cdTotal/3600);
  if (h > 0) document.getElementById('cdDisplay').textContent = `${String(h).padStart(2,'0')}:${String(m%60).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  else document.getElementById('cdDisplay').textContent = `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
}

// Unit Converter
const UNIT_DATA = {
  length: { units: ['Meter','Kilometer','Centimeter','Millimeter','Mile','Yard','Foot','Inch'], toBase: [1,1000,0.01,0.001,1609.34,0.9144,0.3048,0.0254] },
  weight: { units: ['Kilogram','Gram','Pound','Ounce','Ton','Milligram'], toBase: [1,0.001,0.453592,0.0283495,1000,0.000001] },
  temp: { units: ['Celsius','Fahrenheit','Kelvin'], toBase: [1,1,1] },
  area: { units: ['Sq Meter','Sq Kilometer','Sq Foot','Acre','Hectare'], toBase: [1,1e6,0.0929,4046.86,10000] },
  volume: { units: ['Liter','Milliliter','Gallon','Cup','Fluid Oz'], toBase: [1,0.001,3.78541,0.236588,0.0295735] },
  speed: { units: ['m/s','km/h','mph','knot'], toBase: [1,0.277778,0.44704,0.514444] },
  data: { units: ['Byte','Kilobyte','Megabyte','Gigabyte','Terabyte'], toBase: [1,1024,1048576,1073741824,1099511627776] },
};
function updateUnitOptions() {
  const cat = document.getElementById('unitCat').value;
  const data = UNIT_DATA[cat];
  ['unitFrom','unitTo'].forEach((id,i) => {
    const sel = document.getElementById(id);
    if(!sel) return;
    sel.innerHTML = data.units.map((u,j)=>`<option value="${j}" ${j===(i===1?1:0)?'selected':''}>${u}</option>`).join('');
  });
  convertUnit();
}
function convertUnit() {
  const cat = document.getElementById('unitCat').value;
  const from = +document.getElementById('unitFrom').value;
  const to = +document.getElementById('unitTo').value;
  const val = +document.getElementById('unitInput').value;
  const data = UNIT_DATA[cat];
  let result;
  if (cat === 'temp') {
    let celsius = val;
    if (from === 1) celsius = (val-32)*5/9;
    else if (from === 2) celsius = val-273.15;
    if (to === 0) result = celsius;
    else if (to === 1) result = celsius*9/5+32;
    else result = celsius+273.15;
  } else {
    const base = val * data.toBase[from];
    result = base / data.toBase[to];
  }
  const out = document.getElementById('unitOutput');
  if(out) out.textContent = `${val} ${data.units[from]} = ${result.toFixed(6).replace(/\.?0+$/, '')} ${data.units[to]}`;
}

// EMI Calculator
function calcEMI() {
  const P = +document.getElementById('emiAmount').value;
  const r = +document.getElementById('emiRate').value / 12 / 100;
  const n = +document.getElementById('emiTenure').value;
  const emi = P * r * Math.pow(1+r,n) / (Math.pow(1+r,n)-1);
  const total = emi * n;
  const interest = total - P;
  const fmt = v => '₹' + Math.round(v).toLocaleString('en-IN');
  const e = document.getElementById('emiResult'); if(e) e.textContent = fmt(emi);
  const i = document.getElementById('emiInterest'); if(i) i.textContent = fmt(interest);
  const t = document.getElementById('emiTotal'); if(t) t.textContent = fmt(total);
}

// Tip Calculator
function calcTip() {
  const bill = +document.getElementById('tipBill').value;
  const pct = +document.getElementById('tipPct').value;
  const split = +document.getElementById('tipSplit').value || 1;
  const tip = bill * pct / 100;
  const total = bill + tip;
  const fmt = v => '$' + v.toFixed(2);
  document.getElementById('tipAmount').textContent = fmt(tip);
  document.getElementById('tipTotal').textContent = fmt(total);
  document.getElementById('tipPer').textContent = fmt(total/split);
}

// Profit Calculator
function calcProfit() {
  const cost = +document.getElementById('profitCost').value;
  const sell = +document.getElementById('profitSell').value;
  const profit = sell - cost;
  const margin = sell ? (profit/sell*100).toFixed(2) : 0;
  const markup = cost ? (profit/cost*100).toFixed(2) : 0;
  document.getElementById('profitAmt').textContent = (profit >= 0 ? '+' : '') + profit.toFixed(2);
  document.getElementById('profitMargin').textContent = margin + '%';
  document.getElementById('profitMarkup').textContent = markup + '%';
}

// Currency (static rates)
const RATES = { USD:1, EUR:0.92, GBP:0.79, INR:83.5, JPY:149.5, CAD:1.36, AUD:1.53, CHF:0.89, CNY:7.24 };
function convertCurrency() {
  const amt = +document.getElementById('currAmount').value;
  const from = document.getElementById('currFrom').value;
  const to = document.getElementById('currTo').value;
  const result = (amt / RATES[from]) * RATES[to];
  const out = document.getElementById('currOutput');
  if(out) out.textContent = `${amt} ${from} = ${result.toFixed(4)} ${to}`;
}

// Typing Test
const TYPING_WORDS = 'the quick brown fox jumps over the lazy dog a quick movement of the enemy will jeopardize six gun boats pack my box with five dozen liquor jugs how vexingly quick daft zebras jump sphinx of black quartz judge my vow'.split(' ');
let typingWords = [], typingIndex = 0, typingTimer = null, typingSeconds = 0, typingErrors = 0, typingStarted = false;

function initTypingTest() {
  typingWords = Array.from({length:60}, () => TYPING_WORDS[Math.floor(Math.random()*TYPING_WORDS.length)]);
  typingIndex = 0; typingErrors = 0; typingStarted = false;
  clearInterval(typingTimer);
  const dur = +(document.getElementById('typingDuration')?.value || 60);
  typingSeconds = dur;
  document.getElementById('typingTime').textContent = dur;
  document.getElementById('typingWpm').textContent = '0';
  document.getElementById('typingAcc').textContent = '100';
  document.getElementById('typingErrors').textContent = '0';
  document.getElementById('typingInput').value = '';
  document.getElementById('typingInput').disabled = false;
  renderTypingDisplay();
}
function renderTypingDisplay() {
  const d = document.getElementById('typingDisplay');
  if (!d) return;
  d.innerHTML = typingWords.map((w, i) => {
    let cls = '';
    if (i < typingIndex) cls = 'correct';
    else if (i === typingIndex) cls = 'current';
    return `<span class="${cls}">${w} </span>`;
  }).join('');
}
function handleTyping() {
  if (!typingStarted) {
    typingStarted = true;
    const dur = +(document.getElementById('typingDuration')?.value || 60);
    typingSeconds = dur;
    typingTimer = setInterval(() => {
      typingSeconds--;
      document.getElementById('typingTime').textContent = typingSeconds;
      const wpm = Math.round((typingIndex / (dur - typingSeconds + 0.001)) * 60);
      document.getElementById('typingWpm').textContent = wpm;
      if (typingSeconds <= 0) {
        clearInterval(typingTimer);
        document.getElementById('typingInput').disabled = true;
        toast(`Done! ${wpm} WPM 🎉`);
      }
    }, 1000);
  }
  const input = document.getElementById('typingInput').value;
  if (input.endsWith(' ')) {
    const typed = input.trim();
    if (typed !== typingWords[typingIndex]) typingErrors++;
    typingIndex++;
    document.getElementById('typingInput').value = '';
    document.getElementById('typingErrors').textContent = typingErrors;
    const acc = Math.round(((typingIndex - typingErrors) / typingIndex) * 100);
    document.getElementById('typingAcc').textContent = Math.max(0, acc);
    renderTypingDisplay();
  }
}
function resetTyping() { initTypingTest(); }

// Regex Tester
function testRegex() {
  const pat = document.getElementById('regexPattern')?.value;
  const flags = document.getElementById('regexFlags')?.value || '';
  const test = document.getElementById('regexTest')?.value || '';
  const out = document.getElementById('regexOutput');
  if (!out) return;
  if (!pat) { out.textContent = 'Enter a pattern...'; return; }
  try {
    const re = new RegExp(pat, flags);
    const matches = [...test.matchAll(new RegExp(pat, flags.includes('g') ? flags : flags+'g'))];
    if (matches.length === 0) { out.textContent = 'No matches found'; return; }
    out.textContent = `${matches.length} match(es):\n` + matches.map((m,i) => `[${i+1}] "${m[0]}" at index ${m.index}`).join('\n');
  } catch(e) { out.textContent = 'Invalid regex: ' + e.message; }
}

// HTML Preview
function previewHTML() {
  const frame = document.getElementById('htmlPreviewFrame');
  if (!frame) return;
  frame.srcdoc = document.getElementById('htmlInput').value;
}

// Markdown Preview
function previewMarkdown() {
  const input = document.getElementById('mdInput')?.value || '';
  const out = document.getElementById('mdOutput');
  if (!out) return;
  let html = input
    .replace(/```[\w]*\n?([\s\S]*?)```/g, '<pre style="background:#1a1a2e;padding:12px;border-radius:6px;overflow:auto"><code>$1</code></pre>')
    .replace(/`([^`]+)`/g, '<code style="background:#1a1a2e;padding:2px 6px;border-radius:4px">$1</code>')
    .replace(/^### (.*)/gm, '<h3 style="margin:12px 0 6px;font-size:1rem">$1</h3>')
    .replace(/^## (.*)/gm, '<h2 style="margin:16px 0 8px;font-size:1.2rem">$1</h2>')
    .replace(/^# (.*)/gm, '<h1 style="margin:20px 0 10px;font-size:1.5rem">$1</h1>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/^- (.*)/gm, '<li style="margin:4px 0">$1</li>')
    .replace(/\n/g, '<br>');
  out.innerHTML = html;
}

// GPA Calculator
function addGPARow() {
  const rows = document.getElementById('gpaRows');
  if (!rows) return;
  const div = document.createElement('div');
  div.className = 'tool-row';
  div.style.gap = '8px';
  div.innerHTML = `
    <input type="text" class="tool-input" placeholder="Course name" style="flex:2">
    <select class="tool-select">
      <option value="4.0">A (4.0)</option><option value="3.7">A- (3.7)</option>
      <option value="3.3">B+ (3.3)</option><option value="3.0">B (3.0)</option>
      <option value="2.7">B- (2.7)</option><option value="2.3">C+ (2.3)</option>
      <option value="2.0">C (2.0)</option><option value="1.0">D (1.0)</option>
      <option value="0">F (0.0)</option>
    </select>
    <input type="number" class="tool-input" placeholder="Credits" value="3" min="1" max="6" style="flex:0.8">
    <button onclick="this.parentElement.remove()" class="btn btn-secondary" style="width:auto">✕</button>`;
  rows.appendChild(div);
}
function calcGPA() {
  const rows = document.querySelectorAll('#gpaRows .tool-row');
  let totalPoints = 0, totalCredits = 0;
  rows.forEach(row => {
    const grade = +row.querySelector('select').value;
    const credits = +row.querySelectorAll('input')[1].value || 3;
    totalPoints += grade * credits;
    totalCredits += credits;
  });
  const gpa = totalCredits ? (totalPoints / totalCredits).toFixed(2) : 0;
  const label = gpa >= 3.7 ? '🏆 Distinction' : gpa >= 3.0 ? '✨ Merit' : gpa >= 2.0 ? '✅ Pass' : '⚠️ At Risk';
  document.getElementById('gpaOutput').textContent = `GPA: ${gpa} / 4.0  ${label}\nTotal Credits: ${totalCredits}`;
}

// AI Tool
async function runAI(id, prompt) {
  const input = document.getElementById('aiInput')?.value?.trim();
  if (!input) { toast('Please enter some text first', 'error'); return; }
  const out = document.getElementById('aiOutput');
  out.textContent = '🤖 Generating...';
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt + input }]
      })
    });
    const data = await res.json();
    out.textContent = data.content?.[0]?.text || 'No response received.';
    toast('Generated!');
  } catch(e) {
    out.textContent = 'Error: Could not reach AI API. Ensure API key is set.';
    toast('AI request failed', 'error');
  }
}

// ── Init Tool ─────────────────────────────────────────────────────────────
function initTool(id) {
  switch(id) {
    case 'color-picker': updateColor('#7c6cfc'); break;
    case 'gradient-gen': updateGradient(); break;
    case 'unit-conv': updateUnitOptions(); break;
    case 'emi-calc': calcEMI(); break;
    case 'tip-calc': calcTip(); break;
    case 'profit-calc': calcProfit(); break;
    case 'currency-conv': convertCurrency(); break;
    case 'typing-test': initTypingTest(); break;
    case 'notes': if(notes.length===0) notes=[{title:'',content:''}]; renderNoteTabs(); loadNote(); break;
    case 'todo': renderTodos(); break;
    case 'html-preview': setTimeout(previewHTML, 100); break;
    case 'markdown-prev': setTimeout(previewMarkdown, 100); break;
    case 'gpa-calc': addGPARow(); addGPARow(); addGPARow(); break;
    case 'uuid-gen': generateUUID(); break;
    case 'qr-gen': generateQR(); break;
    case 'password-gen': generatePassword(); break;
    case 'regex-test': setTimeout(testRegex, 100); break;
  }
}

// ── Render App ─────────────────────────────────────────────────────────────
function renderApp() {
  // Categories
  const catWrap = document.getElementById('categoriesWrap');
  catWrap.innerHTML = CATEGORIES.map(c => `
    <a href="#" class="cat-pill ${c.slug==='all'?'active':''}" data-cat="${c.slug}" onclick="filterCat(event,'${c.slug}')">
      <span class="cat-icon">${c.icon}</span>${c.name}
    </a>`).join('');

  // Tools Grid
  const grid = document.getElementById('toolsGrid');
  const grouped = {};
  TOOLS.forEach(t => { if(!grouped[t.cat]) grouped[t.cat]=[]; grouped[t.cat].push(t); });
  grid.innerHTML = Object.entries(grouped).map(([cat, tools]) => `
    <div class="tool-section-group" data-cat="${tools[0].catSlug}">
      <div class="section-header"><h2 class="section-title"><span></span>${cat}</h2></div>
      <div class="tools-grid">${tools.map(t => `
        <a href="#" class="tool-card" onclick="event.preventDefault();openTool('${t.id}')">
          ${t.badge ? `<span class="card-badge badge-${t.badge}">${t.badge}</span>` : ''}
          <span class="card-icon">${t.icon}</span>
          <div class="card-title">${t.name}</div>
          <div class="card-desc">${t.desc}</div>
        </a>`).join('')}
      </div>
    </div>`).join('');
}

function filterCat(e, slug) {
  e.preventDefault();
  document.querySelectorAll('.cat-pill').forEach(p => p.classList.remove('active'));
  e.currentTarget.classList.add('active');
  document.querySelectorAll('.tool-section-group').forEach(g => {
    g.classList.toggle('hidden', slug !== 'all' && g.dataset.cat !== slug);
  });
  document.getElementById('toolsGrid').scrollIntoView({behavior:'smooth', block:'start'});
}

// ── Search ─────────────────────────────────────────────────────────────────
function setupSearch() {
  const inputs = [document.getElementById('heroSearch'), document.getElementById('navSearch')];
  inputs.forEach(inp => {
    if (!inp) return;
    inp.addEventListener('input', () => {
      const q = inp.value.toLowerCase();
      const resultsEl = inp.closest('.search-box')?.querySelector('.search-results') ||
                        inp.closest('.nav-search')?.querySelector('.search-results');
      if (!resultsEl) return;
      if (!q) { resultsEl.classList.remove('show'); return; }
      const matches = TOOLS.filter(t => t.name.toLowerCase().includes(q) || t.cat.toLowerCase().includes(q) || t.desc.toLowerCase().includes(q)).slice(0,8);
      if (!matches.length) { resultsEl.classList.remove('show'); return; }
      resultsEl.innerHTML = matches.map(t => `
        <div class="search-result-item" onclick="openTool('${t.id}');resultsEl.classList.remove('show');inp.value=''">
          <span class="result-icon">${t.icon}</span>
          <div class="result-info"><div class="result-name">${t.name}</div><div class="result-cat">${t.cat}</div></div>
        </div>`).join('');
      resultsEl.classList.add('show');
    });
    inp.addEventListener('keydown', e => { if(e.key==='Escape') { inp.closest('.search-box')?.querySelector('.search-results')?.classList.remove('show'); } });
  });
  document.addEventListener('click', e => {
    if (!e.target.closest('.search-box') && !e.target.closest('.nav-search'))
      document.querySelectorAll('.search-results').forEach(r => r.classList.remove('show'));
  });
}

// ── Mobile Menu ────────────────────────────────────────────────────────────
function toggleMenu() { document.getElementById('mobileMenu').classList.toggle('open'); }

// ── Counter Animation ──────────────────────────────────────────────────────
function animateCounters() {
  document.querySelectorAll('.stat-num').forEach(el => {
    const target = +el.dataset.target;
    let current = 0;
    const step = target / 60;
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = Math.floor(current) + (el.dataset.suffix || '');
      if (current >= target) clearInterval(timer);
    }, 16);
  });
}

// ── Init ──────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  renderApp();
  setupSearch();
  animateCounters();

  document.getElementById('modalOverlay').addEventListener('click', e => {
    if (e.target === document.getElementById('modalOverlay')) closeTool();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeTool();
  });
});
