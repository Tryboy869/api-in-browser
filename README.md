# 🌐 API in Browser

**Turn any browser tab into a REST API server. Zero backend needed.**

```javascript
import API from 'api-in-browser';

const api = new API();

api.get('/hello', (req, res) => {
  res.json({ message: 'Hello from your browser!' });
});

api.listen(); // API live at virtual port
```

No Node.js. No deployment. No servers. Just open an HTML file.

---

## 🎯 What This Is

A framework that transforms your browser into a **fully functional REST API server** using:
- **Polling or Service Workers** for request handling
- **IndexedDB** for persistent storage (60GB+ quota)
- **postMessage** for cross-tab communication
- **Web Workers** for concurrent processing

Perfect for:
- Telegram bots running in a browser tab
- Local-first apps with zero backend cost
- Prototyping APIs without servers
- P2P applications
- Edge computing experiments

---

## 🚀 Quick Start

### Installation

```bash
npm install api-in-browser
```

Or use CDN:

```html
<script type="module">
  import API from 'https://cdn.jsdelivr.net/npm/api-in-browser/src/index.js';
</script>
```

### Basic Example

```javascript
import API from 'api-in-browser';

const api = new API({
  polling: true,        // Enable polling mode
  pollingInterval: 2000 // Poll every 2 seconds
});

// Define routes
api.get('/users', async (req, res) => {
  const users = await api.storage.getAll('users');
  res.json(users);
});

api.post('/users', async (req, res) => {
  const user = req.body;
  await api.storage.set('users', user.id, user);
  res.json({ success: true, user });
});

// Start the API
api.listen(() => {
  console.log('API running in browser');
});
```

---

## 📋 Features

### ✅ REST API in Browser
- GET, POST, PUT, DELETE, PATCH
- Query parameters
- Request body parsing
- Response helpers (json, text, status)

### ✅ Built-in Storage
- IndexedDB wrapper with simple API
- 60GB+ storage quota (Chrome/Firefox)
- Persistent across sessions
- CRUD operations

### ✅ Telegram Bot Support
- Long-polling built-in
- Webhook simulation
- Message queue management

### ✅ Cross-Tab Communication
- Broadcast updates to all tabs
- Shared state across windows
- Event synchronization

### ✅ Zero Dependencies
- Pure JavaScript (ESM)
- No build step required
- Works in any modern browser

---

## 📖 API Reference

### Initialize

```javascript
const api = new API(options);
```

**Options:**
- `polling` (boolean): Enable polling mode for external requests
- `pollingInterval` (number): Polling frequency in ms (default: 2000)
- `cors` (boolean): Enable CORS headers (default: true)
- `storage` (string): Storage backend — 'indexeddb' or 'memory' (default: 'indexeddb')

### Routes

```javascript
api.get(path, handler)
api.post(path, handler)
api.put(path, handler)
api.delete(path, handler)
api.patch(path, handler)
```

**Handler signature:**
```javascript
(req, res) => {
  // req.params, req.query, req.body
  // res.json(), res.text(), res.status()
}
```

### Storage

```javascript
// Set data
await api.storage.set(store, key, value);

// Get data
const value = await api.storage.get(store, key);

// Get all from store
const items = await api.storage.getAll(store);

// Delete
await api.storage.delete(store, key);

// Clear store
await api.storage.clear(store);
```

### Start Server

```javascript
api.listen(callback);
```

---

## 💡 Examples

### 1. Simple REST API

```javascript
import API from 'api-in-browser';

const api = new API();

let counter = 0;

api.get('/counter', (req, res) => {
  res.json({ count: counter });
});

api.post('/counter/increment', (req, res) => {
  counter++;
  res.json({ count: counter });
});

api.listen();
```

### 2. Telegram Bot

```javascript
import API from 'api-in-browser';

const api = new API({ polling: true, pollingInterval: 2000 });
const TOKEN = 'YOUR_BOT_TOKEN';

api.telegramBot(TOKEN, {
  '/start': (msg) => `Hello ${msg.from.first_name}!`,
  '/help': () => 'Available commands: /start, /help, /ping',
  '/ping': () => 'Pong!'
});

api.listen();
```

### 3. Database with CRUD

```javascript
import API from 'api-in-browser';

const api = new API();

api.get('/todos', async (req, res) => {
  const todos = await api.storage.getAll('todos');
  res.json(todos);
});

api.post('/todos', async (req, res) => {
  const todo = { id: Date.now(), ...req.body };
  await api.storage.set('todos', todo.id, todo);
  res.json(todo);
});

api.delete('/todos/:id', async (req, res) => {
  await api.storage.delete('todos', req.params.id);
  res.json({ success: true });
});

api.listen();
```

