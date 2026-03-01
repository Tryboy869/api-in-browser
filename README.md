<div align="center">

[![gitsearch](https://raw.githubusercontent.com/Tryboy869/gitsearch/main/assets/badges/badge-indexed.svg)](https://tryboy869.github.io/gitsearch)
[![gitsearch-tags](https://raw.githubusercontent.com/Tryboy869/gitsearch/main/assets/badges/badge-tags.svg)](#)

<!-- gitsearch: browser-api, local-first, indexeddb, service-worker, telegram-bot, rest-api, polling, web-worker, zero-backend, p2p, javascript, typescript -->

<img src="https://raw.githubusercontent.com/Tryboy869/api-in-browser/main/assets/logo.svg" width="64" height="64" alt="API in Browser"/>

# API in Browser

**Turn any browser tab into a REST API server. Zero backend needed.**

[![npm version](https://img.shields.io/npm/v/api-in-browser?style=for-the-badge&logo=npm&color=cb3837)](https://www.npmjs.com/package/api-in-browser)
[![npm downloads](https://img.shields.io/npm/dt/api-in-browser?style=for-the-badge&logo=npm&color=cb3837)](https://www.npmjs.com/package/api-in-browser)
[![GitHub stars](https://img.shields.io/github/stars/Tryboy869/api-in-browser?style=for-the-badge&logo=github&color=181717)](https://github.com/Tryboy869/api-in-browser)
[![License](https://img.shields.io/npm/l/api-in-browser?style=for-the-badge&color=10b981)](LICENSE)
[![Build Status](https://img.shields.io/github/actions/workflow/status/Tryboy869/api-in-browser/test.yml?style=for-the-badge&logo=github-actions)](https://github.com/Tryboy869/api-in-browser/actions)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/api-in-browser?style=for-the-badge&logo=webpack&color=8dd6f9)](https://bundlephobia.com/package/api-in-browser)
[![TypeScript](https://img.shields.io/badge/types-included-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)

<img src="https://raw.githubusercontent.com/Tryboy869/api-in-browser/main/assets/demo.svg" alt="Demo Animation" width="100%"/>

[📦 Install](#-quick-start) • [📖 Docs](https://github.com/Tryboy869/api-in-browser/tree/main/docs) • [🎯 Examples](#-examples) • [💬 Community](https://github.com/Tryboy869/api-in-browser/discussions)

</div>

---

## 🎯 What This Is

```javascript
import API from 'api-in-browser';

const api = new API();

api.get('/hello', (req, res) => {
  res.json({ message: 'Hello from your browser!' });
});

api.listen(); // API running — no server needed
```

A framework that transforms your browser into a **fully functional REST API server** using:

| Feature | Technology |
|---------|------------|
| 🔄 **Request Handling** | Polling / Service Workers |
| 💾 **Storage** | IndexedDB (60GB+) |
| 🔗 **Cross-Tab** | postMessage API |
| ⚡ **Concurrency** | Web Workers |

**Perfect for:**
- 🤖 Telegram bots running in a browser tab
- 💼 Local-first apps with zero backend cost
- 🧪 Prototyping APIs without servers
- 🌐 P2P applications
- ⚡ Edge computing experiments

---

## 🚀 Quick Start

### Installation

```bash
npm install api-in-browser
```

Or via CDN:

```html
<script type="module">
  import API from 'https://cdn.jsdelivr.net/npm/api-in-browser/src/index.js';
</script>
```

### Your First API (30 seconds)

```javascript
import API from 'api-in-browser';

const api = new API({
  polling: true,
  pollingInterval: 2000
});

api.get('/users', async (req, res) => {
  const users = await api.storage.getAll('users');
  res.json(users);
});

api.post('/users', async (req, res) => {
  const user = req.body;
  await api.storage.set('users', user.id, user);
  res.json({ success: true, user });
});

api.listen(() => console.log('🚀 API running in browser'));
```

---

## ✨ Features

### 🎯 REST API in Browser
- GET, POST, PUT, DELETE, PATCH
- Query parameters & body parsing
- Response helpers: `json()`, `text()`, `setStatus()`

### 💾 Built-in Storage
- IndexedDB wrapper with dead-simple API
- 60GB+ quota (Chrome/Firefox)
- Persistent across sessions — no setup

### 🤖 Telegram Bot Support
- Long-polling built-in — no webhook server needed
- Message queue management
- Handler-based routing (`/start`, `/help`, etc.)

### 🔗 Cross-Tab Communication
- Broadcast updates via `postMessage`
- Shared state between tabs
- Event synchronization

---

## 💡 Examples

### 1️⃣ Simple Counter API

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

### 2️⃣ Telegram Bot

```javascript
import API from 'api-in-browser';

const api = new API({ polling: true, pollingInterval: 2000 });

api.telegramBot('YOUR_BOT_TOKEN', {
  '/start': (msg) => `Hello ${msg.from.first_name}!`,
  '/help':  () => 'Commands: /start, /help, /ping',
  '/ping':  () => 'Pong! 🏓'
});

api.listen();
```

### 3️⃣ Todo List with Storage

```javascript
import API from 'api-in-browser';

const api = new API();

api.get('/todos', async (req, res) => {
  res.json(await api.storage.getAll('todos'));
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

[📂 More Examples](https://github.com/Tryboy869/api-in-browser/tree/main/examples)

---

## ⚠️ Limitations

| Aspect | Reality | Use Case |
|--------|---------|----------|
| **Uptime** | Runs while tab is open | ✅ Personal tools |
| **Concurrency** | ~10-50 req/sec | ✅ Small groups |
| **Storage** | 60GB (Chrome/Firefox) | ✅ Local-first |
| **Mobile** | May pause in background | ⚠️ Desktop recommended |
| **Security** | Your IP = API IP | ✅ Private use |

**Perfect for:** Personal bots, MVPs, local-first apps, P2P experiments.

**Not suitable for:** Production high-traffic APIs, apps requiring 24/7 uptime.

---

## 📖 API Reference

### Initialization

```javascript
const api = new API(options);
```

**Options:**
| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `polling` | boolean | false | Enable polling mode |
| `pollingInterval` | number | 2000 | Polling frequency (ms) |
| `cors` | boolean | true | Enable CORS headers |
| `storage` | string | 'indexeddb' | Storage backend |
| `debug` | boolean | false | Debug logging |

### Routes

```javascript
api.get(path, handler)
api.post(path, handler)
api.put(path, handler)
api.delete(path, handler)
api.patch(path, handler)
```

**Handler:** `(req, res) => { }` where:
- `req`: `{ method, path, params, query, body }`
- `res`: `{ json(), text(), setStatus() }`

### Storage

```javascript
await api.storage.set(store, key, value)
await api.storage.get(store, key)
await api.storage.getAll(store)
await api.storage.delete(store, key)
await api.storage.clear(store)
```

[📚 Full API Documentation](https://github.com/Tryboy869/api-in-browser/tree/main/docs)

---

## 🌟 Philosophy

> *"The browser is the most distributed computer on Earth. Let's use it."*

This framework embraces **Informatique Réalitaire** (Reality Computing) — building systems that work *with* physical constraints rather than against them.

No pretense of being a server. It's a browser that behaves like a server *when needed*.

---

## 👨‍💻 Author

<div align="center">

<img src="https://raw.githubusercontent.com/Tryboy869/api-in-browser/main/assets/contributor-anzize.svg" alt="Daouda Abdoul Anzize" width="600"/>

**Daouda Abdoul Anzize** — Computational Paradigm Designer

*"I don't build apps. I build the clay others use to build apps."*

24 ans • Cotonou, Bénin → Global Remote

</div>

**What I Create:**
- **Meta-Architectures** → Systems that absorb multiple programming paradigms
- **Universal Protocols** → Standards for distributed systems reliability
- **Emergent Computing** → Solutions arising from simple physical laws
- **AI Infrastructure** → Collective intelligence platforms

**Featured Research:**
- **NEXUS AXION** — Universal computational framework
- **Nexus Backpressure Protocol** — 60%+ latency reduction in distributed systems
- **Informatique Réalitaire (IR)** — Framework for artificial cognition
- **Weak Hardware Booster** — 95% CPU reduction via semantic collision convergence
- **API in Browser** — REST API server running inside a browser tab

**Stack:** Python · Rust · C++ · JavaScript · Go

[![Email](https://img.shields.io/badge/Email-anzizdaouda0@gmail.com-EA4335?style=flat-square&logo=gmail)](mailto:anzizdaouda0@gmail.com)
[![Portfolio](https://img.shields.io/badge/Portfolio-tryboy869.github.io-181717?style=flat-square&logo=github)](https://tryboy869.github.io/daa)
[![Twitter](https://img.shields.io/badge/Twitter-@Nexusstudio100-1DA1F2?style=flat-square&logo=twitter)](https://twitter.com/Nexusstudio100)

🎯 Seeking: Research engineering · AI infrastructure · Protocol design (Q1 2026)

---

## 📄 License

MIT © 2026 Daouda Abdoul Anzize — Use freely, attribution appreciated.

---

## 🙏 Acknowledgments

Inspired by the **Local-First** movement, **CRDTs**, **Service Workers**, and **IndexedDB** as underrated infrastructure.

Built with the philosophy that **constraints breed creativity**.

---

<div align="center">

[![GitHub](https://img.shields.io/badge/GitHub-Tryboy869/api--in--browser-181717?style=for-the-badge&logo=github)](https://github.com/Tryboy869/api-in-browser)
[![npm](https://img.shields.io/badge/npm-api--in--browser-CB3837?style=for-the-badge&logo=npm)](https://www.npmjs.com/package/api-in-browser)

**Made with ❤️ by [Nexus Studio](https://github.com/Tryboy869)**

*Proof that creativity transcends credentials*

<img src="https://raw.githubusercontent.com/Tryboy869/api-in-browser/main/assets/footer-wave.svg" alt="" width="100%"/>

</div>
