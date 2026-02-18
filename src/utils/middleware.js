/**
 * Middleware Utilities
 */

/**
 * JSON body parser middleware
 */
export function jsonParser(req, res, next) {
  if (req.body && typeof req.body === 'string') {
    try {
      req.body = JSON.parse(req.body);
    } catch (e) {
      res.setStatus(400).json({ error: 'Invalid JSON' });
      return;
    }
  }
  next();
}

/**
 * Logger middleware
 */
export function logger(req, res, next) {
  const start = Date.now();
  console.log(`[${req.method}] ${req.path}`);
  
  next();
  
  const duration = Date.now() - start;
  console.log(`[${req.method}] ${req.path} - ${res.status} (${duration}ms)`);
}

/**
 * Rate limiter middleware
 */
export function rateLimit(maxRequests = 100, windowMs = 60000) {
  const requests = new Map();
  
  return (req, res, next) => {
    const key = req.ip || 'unknown';
    const now = Date.now();
    
    if (!requests.has(key)) {
      requests.set(key, []);
    }
    
    const userRequests = requests.get(key);
    const recentRequests = userRequests.filter(time => now - time < windowMs);
    
    if (recentRequests.length >= maxRequests) {
      res.setStatus(429).json({ error: 'Too Many Requests' });
      return;
    }
    
    recentRequests.push(now);
    requests.set(key, recentRequests);
    
    next();
  };
}