---

## 🏗️ Architecture

```
Browser Tab
    │
    ├─► API Router (handles routes)
    ├─► Polling Engine (external requests)
    ├─► Storage Layer (IndexedDB)
    ├─► Worker Pool (concurrent tasks)
    └─► postMessage Bridge (cross-tab)
```

**How it works:**
1. Routes defined via `api.get()`, `api.post()`, etc.
2. Polling mode checks external APIs (Telegram, webhooks) every N seconds
3. Requests routed to handlers
4. IndexedDB for data persistence
5. postMessage for multi-tab synchronization

---

## ⚠️ Limitations

| Limitation | Reality |
|------------|---------|
| **Uptime** | Runs while browser tab is open. Close tab = offline. |
| **Concurrency** | ~10-50 req/sec depending on browser. Not for high-traffic. |
| **Storage** | 60GB in Chrome/Firefox. 15% disk quota in Safari WebView. |
| **Mobile** | Background tabs may pause after a few minutes. |
| **Security** | Your IP makes the requests. No server-side anonymity. |

**Use cases:**
- ✅ Personal bots, small group tools
- ✅ Prototyping and MVPs
- ✅ Local-first apps
- ✅ P2P experiments
- ❌ Production high-traffic APIs
- ❌ Apps requiring 24/7 uptime

---

## 🛠️ Development

```bash
git clone https://github.com/anzize/api-in-browser.git
cd api-in-browser
npm install
npm test
```

---

## 📦 Use Cases

### Telegram Bot (tested)
Run a Telegram bot from a single HTML file. No server, no deployment.

### Database in Browser
60GB+ storage for local-first apps. Sync when online, work offline.

### P2P Chat
Each browser tab is a node. postMessage for coordination.

### API Prototyping
Test API designs without deploying anything.

### Edge Computing
Distribute computation to user browsers.

---

## 🌟 Philosophy

> "The browser is the most distributed computer on Earth. Let's use it."

This framework embraces **Informatique Réalitaire** (Reality Computing) — building systems that work with physical constraints rather than against them.

No pretense of being a server. It's a browser that behaves like a server *when needed*.

---

## 👨‍💻 Author

**Daouda Abdoul Anzize** — Computational Paradigm Designer

*"I don't build apps. I build the clay others use to build apps."*

24 years old • Cotonou, Bénin → Global Remote

🧬 **What I Create:**
- Meta-Architectures → Systems that absorb multiple programming paradigms
- Universal Protocols → Standards for distributed systems reliability
- Emergent Computing → Solutions arising from simple physical laws
- AI Infrastructure → Collective intelligence platforms

🔬 **Featured Research:**
- **NEXUS AXION** — Universal computational framework
- **Nexus Backpressure Protocol** — 60%+ latency reduction in distributed systems
- **Informatique Réalitaire (IR)** — Framework for artificial cognition
- **Weak Hardware Booster** — 95% CPU reduction via semantic collision convergence

🛠️ **Stack:** Python, Rust, C++, JavaScript, Go  
📚 **Background:** Psychology Student → Self-Taught Systems Architect  
📫 **Contact:** anzizdaouda0@gmail.com  
🌐 **Portfolio:** [tryboy869.github.io/daa](https://tryboy869.github.io/daa)  
🐦 **Twitter/X:** [@Nexusstudio100](https://twitter.com/Nexusstudio100)  
💼 **LinkedIn:** [anzize-adéléké-daouda](https://linkedin.com/in/anzize)  

🎯 **Currently seeking:** Research engineering roles, AI infrastructure positions, Protocol design opportunities (Q1 2026)

---

## 📄 License

MIT © 2026 Daouda Abdoul Anzize

**Permission granted** to use, modify, and distribute. Attribution appreciated but not required.

---

## 🙏 Acknowledgments

Inspired by:
- The **Local-First** movement
- **CRDTs** and distributed systems research
- **Service Workers** spec
- **IndexedDB** as underrated infrastructure

Built with the philosophy that **constraints breed creativity**.

---

## 🔗 Links

- [GitHub Repository](https://github.com/Tryboy869/api-in-browser)
- [npm Package](https://www.npmjs.com/package/api-in-browser)
- [Documentation](https://github.com/Tryboy869/api-in-browser/tree/main/docs)
- [Examples](https://github.com/Tryboy869/api-in-browser/tree/main/examples)
- [Issues](https://github.com/Tryboy869/api-in-browser/issues)

---

**Made with ❤️ by Anzize — Proof that creativity transcends credentials.**
