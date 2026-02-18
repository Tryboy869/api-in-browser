# API Reference

## Installation

```bash
npm install api-in-browser
```

```html
<script type="module">
  import API from 'https://cdn.jsdelivr.net/npm/api-in-browser/src/index.js';
</script>
```

---

## Constructor

### `new API(options)`

Create a new API instance.

**Options:**
- `polling` (boolean, default: `false`) — Enable polling mode for external requests
- `pollingInterval` (number, default: `2000`) — Polling frequency in milliseconds
- `cors` (boolean, default: `true`) — Enable CORS headers
- `storage` (string, default: `'indexeddb'`) — Storage backend (`'indexeddb'` or `'memory'`)
- `debug` (boolean, default: `false`) — Enable debug logging

**Example:**
```javascript
const api = new API({
  polling: true,
  pollingInterval: 2000,
  cors: true,
  storage: 'indexeddb',
  debug: true
});
```

---

## Routes

### `api.get(path, handler)`
Define a GET route.

### `api.post(path, handler)`
Define a POST route.

### `api.put(path, handler)`
Define a PUT route.

### `api.delete(path, handler)`
Define a DELETE route.

### `api.patch(path, handler)`
Define a PATCH route.

**Handler Signature:**
```javascript
(req, res) => {
  // Handle request
}
```

**Request Object (`req`):**
- `req.method` — HTTP method (GET, POST, etc.)
- `req.path` — Request path
- `req.params` — URL parameters (e.g., `:id`)
- `req.query` — Query string parameters
- `req.body` — Request body (parsed JSON)

**Response Object (`res`):**
- `res.json(data)` — Send JSON response
- `res.text(data)` — Send text response
- `res.setStatus(code)` — Set HTTP status code

**Example:**
```javascript
api.get('/users/:id', (req, res) => {
  res.json({
    id: req.params.id,
    name: `User ${req.params.id}`
  });
});
```

---

## Storage

### `api.storage.set(store, key, value)`
Store a value.

**Parameters:**
- `store` (string) — Store name (like a table)
- `key` (string) — Unique key
- `value` (any) — Value to store

**Returns:** Promise

**Example:**
```javascript
await api.storage.set('users', 'user_123', {
  name: 'John Doe',
  email: 'john@example.com'
});
```

---

### `api.storage.get(store, key)`
Retrieve a value.

**Returns:** Promise<value | null>

**Example:**
```javascript
const user = await api.storage.get('users', 'user_123');
```

---

### `api.storage.getAll(store)`
Get all values from a store.

**Returns:** Promise<Array>

**Example:**
```javascript
const users = await api.storage.getAll('users');
```

---

### `api.storage.delete(store, key)`
Delete a value.

**Example:**
```javascript
await api.storage.delete('users', 'user_123');
```

---

### `api.storage.clear(store)`
Clear all values from a store.

**Example:**
```javascript
await api.storage.clear('users');
```

---

## Server Control

### `api.listen(callback)`
Start the API server.

**Example:**
```javascript
api.listen(() => {
  console.log('API running');
});
```

---

### `api.stop()`
Stop the API server.

**Example:**
```javascript
api.stop();
```

---

## Telegram Bot Helper

### `api.telegramBot(token, commands)`
Quick Telegram bot setup.

**Parameters:**
- `token` (string) — Bot token from @BotFather
- `commands` (object) — Command handlers

**Example:**
```javascript
api.telegramBot('YOUR_BOT_TOKEN', {
  '/start': (msg) => `Hello ${msg.from.first_name}!`,
  '/help': () => 'Available commands: /start, /help',
  'default': (msg) => `You said: ${msg.text}`
});
```

---

## Manual Request Testing

### `api.server.request(method, path, options)`
Manually trigger a request (useful for testing).

**Example:**
```javascript
const result = await api.server.request('GET', '/users/123');
console.log(result.body);
```

---

## Storage Quotas

| Browser | Quota |
|---------|-------|
| Chrome | 60% of disk space |
| Firefox | 50% of disk space (persistent storage) |
| Safari macOS/iOS | 60% of disk space |
| Safari WebView | 15% only |

**Enable persistent storage:**
```javascript
if (navigator.storage && navigator.storage.persist) {
  await navigator.storage.persist();
}
```

---

## CORS

CORS is enabled by default. To customize:

```javascript
import { handleCors } from 'api-in-browser/src/utils/cors.js';

api.get('/data', (req, res) => {
  handleCors(req, res, 'https://example.com');
  res.json({ data: 'value' });
});
```

---

## Middleware

```javascript
import { logger, rateLimit } from 'api-in-browser/src/utils/middleware.js';

// Apply middleware (manual implementation needed)
api.get('/api/data', (req, res) => {
  logger(req, res, () => {
    res.json({ data: 'value' });
  });
});
```

---

## Error Handling

```javascript
api.get('/error', (req, res) => {
  try {
    throw new Error('Something went wrong');
  } catch (error) {
    res.setStatus(500).json({ error: error.message });
  }
});
```

---

## Best Practices

1. **Use persistent storage** for critical data
2. **Handle errors gracefully** in all routes
3. **Test with small datasets first** before scaling
4. **Monitor storage quota** regularly
5. **Keep polling intervals reasonable** (2-5 seconds)
6. **Validate all inputs** before storing

---

## Limitations

- **Not for high-traffic** — Max ~50 req/sec
- **Not persistent server** — Stops when tab closes
- **Mobile background** — May pause after a few minutes
- **Storage limits** — 60GB max (browser-dependent)

---

## TypeScript Support

Type definitions coming in v1.1.0.

---

## Contributing

Issues and PRs welcome at [github.com/Tryboy869/api-in-browser](https://github.com/Tryboy869/api-in-browser)
