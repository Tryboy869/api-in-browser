/**
 * API in Browser — Main Entry Point
 * Turn any browser tab into a REST API server
 * 
 * @author Daouda Abdoul Anzize <anzizdaouda0@gmail.com>
 * @license MIT
 */

import { BrowserServer } from './core/server.js';
import { Router } from './core/router.js';
import { Storage } from './core/storage.js';

export default class APIinBrowser {
  constructor(options = {}) {
    this.options = {
      polling: options.polling || false,
      pollingInterval: options.pollingInterval || 2000,
      cors: options.cors !== false,
      storage: options.storage || 'indexeddb',
      debug: options.debug || false
    };

    this.server = new BrowserServer(this.options);
    this.router = new Router();
    this.storage = new Storage(this.options.storage);

    this._initialized = false;
  }

  /**
   * Define GET route
   */
  get(path, handler) {
    this.router.add('GET', path, handler);
    return this;
  }

  /**
   * Define POST route
   */
  post(path, handler) {
    this.router.add('POST', path, handler);
    return this;
  }

  /**
   * Define PUT route
   */
  put(path, handler) {
    this.router.add('PUT', path, handler);
    return this;
  }

  /**
   * Define DELETE route
   */
  delete(path, handler) {
    this.router.add('DELETE', path, handler);
    return this;
  }

  /**
   * Define PATCH route
   */
  patch(path, handler) {
    this.router.add('PATCH', path, handler);
    return this;
  }

  /**
   * Start the API server
   */
  async listen(callback) {
    if (this._initialized) {
      console.warn('[API in Browser] Already listening');
      return;
    }

    // Initialize storage
    await this.storage.init();

    // Start server with router
    this.server.start(this.router);

    this._initialized = true;

    if (this.options.debug) {
      console.log('[API in Browser] Server started');
      console.log('Routes:', this.router.routes);
    }

    if (callback) callback();
  }

  /**
   * Stop the API server
   */
  stop() {
    this.server.stop();
    this._initialized = false;
    if (this.options.debug) {
      console.log('[API in Browser] Server stopped');
    }
  }

  /**
   * Simplified Telegram Bot helper
   * 
   * @param {string} token - Bot token from @BotFather
   * @param {object} commands - Command handlers { '/start': (msg) => 'response' }
   */
  telegramBot(token, commands) {
    const API_URL = `https://api.telegram.org/bot${token}`;
    let offset = 0;

    const poll = async () => {
      try {
        const res = await fetch(`${API_URL}/getUpdates?offset=${offset}&timeout=1`);
        const data = await res.json();

        if (!data.ok) throw new Error(data.description);

        for (const update of data.result) {
          offset = update.update_id + 1;
          const msg = update.message;
          if (!msg || !msg.text) continue;

          const cmd = msg.text.split(' ')[0];
          const handler = commands[cmd] || commands['default'];

          if (handler) {
            const reply = typeof handler === 'function' ? handler(msg) : handler;
            await fetch(`${API_URL}/sendMessage`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ chat_id: msg.chat.id, text: reply })
            });
          }
        }
      } catch (e) {
        console.error('[Telegram Bot] Error:', e.message);
      }

      if (this._initialized) {
        setTimeout(poll, this.options.pollingInterval);
      }
    };

    // Start polling when server starts
    poll();
  }
}

// Named exports
export { APIinBrowser, BrowserServer, Router, Storage };
