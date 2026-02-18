/**
 * Test Suite for API in Browser
 * Run: node tests/test.spec.js
 */

import { Router } from '../src/core/router.js';
import { Storage } from '../src/core/storage.js';

// Simple test framework
const tests = [];
let passed = 0;
let failed = 0;

function test(name, fn) {
  tests.push({ name, fn });
}

async function runTests() {
  console.log('\n🧪 Running Tests...\n');

  for (const { name, fn } of tests) {
    try {
      await fn();
      console.log(`✅ ${name}`);
      passed++;
    } catch (error) {
      console.log(`❌ ${name}`);
      console.log(`   Error: ${error.message}`);
      failed++;
    }
  }

  console.log(`\n📊 Results: ${passed} passed, ${failed} failed\n`);
  process.exit(failed > 0 ? 1 : 0);
}

function assertEqual(actual, expected, message = '') {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(`Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)} ${message}`);
  }
}

function assertExists(value, message = '') {
  if (value == null) {
    throw new Error(`Expected value to exist ${message}`);
  }
}

// ================================================================
// ROUTER TESTS
// ================================================================

test('Router: Simple GET route', () => {
  const router = new Router();
  router.add('GET', '/hello', () => {});
  
  const match = router.match('GET', '/hello');
  assertExists(match);
});

test('Router: Route with params', () => {
  const router = new Router();
  router.add('GET', '/users/:id', () => {});
  
  const match = router.match('GET', '/users/123');
  assertExists(match);
  assertEqual(match.params, { id: '123' });
});

test('Router: Multiple params', () => {
  const router = new Router();
  router.add('GET', '/users/:userId/posts/:postId', () => {});
  
  const match = router.match('GET', '/users/abc/posts/xyz');
  assertExists(match);
  assertEqual(match.params, { userId: 'abc', postId: 'xyz' });
});

test('Router: No match returns null', () => {
  const router = new Router();
  router.add('GET', '/hello', () => {});
  
  const match = router.match('GET', '/goodbye');
  assertEqual(match, null);
});

test('Router: Method mismatch returns null', () => {
  const router = new Router();
  router.add('GET', '/hello', () => {});
  
  const match = router.match('POST', '/hello');
  assertEqual(match, null);
});

// ================================================================
// STORAGE TESTS (Memory mode for Node.js)
// ================================================================

test('Storage: Set and get value', async () => {
  const storage = new Storage('memory');
  await storage.init();
  
  await storage.set('test', 'key1', 'value1');
  const value = await storage.get('test', 'key1');
  
  assertEqual(value, 'value1');
});

test('Storage: Get non-existent key returns null', async () => {
  const storage = new Storage('memory');
  await storage.init();
  
  const value = await storage.get('test', 'nonexistent');
  assertEqual(value, null);
});

test('Storage: GetAll returns all values', async () => {
  const storage = new Storage('memory');
  await storage.init();
  
  await storage.set('test', 'key1', 'value1');
  await storage.set('test', 'key2', 'value2');
  
  const values = await storage.getAll('test');
  assertEqual(values.length, 2);
});

test('Storage: Delete removes value', async () => {
  const storage = new Storage('memory');
  await storage.init();
  
  await storage.set('test', 'key1', 'value1');
  await storage.delete('test', 'key1');
  
  const value = await storage.get('test', 'key1');
  assertEqual(value, null);
});

test('Storage: Clear removes all values', async () => {
  const storage = new Storage('memory');
  await storage.init();
  
  await storage.set('test', 'key1', 'value1');
  await storage.set('test', 'key2', 'value2');
  await storage.clear('test');
  
  const values = await storage.getAll('test');
  assertEqual(values.length, 0);
});

// ================================================================
// RUN
// ================================================================

runTests();
