/**
 * Storage — IndexedDB wrapper with simple API
 */

export class Storage {
  constructor(type = 'indexeddb') {
    this.type = type;
    this.db = null;
    this.dbName = 'api-in-browser-db';
    this.memoryStore = {}; // Fallback
  }

  /**
   * Initialize storage
   */
  async init() {
    if (this.type === 'memory') {
      return; // Memory storage needs no initialization
    }

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        // Create default object stores
        if (!db.objectStoreNames.contains('default')) {
          db.createObjectStore('default', { keyPath: 'id' });
        }
      };
    });
  }

  /**
   * Set a value
   * @param {string} store - Store name (table)
   * @param {string} key - Key
   * @param {any} value - Value to store
   */
  async set(store, key, value) {
    if (this.type === 'memory') {
      if (!this.memoryStore[store]) this.memoryStore[store] = {};
      this.memoryStore[store][key] = value;
      return;
    }

    await this._ensureStore(store);

    return new Promise((resolve, reject) => {
      const tx = this.db.transaction([store], 'readwrite');
      const objectStore = tx.objectStore(store);
      const request = objectStore.put({ id: key, value });

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Get a value
   */
  async get(store, key) {
    if (this.type === 'memory') {
      return this.memoryStore[store]?.[key] || null;
    }

    await this._ensureStore(store);

    return new Promise((resolve, reject) => {
      const tx = this.db.transaction([store], 'readonly');
      const objectStore = tx.objectStore(store);
      const request = objectStore.get(key);

      request.onsuccess = () => {
        const result = request.result;
        resolve(result ? result.value : null);
      };
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Get all values from a store
   */
  async getAll(store) {
    if (this.type === 'memory') {
      return Object.values(this.memoryStore[store] || {});
    }

    await this._ensureStore(store);

    return new Promise((resolve, reject) => {
      const tx = this.db.transaction([store], 'readonly');
      const objectStore = tx.objectStore(store);
      const request = objectStore.getAll();

      request.onsuccess = () => {
        const results = request.result.map(item => item.value);
        resolve(results);
      };
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Delete a value
   */
  async delete(store, key) {
    if (this.type === 'memory') {
      if (this.memoryStore[store]) {
        delete this.memoryStore[store][key];
      }
      return;
    }

    await this._ensureStore(store);

    return new Promise((resolve, reject) => {
      const tx = this.db.transaction([store], 'readwrite');
      const objectStore = tx.objectStore(store);
      const request = objectStore.delete(key);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Clear entire store
   */
  async clear(store) {
    if (this.type === 'memory') {
      this.memoryStore[store] = {};
      return;
    }

    await this._ensureStore(store);

    return new Promise((resolve, reject) => {
      const tx = this.db.transaction([store], 'readwrite');
      const objectStore = tx.objectStore(store);
      const request = objectStore.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Ensure store exists (create if needed)
   */
  async _ensureStore(storeName) {
    if (this.db.objectStoreNames.contains(storeName)) {
      return;
    }

    // Need to close and reopen with higher version to add store
    const currentVersion = this.db.version;
    this.db.close();

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, currentVersion + 1);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName, { keyPath: 'id' });
        }
      };
    });
  }
}
