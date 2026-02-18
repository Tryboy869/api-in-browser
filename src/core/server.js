/**
 * Browser Server — HTTP-like server running in browser
 */

export class BrowserServer {
  constructor(options = {}) {
    this.options = options;
    this.router = null;
    this.running = false;
    this.pollTimer = null;
  }

  /**
   * Start server with router
   */
  start(router) {
    this.router = router;
    this.running = true;

    // Setup postMessage listener for cross-tab communication
    this._setupMessageListener();

    // Start polling if enabled
    if (this.options.polling) {
      this._startPolling();
    }

    console.log('[BrowserServer] Started');
  }

  /**
   * Stop server
   */
  stop() {
    this.running = false;
    if (this.pollTimer) {
      clearTimeout(this.pollTimer);
      this.pollTimer = null;
    }
    console.log('[BrowserServer] Stopped');
  }

  /**
   * Setup cross-tab communication
   */
  _setupMessageListener() {
    window.addEventListener('message', async (event) => {
      // Ignore messages from same window
      if (event.source === window) return;

      const { type, request, requestId } = event.data;

      if (type === 'API_REQUEST') {
        const response = await this._handleRequest(request);
        event.source.postMessage({
          type: 'API_RESPONSE',
          requestId,
          response
        }, '*');
      }
    });
  }

  /**
   * Handle HTTP-like request
   */
  async _handleRequest(request) {
    const { method, path, query, body } = request;

    // Find route
    const route = this.router.match(method, path);

    if (!route) {
      return {
        status: 404,
        body: { error: 'Not Found' }
      };
    }

    // Build req/res objects
    const req = {
      method,
      path,
      params: route.params,
      query: query || {},
      body: body || null
    };

    const res = {
      status: 200,
      headers: {},
      body: null,

      json: function(data) {
        this.headers['Content-Type'] = 'application/json';
        this.body = data;
        return this;
      },

      text: function(data) {
        this.headers['Content-Type'] = 'text/plain';
        this.body = data;
        return this;
      },

      setStatus: function(code) {
        this.status = code;
        return this;
      }
    };

    // Execute handler
    try {
      await route.handler(req, res);
      return {
        status: res.status,
        headers: res.headers,
        body: res.body
      };
    } catch (error) {
      console.error('[BrowserServer] Handler error:', error);
      return {
        status: 500,
        body: { error: 'Internal Server Error', message: error.message }
      };
    }
  }

  /**
   * Polling for external requests (e.g., Telegram webhooks simulation)
   */
  _startPolling() {
    const poll = async () => {
      // This is a placeholder for external polling
      // Real implementation would check a queue or external API
      if (this.running) {
        this.pollTimer = setTimeout(poll, this.options.pollingInterval);
      }
    };
    poll();
  }

  /**
   * Manual request injection (for testing or manual triggers)
   */
  async request(method, path, options = {}) {
    return await this._handleRequest({
      method,
      path,
      query: options.query || {},
      body: options.body || null
    });
  }
}
