/**
 * Router — URL pattern matching and route handling
 */

export class Router {
  constructor() {
    this.routes = [];
  }

  /**
   * Add a route
   */
  add(method, path, handler) {
    this.routes.push({
      method: method.toUpperCase(),
      path,
      pattern: this._pathToRegex(path),
      keys: this._extractKeys(path),
      handler
    });
  }

  /**
   * Match a request to a route
   */
  match(method, path) {
    for (const route of this.routes) {
      if (route.method !== method.toUpperCase()) continue;

      const match = path.match(route.pattern);
      if (!match) continue;

      // Extract params
      const params = {};
      route.keys.forEach((key, i) => {
        params[key] = match[i + 1];
      });

      return {
        handler: route.handler,
        params
      };
    }

    return null;
  }

  /**
   * Convert path pattern to regex
   * /users/:id → /^\/users\/([^\/]+)$/
   */
  _pathToRegex(path) {
    const pattern = path
      .replace(/\//g, '\\/')
      .replace(/:([a-zA-Z0-9_]+)/g, '([^\\/]+)');
    return new RegExp(`^${pattern}$`);
  }

  /**
   * Extract parameter keys from path
   * /users/:id/:action → ['id', 'action']
   */
  _extractKeys(path) {
    const keys = [];
    const matches = path.matchAll(/:([a-zA-Z0-9_]+)/g);
    for (const match of matches) {
      keys.push(match[1]);
    }
    return keys;
  }

  /**
   * Get all routes (for debugging)
   */
  getRoutes() {
    return this.routes.map(r => ({
      method: r.method,
      path: r.path
    }));
  }
}
