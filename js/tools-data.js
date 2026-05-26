const TOOLS = [
  // PDF Tools
  { id: 'pdf-merge', icon: '📄', name: 'Merge PDF', desc: 'Combine multiple PDFs into one file', cat: 'PDF Tools', catSlug: 'pdf', badge: null },
  { id: 'pdf-split', icon: '✂️', name: 'Split PDF', desc: 'Split PDF into separate pages', cat: 'PDF Tools', catSlug: 'pdf', badge: null },
  { id: 'pdf-compress', icon: '🗜️', name: 'Compress PDF', desc: 'Reduce PDF file size', cat: 'PDF Tools', catSlug: 'pdf', badge: null },
  { id: 'img-to-pdf', icon: '🖼️', name: 'Image to PDF', desc: 'Convert JPG/PNG images to PDF', cat: 'PDF Tools', catSlug: 'pdf', badge: null },
  { id: 'pdf-lock', icon: '🔒', name: 'Lock PDF', desc: 'Password protect your PDF files', cat: 'PDF Tools', catSlug: 'pdf', badge: null },
  { id: 'pdf-unlock', icon: '🔓', name: 'Unlock PDF', desc: 'Remove password from PDF files', cat: 'PDF Tools', catSlug: 'pdf', badge: null },
  // Image Tools
  { id: 'img-compress', icon: '📸', name: 'Image Compressor', desc: 'Shrink image file size without quality loss', cat: 'Image Tools', catSlug: 'image', badge: 'hot' },
  { id: 'img-resize', icon: '📐', name: 'Resize Image', desc: 'Change image dimensions quickly', cat: 'Image Tools', catSlug: 'image', badge: null },
  { id: 'img-crop', icon: '✂️', name: 'Crop Image', desc: 'Crop images to any size or ratio', cat: 'Image Tools', catSlug: 'image', badge: null },
  { id: 'bg-remove', icon: '🎭', name: 'Background Remover', desc: 'Remove background from photos instantly', cat: 'Image Tools', catSlug: 'image', badge: 'ai' },
  { id: 'meme-gen', icon: '😂', name: 'Meme Generator', desc: 'Create memes with custom text', cat: 'Image Tools', catSlug: 'image', badge: 'hot' },
  { id: 'qr-gen', icon: '📱', name: 'QR Code Generator', desc: 'Generate QR codes for any URL or text', cat: 'Image Tools', catSlug: 'image', badge: null },
  { id: 'color-picker', icon: '🎨', name: 'Color Picker', desc: 'Pick colors and get HEX, RGB, HSL values', cat: 'Image Tools', catSlug: 'image', badge: null },
  { id: 'gradient-gen', icon: '🌈', name: 'Gradient Generator', desc: 'Create beautiful CSS gradients', cat: 'Image Tools', catSlug: 'image', badge: null },
  // AI Tools
  { id: 'ai-summarizer', icon: '🤖', name: 'AI Text Summarizer', desc: 'Summarize any text with AI', cat: 'AI Tools', catSlug: 'ai', badge: 'ai' },
  { id: 'ai-email', icon: '📧', name: 'AI Email Writer', desc: 'Write professional emails with AI', cat: 'AI Tools', catSlug: 'ai', badge: 'ai' },
  { id: 'ai-hashtags', icon: '#️⃣', name: 'AI Hashtag Generator', desc: 'Generate trending hashtags for social media', cat: 'AI Tools', catSlug: 'ai', badge: 'ai' },
  { id: 'ai-caption', icon: '💬', name: 'AI Caption Generator', desc: 'Generate captions for your photos', cat: 'AI Tools', catSlug: 'ai', badge: 'ai' },
  // Developer Tools
  { id: 'json-format', icon: '{ }', name: 'JSON Formatter', desc: 'Format and validate JSON data', cat: 'Developer Tools', catSlug: 'dev', badge: 'hot' },
  { id: 'base64', icon: '🔡', name: 'Base64 Encoder/Decoder', desc: 'Encode and decode Base64 strings', cat: 'Developer Tools', catSlug: 'dev', badge: null },
  { id: 'regex-test', icon: '🔍', name: 'Regex Tester', desc: 'Test and debug regular expressions', cat: 'Developer Tools', catSlug: 'dev', badge: null },
  { id: 'uuid-gen', icon: '🆔', name: 'UUID Generator', desc: 'Generate unique identifiers (UUID/GUID)', cat: 'Developer Tools', catSlug: 'dev', badge: null },
  { id: 'html-preview', icon: '🌐', name: 'HTML Previewer', desc: 'Preview HTML code in real-time', cat: 'Developer Tools', catSlug: 'dev', badge: null },
  { id: 'markdown-prev', icon: '📝', name: 'Markdown Previewer', desc: 'Preview Markdown as rendered HTML', cat: 'Developer Tools', catSlug: 'dev', badge: null },
  // Student Tools
  { id: 'notes', icon: '📓', name: 'Notes App', desc: 'Take and save notes locally', cat: 'Student Tools', catSlug: 'student', badge: null },
  { id: 'typing-test', icon: '⌨️', name: 'Typing Speed Test', desc: 'Measure your WPM typing speed', cat: 'Student Tools', catSlug: 'student', badge: 'hot' },
  { id: 'flashcards', icon: '🃏', name: 'Flashcard Maker', desc: 'Create and study digital flashcards', cat: 'Student Tools', catSlug: 'student', badge: 'new' },
  { id: 'gpa-calc', icon: '🎓', name: 'GPA Calculator', desc: 'Calculate your GPA quickly', cat: 'Student Tools', catSlug: 'student', badge: null },
  { id: 'unit-conv', icon: '📏', name: 'Unit Converter', desc: 'Convert between measurement units', cat: 'Student Tools', catSlug: 'student', badge: null },
  { id: 'sci-calc', icon: '🧮', name: 'Scientific Calculator', desc: 'Advanced calculator with functions', cat: 'Student Tools', catSlug: 'student', badge: null },
  // Finance Tools
  { id: 'emi-calc', icon: '🏦', name: 'EMI Calculator', desc: 'Calculate loan EMI payments', cat: 'Finance Tools', catSlug: 'finance', badge: null },
  { id: 'currency-conv', icon: '💱', name: 'Currency Converter', desc: 'Convert between world currencies', cat: 'Finance Tools', catSlug: 'finance', badge: null },
  { id: 'tip-calc', icon: '🧾', name: 'Tip Calculator', desc: 'Calculate tips and split bills', cat: 'Finance Tools', catSlug: 'finance', badge: null },
  { id: 'profit-calc', icon: '📈', name: 'Profit Calculator', desc: 'Calculate profit margins and markup', cat: 'Finance Tools', catSlug: 'finance', badge: null },
  // Utility Tools
  { id: 'password-gen', icon: '🔐', name: 'Password Generator', desc: 'Generate strong, secure passwords', cat: 'Utility Tools', catSlug: 'utility', badge: 'hot' },
  { id: 'pomodoro', icon: '🍅', name: 'Pomodoro Timer', desc: 'Focus timer using the Pomodoro technique', cat: 'Utility Tools', catSlug: 'utility', badge: null },
  { id: 'todo', icon: '✅', name: 'To-Do List', desc: 'Manage tasks with a clean interface', cat: 'Utility Tools', catSlug: 'utility', badge: null },
  { id: 'word-count', icon: '📊', name: 'Word Counter', desc: 'Count words, characters and sentences', cat: 'Utility Tools', catSlug: 'utility', badge: null },
  { id: 'stopwatch', icon: '⏱️', name: 'Stopwatch', desc: 'Precise stopwatch with lap tracking', cat: 'Utility Tools', catSlug: 'utility', badge: null },
  { id: 'countdown', icon: '⏳', name: 'Countdown Timer', desc: 'Set countdown timers for any duration', cat: 'Utility Tools', catSlug: 'utility', badge: null },
  { id: 'lorem-gen', icon: '📄', name: 'Lorem Ipsum Generator', desc: 'Generate placeholder text instantly', cat: 'Utility Tools', catSlug: 'utility', badge: null },
];

const CATEGORIES = [
  { slug: 'all', name: 'All Tools', icon: '⚡' },
  { slug: 'pdf', name: 'PDF Tools', icon: '📄' },
  { slug: 'image', name: 'Image Tools', icon: '🖼️' },
  { slug: 'ai', name: 'AI Tools', icon: '🤖' },
  { slug: 'dev', name: 'Developer', icon: '💻' },
  { slug: 'student', name: 'Student', icon: '🎓' },
  { slug: 'finance', name: 'Finance', icon: '💰' },
  { slug: 'utility', name: 'Utility', icon: '🛠️' },
];
