/**
 * CORS Utilities
 */

export function corsHeaders(origin = '*') {
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400'
  };
}

export function handleCors(req, res, origin = '*') {
  Object.assign(res.headers, corsHeaders(origin));
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.setStatus(204);
    return true; // Preflight handled
  }
  
  return false; // Continue with normal handling
}
